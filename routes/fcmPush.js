const express = require('express')
const router = express.Router();
const {authenticateToken, requireVerifiedUser} = require("../middlewares/authMiddleware")
const { registerPushTokenFCM } = require("../controllers/fcmPush")


router.post("/push-tokenFCM", authenticateToken, requireVerifiedUser, registerPushTokenFCM)


module.exports = router