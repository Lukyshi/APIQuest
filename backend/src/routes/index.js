'use strict';
const { Router } = require('express');

const authRoutes        = require('../modules/auth/auth.routes');
const userRoutes        = require('../modules/users/user.routes');
const conceptRoutes     = require('../modules/concepts/concept.routes');
const sandboxRoutes     = require('../modules/sandbox/sandbox.routes');
const challengeRoutes   = require('../modules/challenges/challenge.routes');
const progressRoutes    = require('../modules/progress/progress.routes');
const leaderboardRoutes = require('../modules/leaderboard/leaderboard.routes');

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

router.use('/auth',        authRoutes);
router.use('/users',       userRoutes);
router.use('/concepts',    conceptRoutes);
router.use('/sandbox',     sandboxRoutes);
router.use('/challenges',  challengeRoutes);
router.use('/progress',    progressRoutes);
router.use('/leaderboard', leaderboardRoutes);

module.exports = router;
