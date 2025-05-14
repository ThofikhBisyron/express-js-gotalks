const express = require("express")
const {authenticateToken, requireVerifiedUser} = require("../middlewares/authMiddleware")
const {sendMessage} = require("../controllers/chat")
const router = express.Router()

router.post("/send", authenticateToken, requireVerifiedUser, sendMessage)


module.exports = router


