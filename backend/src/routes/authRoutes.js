const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, sendOtp, verifyOtp, registerWithOtp } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register-otp', registerWithOtp);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);

module.exports = router;
