const express = require('express');
const { registerOrLogin, verifyOtp } = require('../controllers/user');

const router = express.Router();

router.post('/register', registerOrLogin);
router.post('/verify-otp', verifyOtp)

module.exports = router;
