'use strict';
const leaderboardService = require('./leaderboard.service');
const asyncHandler = require('../../utils/asyncHandler');

const getLeaderboard = asyncHandler(async (req, res) => {
  const raw = await leaderboardService.getLeaderboard(50);
  const data = raw.map((entry, idx) => ({
    rank: idx + 1,
    userId: entry.user.id,
    username: entry.user.username,
    xpTotal: entry.xpTotal,
    level: entry.level,
    streakCount: entry.streakCount,
  }));
  res.json({ success: true, data });
});

module.exports = { getLeaderboard };
