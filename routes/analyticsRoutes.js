const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// Import analytics controller methods (only once!)
const {
  getInventorySummary,
  getStockValuation,
  getReorderSuggestions,
  getTopLeastSelling,
  getMonthlySalesVsRestocks,
  getInventoryStats,
  getSalesVsRestocks,
  getTopSellingProducts
} = require('../controllers/analyticsController');

// Auth middlewares
router.use(authenticate);
router.use(authorizeRoles('admin', 'manager'));

// Define routes
router.get('/summary', getInventoryStats); // More general than getInventorySummary
router.get('/valuation', getStockValuation);
router.get('/reorder', getReorderSuggestions);
router.get('/sales', getTopLeastSelling);
router.get('/monthly', getMonthlySalesVsRestocks);
router.get('/sales-vs-restocks', getSalesVsRestocks);
router.get('/top-selling', getTopSellingProducts);

module.exports = router;
