const express = require('express');
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  softDeleteProduct
} = require('../controllers/productController');

const {
  importProducts,
  exportProducts
} = require('../controllers/csvController');

const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

//  Protect all routes
router.use(authenticate);

//  CRUD operations
router.post(
  '/',
  authorizeRoles('admin', 'manager'),
  upload.single('image'),
  createProduct
);

router.get('/', getProducts);
router.get('/:id', getProductById);

router.put(
  '/:id',
  authorizeRoles('admin', 'manager'),
  upload.single('image'),
  updateProduct
);

router.delete('/:id', authorizeRoles('admin'), softDeleteProduct);

//  CSV import/export
router.post(
  '/import',
  authorizeRoles('admin', 'manager'),
  upload.single('file'),
  importProducts
);

router.get(
  '/export',
  authorizeRoles('admin', 'manager'),
  exportProducts
);

module.exports = router;
