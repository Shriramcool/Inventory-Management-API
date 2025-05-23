const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginLimiter, loginUser);

module.exports = router;
