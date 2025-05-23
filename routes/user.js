const express = require('express');
const { registerOrLogin, verifyOtp, updateUsername } = require('../controllers/user');
const { authenticateToken, requireVerifiedUser } = require('../middlewares/authMiddleware')

const router = express.Router();

router.post('/register', registerOrLogin);
router.post('/verify-otp', verifyOtp)
router.post('/update-username', authenticateToken, requireVerifiedUser, updateUsername)

module.exports = router;
