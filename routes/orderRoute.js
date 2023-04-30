const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');
const userAuthorization = require('../middlewares/auth');

router.get('/purchase/premiumMembership', userAuthorization.authenticate, orderController.purchasePremium);
router.post('/purchase/updateTranscationStatus', userAuthorization.authenticate, orderController.updateTranscation);
router.post('/purchase/failedTransaction', userAuthorization.authenticate, orderController.failedTranscation);

module.exports = router;