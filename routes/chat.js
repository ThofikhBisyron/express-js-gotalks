const express = require("express")
const {authenticateToken, requireVerifiedUser} = require("../middlewares/authMiddleware")
const {sendMessage, markAsRead} = require("../controllers/chat")
const router = express.Router()

router.post("/send", authenticateToken, requireVerifiedUser, sendMessage)
router.post("/read/:messageId", authenticateToken, requireVerifiedUser, markAsRead)


module.exports = router


