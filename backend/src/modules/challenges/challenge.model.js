'use strict';
const prisma = require('../../config/db');

const findByConceptSlug = async (slug) => {
  const concept = await prisma.concept.findUnique({ where: { slug } });
  if (!concept) return null;
  return prisma.challenge.findMany({
    where: { conceptId: concept.id },
    include: { options: { select: { id: true, optionText: true, isCorrect: false } } },
    orderBy: [{ difficulty: 'asc' }, { createdAt: 'asc' }],
  });
};

const findById = (id) =>
  prisma.challenge.findUnique({
    where: { id },
    include: { options: { select: { id: true, optionText: true } }, concept: true },
  });

const findByIdWithAnswers = (id) =>
  prisma.challenge.findUnique({
    where: { id },
    include: { options: true, concept: { select: { protocol: true, slug: true } } },
  });

const findCompleted = (userId, challengeId) =>
  prisma.completedChallenge.findUnique({ where: { userId_challengeId: { userId, challengeId } } });

const recordCompletion = (userId, challengeId, isCorrect) =>
  prisma.completedChallenge.upsert({
    where: { userId_challengeId: { userId, challengeId } },
    update: { isCorrect, completedAt: new Date() },
    create: { userId, challengeId, isCorrect },
  });

module.exports = { findByConceptSlug, findById, findByIdWithAnswers, findCompleted, recordCompletion };
