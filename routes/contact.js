const express = require('express')
const router = express.Router();
const {authenticateToken, requireVerifiedUser} = require("../middlewares/authMiddleware")
const { createContact, getContact } = require("../controllers/contact")


router.post("/create", authenticateToken, requireVerifiedUser, createContact)
router.get("/list-contact", authenticateToken, requireVerifiedUser, getContact)

module.exports = router