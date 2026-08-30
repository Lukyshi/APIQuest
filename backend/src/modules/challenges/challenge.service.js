'use strict';
const challengeModel = require('./challenge.model');
const progressModel = require('../progress/progress.model');
const ApiError = require('../../utils/ApiError');

const listByConceptSlug = async (slug) => {
  const challenges = await challengeModel.findByConceptSlug(slug);
  if (!challenges) throw ApiError.notFound(`Concept "${slug}" not found`);
  return challenges;
};

const getById = async (id) => {
  const challenge = await challengeModel.findById(id);
  if (!challenge) throw ApiError.notFound('Challenge not found');
  return challenge;
};

const submit = async (challengeId, selectedOptionId, userId) => {
  const challenge = await challengeModel.findByIdWithAnswers(challengeId);
  if (!challenge) throw ApiError.notFound('Challenge not found');

  const selectedOption = challenge.options.find((o) => o.id === selectedOptionId);
  if (!selectedOption) throw ApiError.badRequest('Invalid option selected');

  const isCorrect = selectedOption.isCorrect;
  const correctOption = challenge.options.find((o) => o.isCorrect);

  // Record completion (upsert — can retake)
  if (userId) {
    await challengeModel.recordCompletion(userId, challengeId, isCorrect);
  }

  let xpAwarded = 0;
  let newBadges = [];
  let updatedProgress = null;

  if (isCorrect && userId) {
    // Check if this was already correctly completed before (no double XP)
    const existing = await challengeModel.findCompleted(userId, challengeId);
    const alreadyCorrect = existing?.isCorrect && existing?.completedAt < new Date();

    if (!alreadyCorrect) {
      updatedProgress = await progressModel.addXp(userId, challenge.xpReward);
      await progressModel.updateStreak(userId);
      newBadges = await progressModel.checkAndAwardBadges(userId);
    }
    xpAwarded = alreadyCorrect ? 0 : challenge.xpReward;
  }

  return {
    isCorrect,
    xpAwarded,
    correctOptionId: correctOption?.id,
    explanation: challenge.explanation,
    newBadges,
    progress: updatedProgress,
  };
};

module.exports = { listByConceptSlug, getById, submit };
