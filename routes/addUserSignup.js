const express = require('express');
const router = express.Router();
const addUserController = require('../controllers/addUserSignup');

// In Sign-up page if we add the use this is the route that executes that function
router.post('/addUserSignup', addUserController.addUser);

module.exports = router;