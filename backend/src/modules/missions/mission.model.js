'use strict';
const prisma = require('../../config/db');

const findAll = () =>
  prisma.mission.findMany({ orderBy: [{ order: 'asc' }, { difficulty: 'asc' }] });

const findById = (id) =>
  prisma.mission.findUnique({ where: { id } });

const findAttempt = (userId, missionId) =>
  prisma.missionAttempt.findUnique({ where: { userId_missionId: { userId, missionId } } });

const recordAttempt = (userId, missionId, isCorrect, hintsUsed, xpAwarded) =>
  prisma.missionAttempt.upsert({
    where: { userId_missionId: { userId, missionId } },
    update: { isCorrect, hintsUsed, xpAwarded, completedAt: new Date() },
    create: { userId, missionId, isCorrect, hintsUsed, xpAwarded },
  });

const incrementMissionsCompleted = (userId) =>
  prisma.userProgress.update({
    where: { userId },
    data: { missionsCompleted: { increment: 1 } },
  });

const incrementBugsFixed = (userId) =>
  prisma.userProgress.update({
    where: { userId },
    data: { bugsFixed: { increment: 1 } },
  });

const listAttemptsForUser = (userId) =>
  prisma.missionAttempt.findMany({
    where: { userId },
    select: { missionId: true, isCorrect: true, hintsUsed: true, xpAwarded: true },
  });

module.exports = {
  findAll,
  findById,
  findAttempt,
  recordAttempt,
  incrementMissionsCompleted,
  incrementBugsFixed,
  listAttemptsForUser,
};
