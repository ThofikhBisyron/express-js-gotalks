const express = require('express')
const router = express.Router();
const {authenticateToken, requireVerifiedUser} = require("../middlewares/authMiddleware")
const { registerPushToken } = require("../controllers/expoPush")


router.post("/push-token", authenticateToken, requireVerifiedUser, registerPushToken)


module.exports = router