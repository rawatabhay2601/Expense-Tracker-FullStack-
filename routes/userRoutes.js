const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');

// In Sign-up page if we add the use this is the route that executes that function
router.post('/user/postUser', userController.addUser);
router.post('/user/loginUser', userController.LogInUser);
router.get('/user/getUser', userController.addUser);

module.exports = router;