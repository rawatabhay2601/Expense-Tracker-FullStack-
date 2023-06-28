const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/forgotPassword');

router.post('/password/forgotpassword' ,passwordController.forgotPassword);
router.get('/password/resetpassword/:id/:userId' ,passwordController.resetPassword);
router.get('/password/updatePassword/:userId' ,passwordController.updatePassword);

module.exports = router;