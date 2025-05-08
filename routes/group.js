const express = require('express')
const router = express.Router();
const {authenticateToken, requireVerifiedUser} = require("../middlewares/authMiddleware")
const createUploader = require("../middlewares/upload")
const {addCreateGroup} = require("../controllers/group")
const uploadGroupImage = createUploader("groups")

router.post("/group", authenticateToken, requireVerifiedUser, uploadGroupImage.single("image"), addCreateGroup)

module.exports = router