'use strict';
const prisma = require('../../config/db');

const getOrCreate = (userId) =>
  prisma.userProgress.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

const addXp = async (userId, xp) => {
  const progress = await prisma.userProgress.update({
    where: { userId },
    data: {
      xpTotal: { increment: xp },
      lastActivity: new Date(),
    },
  });
  // Recalculate level: every 100 XP = 1 level (min 1)
  const newLevel = Math.max(1, Math.floor(progress.xpTotal / 100) + 1);
  if (newLevel !== progress.level) {
    await prisma.userProgress.update({ where: { userId }, data: { level: newLevel } });
    progress.level = newLevel;
  }
  return progress;
};

const updateStreak = async (userId) => {
  const progress = await getOrCreate(userId);
  const now = new Date();
  const lastActivity = progress.lastActivity ? new Date(progress.lastActivity) : null;

  let streakCount = progress.streakCount;

  if (lastActivity) {
    const dayDiff = Math.floor((now - lastActivity) / (1000 * 60 * 60 * 24));
    if (dayDiff === 0) {
      // same day — no change
    } else if (dayDiff === 1) {
      // consecutive day
      streakCount += 1;
    } else {
      // streak broken
      streakCount = 1;
    }
  } else {
    streakCount = 1;
  }

  await prisma.userProgress.update({ where: { userId }, data: { streakCount } });
  return streakCount;
};

const awardBadge = async (userId, badgeCode) => {
  try {
    await prisma.userBadge.create({ data: { userId, badgeCode } });
    return true;
  } catch {
    return false; // already has badge (unique constraint)
  }
};

const checkAndAwardBadges = async (userId) => {
  const awarded = [];
  const completed = await prisma.completedChallenge.findMany({
    where: { userId, isCorrect: true },
    include: { challenge: { include: { concept: true } } },
  });

  const byProtocol = {};
  for (const cc of completed) {
    const p = cc.challenge.concept.protocol;
    byProtocol[p] = (byProtocol[p] || 0) + 1;
  }

  // Protocol mastery badges
  const allChallengesByProtocol = await prisma.challenge.groupBy({
    by: ['conceptId'],
    _count: { id: true },
  });

  // Count total per protocol
  const conceptProtocols = await prisma.concept.findMany({ select: { id: true, protocol: true } });
  const totalByProtocol = {};
  for (const { id, protocol } of conceptProtocols) {
    const found = allChallengesByProtocol.find((c) => c.conceptId === id);
    totalByProtocol[protocol] = (totalByProtocol[protocol] || 0) + (found?._count?.id || 0);
  }

  const badges = [
    { code: 'rest_rookie',    protocol: 'REST',    label: 'REST Rookie' },
    { code: 'soap_slinger',   protocol: 'SOAP',    label: 'SOAP Slinger' },
    { code: 'graphql_guru',   protocol: 'GRAPHQL', label: 'GraphQL Guru' },
  ];

  for (const { code, protocol } of badges) {
    if ((byProtocol[protocol] || 0) >= (totalByProtocol[protocol] || 999)) {
      const wasNew = await awardBadge(userId, code);
      if (wasNew) awarded.push(code);
    }
  }

  // First challenge badge
  if (completed.length === 1) {
    const wasNew = await awardBadge(userId, 'first_blood');
    if (wasNew) awarded.push('first_blood');
  }

  // XP milestone badges
  const progress = await prisma.userProgress.findUnique({ where: { userId } });
  if (progress?.xpTotal >= 100) {
    const wasNew = await awardBadge(userId, 'century');
    if (wasNew) awarded.push('century');
  }
  if (progress?.xpTotal >= 500) {
    const wasNew = await awardBadge(userId, 'legend');
    if (wasNew) awarded.push('legend');
  }

  return awarded;
};

const getProgress = (userId) =>
  prisma.userProgress.findUnique({ where: { userId } });

const getBadges = (userId) =>
  prisma.userBadge.findMany({ where: { userId }, orderBy: { earnedAt: 'asc' } });

module.exports = { getOrCreate, addXp, updateStreak, checkAndAwardBadges, getProgress, getBadges };
