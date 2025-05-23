const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { exportProducts, importProducts } = require('../controllers/csvController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// File Upload Config
const storage = multer.diskStorage({
  destination: './temp/',
  filename: (req, file, cb) => {
    cb(null, `upload-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

router.use(authenticate);
router.use(authorizeRoles('admin', 'manager'));

// Export
router.get('/products/export', exportProducts);

// Import
router.post('/products/import', upload.single('file'), importProducts);

module.exports = router;
