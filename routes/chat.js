const express = require("express")
const {authenticateToken, requireVerifiedUser} = require("../middlewares/authMiddleware")
const {sendMessage, markAsRead, getMessages, getReadStatus, getChatListbyId } = require("../controllers/chat")
const router = express.Router()

router.post("/send", authenticateToken, requireVerifiedUser, sendMessage)
router.post("/read/:messageId", authenticateToken, requireVerifiedUser, markAsRead)
router.get("/messages", authenticateToken, requireVerifiedUser, getMessages)
router.get("/status/:messageId", authenticateToken, requireVerifiedUser, getReadStatus)
router.get("/chatlist", authenticateToken, requireVerifiedUser, getChatListbyId)

module.exports = router


    