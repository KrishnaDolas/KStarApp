// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

// Existing routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/registerAdmin', userController.registerAdmin);

// New route for employee login
router.post('/employeeLogin', userController.employeeLogin);

module.exports = router;