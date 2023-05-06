const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/listOfFiles');
const userAuthorization = require('../middlewares/auth');


router.get('/download/ListOfFiles', userAuthorization.authenticate, downloadController.listOfFiles);

module.exports = router;