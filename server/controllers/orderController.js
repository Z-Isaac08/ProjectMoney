// ORDER CONTROLLER - COMMENTED OUT FOR MVP (Library Orders)
// TODO: Uncomment when library feature is needed in future release

/*
const prisma = require('../lib/prisma');

// ORDER CONTROLLERS

// Create new order
const createOrder = async (req, res, next) => {
  try {
    const { items, paymentMethod = 'CARD', notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Au moins un article est requis pour créer une commande'
      });
    }

    // Validate books exist and are available
    const bookIds = items.map(item => item.bookId);
    const books = await prisma.libraryBook.findMany({
      where: {
        id: { in: bookIds },
        isAvailable: true,
        isPublic: true
      }
    });

    if (books.length !== items.length) {
      return res.status(400).json({
        success: false,
        error: 'Certains livres ne sont pas disponibles'
      });
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = items.map(item => {
      const book = books.find(b => b.id === item.bookId);
      const unitPrice = book.isFree ? 0 : book.price;
      const quantity = 1; // Digital books always quantity 1
      const totalPrice = unitPrice * quantity;
      
      totalAmount += totalPrice;
      
      return {
        bookId: item.bookId,
        quantity,
        unitPrice,
        totalPrice
      };
    });

    // Create order with items in transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: req.user.id,
          status: 'PENDING',
          totalAmount,
          paymentMethod,
          notes,
          items: {
            create: orderItems
          }
        },
        include: {
          items: {
            include: {
              book: {
                select: {
                  id: true,
                  title: true,
                  author: true,
                  coverImage: true,
                  price: true,
                  isFree: true
                }
              }
            }
          }
        }
      });

      return newOrder;
    });


    res.status(201).json({
      success: true,
      data: { order },
      message: 'Commande créée avec succès'
    });

  } catch (error) {
    next(error);
  }
};

// Get user orders with pagination
const getUserOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { userId: req.user.id };
    if (status) {
      where.status = status.toUpperCase();
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              book: {
                select: {
                  id: true,
                  title: true,
                  author: true,
                  coverImage: true,
                  fileType: true
                }
              }
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount,
          hasNext: skip + orders.length < totalCount,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// Get single order by ID
const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                author: true,
                coverImage: true,
                fileType: true,
                fileUrl: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Commande non trouvée'
      });
    }

    // Check ownership (users can only see their own orders, admins can see all)
    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Accès non autorisé à cette commande'
      });
    }


    res.status(200).json({
      success: true,
      data: { order }
    });

  } catch (error) {
    next(error);
  }
};

// PAYMENT CONTROLLERS

// Process payment (fake payment gateway)
const processPayment = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { cardNumber, expiryMonth, expiryYear, cvv, cardHolder, paymentMethod = 'CARD' } = req.body;

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            book: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Commande non trouvée'
      });
    }

    // Check ownership
    if (order.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Accès non autorisé à cette commande'
      });
    }

    // Check if order is already paid
    if (order.status === 'PAID' || order.status === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        error: 'Cette commande a déjà été payée'
      });
    }

    // Simulate payment processing
    const isSuccessful = await simulatePaymentProcessing(cardNumber, expiryMonth, expiryYear, cvv);
    
    if (!isSuccessful) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'FAILED',
          paymentData: {
            error: 'Payment failed',
            cardLast4: cardNumber?.slice(-4),
            timestamp: new Date().toISOString()
          }
        }
      });

      return res.status(400).json({
        success: false,
        error: 'Le paiement a échoué. Veuillez vérifier vos informations de carte.'
      });
    }

    // Update order status and payment info
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        paymentId: `fake_pay_${Date.now()}`,
        paymentData: {
          cardLast4: cardNumber?.slice(-4),
          cardHolder,
          paymentMethod,
          timestamp: new Date().toISOString(),
          transactionId: `txn_${Date.now()}`
        }
      },
      include: {
        items: {
          include: {
            book: true
          }
        }
      }
    });


    res.status(200).json({
      success: true,
      data: { 
        order: updatedOrder,
        paymentId: updatedOrder.paymentId,
        transactionId: updatedOrder.paymentData.transactionId
      },
      message: 'Paiement effectué avec succès'
    });

  } catch (error) {
    next(error);
  }
};

// Get payment status
const getPaymentStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        paymentId: true,
        paymentData: true,
        paidAt: true,
        userId: true
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Commande non trouvée'
      });
    }

    // Check ownership
    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Accès non autorisé'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        status: order.status,
        totalAmount: order.totalAmount,
        paymentId: order.paymentId,
        paidAt: order.paidAt,
        paymentDetails: order.paymentData
      }
    });

  } catch (error) {
    next(error);
  }
};

// Simulate payment processing (fake payment gateway)
const simulatePaymentProcessing = async (cardNumber, expiryMonth, expiryYear, cvv) => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Fake validation rules
  if (!cardNumber || cardNumber.length < 13) return false;
  if (!expiryMonth || !expiryYear || !cvv) return false;
  
  // Simulate some cards failing (for testing)
  const failingCards = ['4000000000000002', '4000000000000010'];
  if (failingCards.includes(cardNumber)) return false;

  // 95% success rate for other cards
  return Math.random() > 0.05;
};

// ADMIN CONTROLLERS

// Get all orders (admin only)
const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, userId, startDate, endDate } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status.toUpperCase();
    if (userId) where.userId = userId;
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          items: {
            include: {
              book: {
                select: {
                  id: true,
                  title: true,
                  author: true
                }
              }
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: {
        orders,
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

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  processPayment,
  getPaymentStatus,
  getAllOrders
};
*/

// Empty exports for MVP
module.exports = {};