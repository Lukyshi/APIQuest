'use strict';
const prisma = require('../../config/db');

const findAll = () =>
  prisma.concept.findMany({
    include: { comparisonPoints: true, _count: { select: { challenges: true } } },
    orderBy: { protocol: 'asc' },
  });

const findBySlug = (slug) =>
  prisma.concept.findUnique({
    where: { slug },
    include: { comparisonPoints: true, challenges: { include: { options: true } } },
  });

const findById = (id) =>
  prisma.concept.findUnique({
    where: { id },
    include: { comparisonPoints: true },
  });

module.exports = { findAll, findBySlug, findById };
