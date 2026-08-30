'use strict';
const prisma = require('../../config/db');

const getLeaderboard = async (limit = 50) =>
  prisma.userProgress.findMany({
    take: limit,
    orderBy: { xpTotal: 'desc' },
    include: {
      user: { select: { id: true, username: true, createdAt: true } },
    },
  });

module.exports = { getLeaderboard };
