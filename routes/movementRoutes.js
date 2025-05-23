const express = require('express');
const router = express.Router();
const { logMovement, getMovements } = require('../controllers/movementController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticate);

// POST /api/movements → Log movement
router.post('/', authorizeRoles('admin', 'manager'), logMovement);

// GET /api/movements → View movement logs
router.get('/', getMovements);

module.exports = router;
