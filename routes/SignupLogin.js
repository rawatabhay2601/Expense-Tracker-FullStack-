const express = require('express');
const router = express.Router();
const userSignupLoginController = require('../controllers/signUpLogin');

// In Sign-up page if we add the use this is the route that executes that function
router.post('/addUserSignup', userSignupLoginController.addUser);
router.post('/LogInUser', userSignupLoginController.LogInUser);
router.get('/addUserSignup', userSignupLoginController.addUser);

module.exports = router;