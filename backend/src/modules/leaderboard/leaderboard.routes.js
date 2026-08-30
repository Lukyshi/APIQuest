'use strict';
const { Router } = require('express');
const controller = require('./leaderboard.controller');

const router = Router();
router.get('/', controller.getLeaderboard);

module.exports = router;
