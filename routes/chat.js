const express = require("express")
const {authenticateToken, requireVerifiedUser} = require("../middlewares/authMiddleware")
const {sendMessage, markAsRead, getMessages, getReadStatus, } = require("../controllers/chat")
const router = express.Router()

router.post("/send", authenticateToken, requireVerifiedUser, sendMessage)
router.post("/read/:messageId", authenticateToken, requireVerifiedUser, markAsRead)
router.get("/messages", authenticateToken, requireVerifiedUser, getMessages)
router.get("/status/:messageId", authenticateToken, requireVerifiedUser, getReadStatus)

module.exports = router


