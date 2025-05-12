const express = require('express')
const router = express.Router();
const {authenticateToken, requireVerifiedUser} = require("../middlewares/authMiddleware")
const createUploader = require("../middlewares/upload")
const {addCreateGroup, addMemberGroup, deleteGroup, leaveGroup} = require("../controllers/group")
const uploadGroupImage = createUploader("groups")

router.post("/group", authenticateToken, requireVerifiedUser, uploadGroupImage.single("image"), addCreateGroup)
router.post("/member", authenticateToken, requireVerifiedUser, addMemberGroup)
router.delete("/group/:groupId", authenticateToken, requireVerifiedUser, deleteGroup)
router.delete("/group/:groupId/leave", authenticateToken, requireVerifiedUser, leaveGroup)

module.exports = router