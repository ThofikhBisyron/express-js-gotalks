const express = require('express')
const router = express.Router();
const {authenticateToken, requireVerifiedUser} = require("../middlewares/authMiddleware")
const {createUploader, multerErrorHandler} = require('../middlewares/upload')
const {addCreateGroup, addMemberGroup, deleteGroup, leaveGroup, getGroup, getGroupDetails, editGroup} = require("../controllers/group")
const uploadGroupImage = createUploader("groups")

router.post("/group", authenticateToken, requireVerifiedUser, uploadGroupImage.single("image"), addCreateGroup)
router.post("/member", authenticateToken, requireVerifiedUser, addMemberGroup)
router.delete("/:groupId", authenticateToken, requireVerifiedUser, deleteGroup)
router.delete("/:groupId/leave", authenticateToken, requireVerifiedUser, leaveGroup)
router.get("/list", authenticateToken, requireVerifiedUser, getGroup)
router.get("/:groupId", authenticateToken, requireVerifiedUser, getGroupDetails)
router.patch("/:groupId", authenticateToken, requireVerifiedUser, uploadGroupImage.single("image"), editGroup)

router.use(multerErrorHandler)

module.exports = router