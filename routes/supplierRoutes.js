const express = require('express');
const router = express.Router();
const {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticate);

// CRUD
router.post('/', authorizeRoles('admin', 'manager'), createSupplier);
router.get('/', getAllSuppliers);
router.get('/:id', getSupplierById);
router.put('/:id', authorizeRoles('admin', 'manager'), updateSupplier);
router.delete('/:id', authorizeRoles('admin'), deleteSupplier);

module.exports = router;
    