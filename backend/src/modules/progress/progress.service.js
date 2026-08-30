'use strict';
const progressModel = require('./progress.model');
const ApiError = require('../../utils/ApiError');

const getMe = async (userId) => {
  const progress = await progressModel.getProgress(userId);
  if (!progress) throw ApiError.notFound('Progress not found');
  const badges = await progressModel.getBadges(userId);
  return { ...progress, badges };
};

module.exports = { getMe };
