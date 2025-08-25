// LIBRARY CONTROLLER - COMMENTED OUT FOR MVP
// TODO: Uncomment when library feature is needed in future release

/*
const prisma = require('../lib/prisma');

// CATEGORY CONTROLLERS

// Get all categories
const getCategories = async (req, res, next) => {
  try {
    const { includeInactive = false } = req.query;
    
    const where = includeInactive === 'true' ? {} : { isActive: true };
    
    const categories = await prisma.libraryCategory.findMany({
      where,
      include: {
        _count: {
          select: {
            books: {
              where: { isAvailable: true, isPublic: true }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });


    res.status(200).json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
};

// Create category (Admin only)
const createCategory = async (req, res, next) => {
  try {
    const { name, description, color } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Le nom de la catégorie est requis'
      });
    }

    const category = await prisma.libraryCategory.create({
      data: {
        name,
        description,
        color: color || '#3B82F6'
      }
    });


    res.status(201).json({
      success: true,
      data: { category },
      message: 'Catégorie créée avec succès'
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: 'Cette catégorie existe déjà'
      });
    }
    next(error);
  }
};

// Update category (Admin only)
const updateCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { name, description, color, isActive } = req.body;

    const category = await prisma.libraryCategory.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Catégorie non trouvée'
      });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (color !== undefined) updateData.color = color;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    const updatedCategory = await prisma.libraryCategory.update({
      where: { id: categoryId },
      data: updateData
    });


    res.status(200).json({
      success: true,
      data: { category: updatedCategory },
      message: 'Catégorie mise à jour avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// Delete category (Admin only)
const deleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const category = await prisma.libraryCategory.findUnique({
      where: { id: categoryId },
      include: { _count: { select: { books: true } } }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Catégorie non trouvée'
      });
    }

    if (category._count.books > 0) {
      return res.status(400).json({
        success: false,
        error: 'Impossible de supprimer une catégorie contenant des livres'
      });
    }

    await prisma.libraryCategory.delete({
      where: { id: categoryId }
    });


    res.status(200).json({
      success: true,
      message: 'Catégorie supprimée avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// BOOK CONTROLLERS

// Get all books with pagination and filters
const getBooks = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      categoryId,
      author,
      language,
      fileType,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      showAll = false
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filters
    const where = {};
    
    // Public visibility (unless admin requesting all)
    if (showAll !== 'true' || req.user?.role !== 'ADMIN') {
      where.isPublic = true;
      where.isAvailable = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ];
    }

    if (categoryId) where.categoryId = categoryId;
    if (author) where.author = { contains: author, mode: 'insensitive' };
    if (language) where.language = language;
    if (fileType) where.fileType = fileType.toUpperCase();

    const [books, totalCount] = await Promise.all([
      prisma.libraryBook.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, color: true }
          },
          uploader: {
            select: { id: true, firstName: true, lastName: true }
          },
          _count: {
            select: {
              bookmarks: true,
              reviews: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: {
          [sortBy]: sortOrder
        }
      }),
      prisma.libraryBook.count({ where })
    ]);


    res.status(200).json({
      success: true,
      data: {
        books,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount,
          hasNext: skip + books.length < totalCount,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single book by ID
const getBookById = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const book = await prisma.libraryBook.findUnique({
      where: { id: bookId },
      include: {
        category: true,
        uploader: {
          select: { id: true, firstName: true, lastName: true }
        },
        reviews: {
          where: { isPublic: true },
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            bookmarks: true,
            reviews: true,
            downloads_log: true
          }
        }
      }
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Livre non trouvé'
      });
    }

    // Check visibility
    if (!book.isPublic && req.user?.role !== 'ADMIN' && book.uploadedBy !== req.user?.id) {
      return res.status(403).json({
        success: false,
        error: 'Accès non autorisé à ce livre'
      });
    }

    // Increment view count
    await prisma.libraryBook.update({
      where: { id: bookId },
      data: { views: { increment: 1 } }
    });

    // Check if user has bookmarked this book
    let isBookmarked = false;
    if (req.user) {
      const bookmark = await prisma.libraryBookmark.findUnique({
        where: { userId_bookId: { userId: req.user.id, bookId } }
      });
      isBookmarked = !!bookmark;
    }


    res.status(200).json({
      success: true,
      data: { 
        book: {
          ...book,
          isBookmarked
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create new book (Authenticated users)
const createBook = async (req, res, next) => {
  try {
    const {
      title,
      author,
      isbn,
      description,
      coverImage,
      fileUrl,
      fileType,
      fileSize,
      pages,
      language,
      publishedAt,
      categoryId,
      tags,
      isPublic
    } = req.body;

    if (!title || !author || !categoryId) {
      return res.status(400).json({
        success: false,
        error: 'Titre, auteur et catégorie sont requis'
      });
    }

    // Verify category exists
    const category = await prisma.libraryCategory.findUnique({
      where: { id: categoryId, isActive: true }
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        error: 'Catégorie invalide ou inactive'
      });
    }

    const book = await prisma.libraryBook.create({
      data: {
        title,
        author,
        isbn,
        description,
        coverImage,
        fileUrl,
        fileType: fileType?.toUpperCase() || 'PDF',
        fileSize: fileSize ? parseInt(fileSize) : null,
        pages: pages ? parseInt(pages) : null,
        language: language || 'fr',
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        categoryId,
        uploadedBy: req.user.id,
        tags: Array.isArray(tags) ? tags : [],
        isPublic: req.user.role === 'ADMIN' ? (isPublic !== false) : false // Non-admin books private by default
      },
      include: {
        category: true,
        uploader: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });


    res.status(201).json({
      success: true,
      data: { book },
      message: 'Livre ajouté avec succès'
    });
  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('isbn')) {
      return res.status(400).json({
        success: false,
        error: 'Un livre avec cet ISBN existe déjà'
      });
    }
    next(error);
  }
};

// Update book
const updateBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const updateData = req.body;

    const book = await prisma.libraryBook.findUnique({
      where: { id: bookId }
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Livre non trouvé'
      });
    }

    // Check permissions
    if (req.user.role !== 'ADMIN' && book.uploadedBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Vous ne pouvez modifier que vos propres livres'
      });
    }

    // Filter allowed fields
    const allowedFields = [
      'title', 'author', 'isbn', 'description', 'coverImage', 'fileUrl',
      'fileType', 'fileSize', 'pages', 'language', 'publishedAt',
      'categoryId', 'tags', 'isPublic', 'isAvailable'
    ];

    const filteredData = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        if (key === 'fileType' && updateData[key]) {
          filteredData[key] = updateData[key].toUpperCase();
        } else if (key === 'publishedAt' && updateData[key]) {
          filteredData[key] = new Date(updateData[key]);
        } else if ((key === 'fileSize' || key === 'pages') && updateData[key]) {
          filteredData[key] = parseInt(updateData[key]);
        } else {
          filteredData[key] = updateData[key];
        }
      }
    });

    // Only admin can make books public
    if ('isPublic' in filteredData && req.user.role !== 'ADMIN') {
      delete filteredData.isPublic;
    }

    const updatedBook = await prisma.libraryBook.update({
      where: { id: bookId },
      data: filteredData,
      include: {
        category: true,
        uploader: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });


    res.status(200).json({
      success: true,
      data: { book: updatedBook },
      message: 'Livre mis à jour avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// Delete book
const deleteBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const book = await prisma.libraryBook.findUnique({
      where: { id: bookId }
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Livre non trouvé'
      });
    }

    // Check permissions
    if (req.user.role !== 'ADMIN' && book.uploadedBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Vous ne pouvez supprimer que vos propres livres'
      });
    }

    // Delete related records and book in transaction
    await prisma.$transaction(async (tx) => {
      await tx.libraryBookmark.deleteMany({ where: { bookId } });
      await tx.libraryReview.deleteMany({ where: { bookId } });
      await tx.libraryDownload.deleteMany({ where: { bookId } });
      await tx.libraryBook.delete({ where: { id: bookId } });
    });


    res.status(200).json({
      success: true,
      message: 'Livre supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// BOOKMARK CONTROLLERS

// Get user bookmarks
const getUserBookmarks = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [bookmarks, totalCount] = await Promise.all([
      prisma.libraryBookmark.findMany({
        where: { userId: req.user.id },
        include: {
          book: {
            include: {
              category: {
                select: { id: true, name: true, color: true }
              },
              _count: {
                select: { reviews: true }
              }
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.libraryBookmark.count({ where: { userId: req.user.id } })
    ]);

    res.status(200).json({
      success: true,
      data: {
        bookmarks,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Toggle bookmark
const toggleBookmark = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    // Check if book exists and is accessible
    const book = await prisma.libraryBook.findUnique({
      where: { id: bookId }
    });

    if (!book || (!book.isPublic && req.user.role !== 'ADMIN' && book.uploadedBy !== req.user.id)) {
      return res.status(404).json({
        success: false,
        error: 'Livre non trouvé ou non accessible'
      });
    }

    // Check if bookmark exists
    const existingBookmark = await prisma.libraryBookmark.findUnique({
      where: { userId_bookId: { userId: req.user.id, bookId } }
    });

    let action;
    if (existingBookmark) {
      // Remove bookmark
      await prisma.libraryBookmark.delete({
        where: { id: existingBookmark.id }
      });
      action = 'removed';
    } else {
      // Add bookmark
      await prisma.libraryBookmark.create({
        data: { userId: req.user.id, bookId }
      });
      action = 'added';
    }


    res.status(200).json({
      success: true,
      data: { isBookmarked: action === 'added' },
      message: `Livre ${action === 'added' ? 'ajouté aux' : 'retiré des'} favoris`
    });
  } catch (error) {
    next(error);
  }
};

// REVIEW CONTROLLERS

// Get book reviews
const getBookReviews = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, totalCount] = await Promise.all([
      prisma.libraryReview.findMany({
        where: { 
          bookId,
          isPublic: true
        },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.libraryReview.count({ 
        where: { bookId, isPublic: true } 
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Add/Update review
const addOrUpdateReview = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { rating, comment, isPublic = true } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'La note doit être entre 1 et 5'
      });
    }

    // Check if book exists and is accessible
    const book = await prisma.libraryBook.findUnique({
      where: { id: bookId }
    });

    if (!book || (!book.isPublic && req.user.role !== 'ADMIN' && book.uploadedBy !== req.user.id)) {
      return res.status(404).json({
        success: false,
        error: 'Livre non trouvé ou non accessible'
      });
    }

    // Upsert review
    const review = await prisma.libraryReview.upsert({
      where: { userId_bookId: { userId: req.user.id, bookId } },
      update: {
        rating: parseInt(rating),
        comment,
        isPublic
      },
      create: {
        userId: req.user.id,
        bookId,
        rating: parseInt(rating),
        comment,
        isPublic
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });

    // Update book average rating
    const avgRating = await prisma.libraryReview.aggregate({
      where: { bookId },
      _avg: { rating: true }
    });

    await prisma.libraryBook.update({
      where: { id: bookId },
      data: { rating: avgRating._avg.rating || 0 }
    });


    res.status(200).json({
      success: true,
      data: { review },
      message: 'Avis ajouté avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// Delete review
const deleteReview = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const review = await prisma.libraryReview.findUnique({
      where: { userId_bookId: { userId: req.user.id, bookId } }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Avis non trouvé'
      });
    }

    await prisma.libraryReview.delete({
      where: { id: review.id }
    });

    // Update book average rating
    const avgRating = await prisma.libraryReview.aggregate({
      where: { bookId },
      _avg: { rating: true }
    });

    await prisma.libraryBook.update({
      where: { id: bookId },
      data: { rating: avgRating._avg.rating || 0 }
    });


    res.status(200).json({
      success: true,
      message: 'Avis supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// DOWNLOAD CONTROLLER

// Download book
const downloadBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const book = await prisma.libraryBook.findUnique({
      where: { id: bookId }
    });

    if (!book || !book.fileUrl) {
      return res.status(404).json({
        success: false,
        error: 'Livre ou fichier non trouvé'
      });
    }

    // Check accessibility
    if (!book.isPublic && req.user?.role !== 'ADMIN' && book.uploadedBy !== req.user?.id) {
      return res.status(403).json({
        success: false,
        error: 'Accès non autorisé à ce livre'
      });
    }

    if (!book.isAvailable) {
      return res.status(403).json({
        success: false,
        error: 'Ce livre n\'est plus disponible au téléchargement'
      });
    }

    // Log download
    await prisma.libraryDownload.create({
      data: {
        userId: req.user?.id || 'anonymous',
        bookId,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    // Increment download count
    await prisma.libraryBook.update({
      where: { id: bookId },
      data: { downloads: { increment: 1 } }
    });


    res.status(200).json({
      success: true,
      data: { 
        downloadUrl: book.fileUrl,
        filename: `${book.title}.${book.fileType.toLowerCase()}`
      },
      message: 'Téléchargement autorisé'
    });
  } catch (error) {
    next(error);
  }
};

// STATISTICS CONTROLLERS

// Get library statistics
const getLibraryStats = async (req, res, next) => {
  try {
    const [
      totalBooks,
      publicBooks,
      totalCategories,
      totalDownloads,
      totalBookmarks,
      totalReviews,
      recentBooks,
      popularBooks,
      booksByCategory
    ] = await Promise.all([
      prisma.libraryBook.count(),
      prisma.libraryBook.count({ where: { isPublic: true, isAvailable: true } }),
      prisma.libraryCategory.count({ where: { isActive: true } }),
      prisma.libraryDownload.count(),
      prisma.libraryBookmark.count(),
      prisma.libraryReview.count(),
      prisma.libraryBook.findMany({
        where: { isPublic: true, isAvailable: true },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { name: true } },
          _count: { select: { downloads_log: true, bookmarks: true } }
        }
      }),
      prisma.libraryBook.findMany({
        where: { isPublic: true, isAvailable: true },
        take: 5,
        orderBy: { downloads: 'desc' },
        include: {
          category: { select: { name: true } },
          _count: { select: { downloads_log: true, bookmarks: true } }
        }
      }),
      prisma.libraryCategory.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: {
              books: { where: { isPublic: true, isAvailable: true } }
            }
          }
        }
      })
    ]);


    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalBooks,
          publicBooks,
          totalCategories,
          totalDownloads,
          totalBookmarks,
          totalReviews
        },
        recentBooks,
        popularBooks,
        booksByCategory
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // Categories
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  
  // Books
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  
  // Bookmarks
  getUserBookmarks,
  toggleBookmark,
  
  // Reviews
  getBookReviews,
  addOrUpdateReview,
  deleteReview,
  
  // Downloads
  downloadBook,
  
  // Statistics
  getLibraryStats
};
*/

// Empty exports for MVP
module.exports = {};