'use strict';
const challengeModel = require('./challenge.model');
const progressModel = require('../progress/progress.model');
const ApiError = require('../../utils/ApiError');

const listByConceptSlug = async (slug, userId) => {
  const challenges = await challengeModel.findByConceptSlug(slug);
  if (!challenges) throw ApiError.notFound(`Concept "${slug}" not found`);

  let userXp = 0;
  let completedMap = {};

  if (userId) {
    const progress = await progressModel.getByUserId(userId);
    userXp = progress?.xpTotal || 0;
    const completedList = await progressModel.getCompletedChallenges(userId);
    completedList.forEach((c) => {
      if (c.isCorrect) completedMap[c.challengeId] = true;
    });
  }

  return challenges.map((ch) => ({
    ...ch,
    isCompleted: !!completedMap[ch.id],
    isUnlocked: userXp >= ch.requiredXp,
  }));
};

const getById = async (id, userId) => {
  const challenge = await challengeModel.findById(id);
  if (!challenge) throw ApiError.notFound('Challenge not found');

  // Attach completion status so the frontend can lock the UI
  let isCompleted = false;
  let isCorrect = false;
  if (userId) {
    const done = await challengeModel.findCompleted(userId, id);
    isCompleted = !!done;
    isCorrect   = !!done?.isCorrect;
  }

  return { ...challenge, isCompleted, isCorrect };
};

const submit = async (challengeId, selectedOptionId, userId) => {
  const challenge = await challengeModel.findByIdWithAnswers(challengeId);
  if (!challenge) throw ApiError.notFound('Challenge not found');

  const selectedOption = challenge.options.find((o) => o.id === selectedOptionId);
  if (!selectedOption) throw ApiError.badRequest('Invalid option selected');

  const isCorrect = selectedOption.isCorrect;
  const correctOption = challenge.options.find((o) => o.isCorrect);

  // ── Snapshot BEFORE upsert so we know the pre-submission state ──────────
  let alreadyCorrect = false;
  if (userId) {
    const existing = await challengeModel.findCompleted(userId, challengeId);
    alreadyCorrect = !!(existing?.isCorrect); // was it correctly answered before?
  }

  // Record / update completion
  if (userId) {
    await challengeModel.recordCompletion(userId, challengeId, isCorrect);
  }

  let xpAwarded = 0;
  let newBadges = [];
  let updatedProgress = null;

  if (isCorrect && userId && !alreadyCorrect) {
    // First-time correct answer — award XP, update streak, check badges
    updatedProgress = await progressModel.addXp(userId, challenge.xpReward);
    await progressModel.updateStreak(userId);
    newBadges = await progressModel.checkAndAwardBadges(userId);
    xpAwarded = challenge.xpReward;
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
