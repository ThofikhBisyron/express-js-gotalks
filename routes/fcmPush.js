<<<<<<< HEAD
const express = require('express')
const router = express.Router();
const {authenticateToken, requireVerifiedUser} = require("../middlewares/authMiddleware")
const { registerPushTokenFCM } = require("../controllers/fcmPush")


router.post("/push-tokenFCM", authenticateToken, requireVerifiedUser, registerPushTokenFCM)


=======
const express = require('express')
const router = express.Router();
const {authenticateToken, requireVerifiedUser} = require("../middlewares/authMiddleware")
const { registerPushTokenFCM } = require("../controllers/fcmPush")


router.post("/push-tokenFCM", authenticateToken, requireVerifiedUser, registerPushTokenFCM)


>>>>>>> 730e1481799a6bbeeaeb0fc7484ee05bdc00e61d
module.exports = router