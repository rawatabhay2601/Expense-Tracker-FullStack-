const express = require('express');
const router = express.Router();
const leaderController = require('../controllers/leadersboard');

router.get('/leaderboard/getLeaders', leaderController.getLeaders);

module.exports = router;