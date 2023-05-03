const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/forgotPassword');
const userAuthorization = require('../middlewares/auth');

router.post('/password/forgotpassword' ,passwordController.forgotPassword);
router.get('/password/resetpassword/:id' ,passwordController.resetPassword);
router.get('/password/updatePassword/:resetpasswordid' ,passwordController.updatePassword);

module.exports = router;