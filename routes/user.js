const express = require('express');
const { registerOrLogin, verifyOtp, updateUsername, getUser, updatedImageUser, updatedImgBgUser, updatedDescription, loginWithGoogle} = require('../controllers/user');
const { authenticateToken, requireVerifiedUser } = require('../middlewares/authMiddleware')
const {createUploader, multerErrorHandler} = require('../middlewares/upload')
const updatedProfileImage = createUploader("profile")
const updatedBgProfile = createUploader("profile_background")
const router = express.Router()

router.post('/register', registerOrLogin);
router.post('/verify-otp', verifyOtp)
router.patch('/update-username', authenticateToken, requireVerifiedUser, updateUsername)
router.get('/profile', authenticateToken, requireVerifiedUser, getUser)
router.patch('/profileimage', authenticateToken, requireVerifiedUser, updatedProfileImage.single("image"), updatedImageUser)
router.patch('/bgprofile', authenticateToken, requireVerifiedUser, updatedBgProfile.single("imgBg"), updatedImgBgUser)
router.patch(`/desc`, authenticateToken, requireVerifiedUser, updatedDescription)
router.post('/google', loginWithGoogle)

router.use(multerErrorHandler)

module.exports = router;
