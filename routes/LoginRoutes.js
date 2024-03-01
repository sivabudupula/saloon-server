const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/LoginController');

// Define routes for appointments
router.post('/login', LoginController.CreateLogin);

module.exports = router;
