// LIBRARY ROUTES - COMMENTED OUT FOR MVP
// TODO: Uncomment when library feature is needed in future release

/*
import express from 'express';
import { Request, Response } from 'express';
const {
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
} = require('../controllers/libraryController');

const {
  // Orders
  createOrder,
  getUserOrders,
  getOrderById,
  
  // Payments
  processPayment,
  getPaymentStatus,
  
  // Admin
  getAllOrders
} = require('../controllers/orderController');

const { protect, requireVerified, requireAdmin } = require('../middleware/auth');
const { globalLimiter, authLimiter } = require('../middleware/security');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Apply rate limiting to all library routes
router.use(globalLimiter);

// PUBLIC ROUTES (no authentication required)

// Get all categories
router.get('/categories', getCategories);

// Get all books (public only)
router.get('/books', getBooks);

// Get single book details
router.get('/books/:bookId', getBookById);

// Get book reviews
router.get('/books/:bookId/reviews', getBookReviews);

// Get library statistics
router.get('/stats', getLibraryStats);

// AUTHENTICATED ROUTES (require login)

// User bookmark management
router.get('/bookmarks', protect, requireVerified, getUserBookmarks);
router.post('/books/:bookId/bookmark', protect, requireVerified, authLimiter, toggleBookmark);

// Book reviews
router.post('/books/:bookId/reviews', protect, requireVerified, authLimiter, addOrUpdateReview);
router.delete('/books/:bookId/reviews', protect, requireVerified, deleteReview);

// Book downloads
router.get('/books/:bookId/download', protect, requireVerified, downloadBook);

// Book management (create/update/delete own books)
router.post('/books', protect, requireVerified, authLimiter, createBook);
router.put('/books/:bookId', protect, requireVerified, updateBook);
router.delete('/books/:bookId', protect, requireVerified, deleteBook);

// Order management
router.post('/orders', protect, requireVerified, authLimiter, createOrder);
router.get('/orders', protect, requireVerified, getUserOrders);
router.get('/orders/:orderId', protect, requireVerified, getOrderById);

// Payment processing
router.post('/orders/:orderId/payment', protect, requireVerified, authLimiter, processPayment);
router.get('/orders/:orderId/payment/status', protect, requireVerified, getPaymentStatus);

// ADMIN ROUTES (require admin privileges)

// Category management (admin only)
router.post('/categories', protect, requireAdmin, authLimiter, createCategory);
router.put('/categories/:categoryId', protect, requireAdmin, updateCategory);
router.delete('/categories/:categoryId', protect, requireAdmin, deleteCategory);

// Get all books including private ones (admin only)
router.get('/admin/books', protect, requireAdmin, (req, res, next) => {
  req.query.showAll = 'true';
  getBooks(req, res, next);
});

// Get all orders (admin only)
router.get('/admin/orders', protect, requireAdmin, getAllOrders);

// Validation schemas for common operations
const bookValidationRules = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 200
  },
  author: {
    required: true,
    minLength: 1,
    maxLength: 100
  },
  description: {
    maxLength: 2000
  },
  isbn: {
    pattern: /^(?:ISBN(?:-13)?:?\s*)?(?:97[89]\s*(?:\d\s*){9}\d|(?:\d\s*){9}[\dX])$/i
  },
  language: {
    pattern: /^[a-z]{2}$/i
  },
  fileType: {
    enum: ['PDF', 'EPUB', 'MOBI', 'DOC', 'DOCX', 'TXT', 'MP3', 'MP4', 'VIDEO', 'IMAGE']
  },
  tags: {
    type: 'array',
    maxItems: 10
  }
};

const categoryValidationRules = {
  name: {
    required: true,
    minLength: 1,
    maxLength: 50
  },
  description: {
    maxLength: 200
  },
  color: {
    pattern: /^#[0-9A-F]{6}$/i
  }
};

const reviewValidationRules = {
  rating: {
    required: true,
    type: 'number',
    minimum: 1,
    maximum: 5
  },
  comment: {
    maxLength: 1000
  }
};

const orderValidationRules = {
  items: {
    required: true,
    type: 'array',
    minItems: 1,
    maxItems: 50
  },
  paymentMethod: {
    enum: ['CARD', 'MOBILE_MONEY', 'BANK_TRANSFER']
  }
};

const paymentValidationRules = {
  cardNumber: {
    required: true,
    pattern: /^[0-9]{13,19}$/
  },
  expiryMonth: {
    required: true,
    pattern: /^(0[1-9]|1[0-2])$/
  },
  expiryYear: {
    required: true,
    pattern: /^20[2-9][0-9]$/
  },
  cvv: {
    required: true,
    pattern: /^[0-9]{3,4}$/
  },
  cardHolder: {
    required: true,
    minLength: 2,
    maxLength: 100
  }
};

// Apply validation to routes that need it
router.post('/books', validate(bookValidationRules));
router.put('/books/:bookId', validate(bookValidationRules));
router.post('/categories', validate(categoryValidationRules));
router.put('/categories/:categoryId', validate(categoryValidationRules));
router.post('/books/:bookId/reviews', validate(reviewValidationRules));
router.post('/orders', validate(orderValidationRules));
router.post('/orders/:orderId/payment', validate(paymentValidationRules));

// Parameter validation middleware
router.param('bookId', (req, res, next, id) => {
  if (!id || typeof id !== 'string' || id.length < 10) {
    return res.status(400).json({
      success: false,
      error: 'ID de livre invalide'
    });
  }
  next();
});

router.param('categoryId', (req, res, next, id) => {
  if (!id || typeof id !== 'string' || id.length < 10) {
    return res.status(400).json({
      success: false,
      error: 'ID de catégorie invalide'
    });
  }
  next();
});

router.param('orderId', (req, res, next, id) => {
  if (!id || typeof id !== 'string' || id.length < 10) {
    return res.status(400).json({
      success: false,
      error: 'ID de commande invalide'
    });
  }
  next();
});

// Error handling for library-specific errors
router.use((error, req, res, next) => {
  // Handle Prisma errors
  if (error.code) {
    switch (error.code) {
      case 'P2002':
        return res.status(400).json({
          success: false,
          error: 'Cette ressource existe déjà'
        });
      case 'P2025':
        return res.status(404).json({
          success: false,
          error: 'Ressource non trouvée'
        });
      case 'P2003':
        return res.status(400).json({
          success: false,
          error: 'Référence invalide'
        });
      default:
        break;
    }
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Données invalides',
      details: error.details
    });
  }

  // Handle file upload errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'Fichier trop volumineux'
    });
  }

  // Handle file type errors
  if (error.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({
      success: false,
      error: 'Type de fichier non supporté'
    });
  }

  next(error);
});

module.exports = router;
*/

// Empty router for MVP
import express from 'express';
const router = express.Router();
export default router;