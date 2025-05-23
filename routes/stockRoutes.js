// routes/stockRoutes.js

const express = require('express');
const router = express.Router();

const {
  addStock,
  removeStock,
  getStockByProduct,
  transferStock
} = require('../controllers/stockController');

const {
  authenticate,
  authorizeRoles,
  protect
} = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticate);

// Add stock
router.post('/add', authorizeRoles('admin', 'manager'), addStock);

// Remove stock
router.post('/remove', authorizeRoles('admin', 'manager'), removeStock);

// Transfer stock
router.post('/transfer', authorizeRoles('admin', 'manager'), transferStock);

// Get stock by product
router.get('/:productId', getStockByProduct);

module.exports = router;
    