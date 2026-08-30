'use strict';
const userModel = require('./user.model');
const prisma = require('../../config/db');
const ApiError = require('../../utils/ApiError');

const getMe = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) throw ApiError.notFound('User not found');

  const progress = await prisma.userProgress.findUnique({ where: { userId } });
  const badges = await prisma.userBadge.findMany({ where: { userId }, orderBy: { earnedAt: 'asc' } });
  const completedCount = await prisma.completedChallenge.count({ where: { userId, isCorrect: true } });

  return { ...user, progress, badges, completedChallenges: completedCount };
};

module.exports = { getMe };
