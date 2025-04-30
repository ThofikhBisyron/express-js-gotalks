const express = require('express');
const { registerOrLogin } = require('../controllers/user');

const router = express.Router();

router.post('/register', registerOrLogin);

module.exports = router;
