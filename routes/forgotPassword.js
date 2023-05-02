const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/forgotPassword');

router.post('/password/forgotpassword', passwordController.forgotPassword);

module.exports = router;