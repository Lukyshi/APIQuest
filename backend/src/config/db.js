'use strict';
const { PrismaClient } = require('@prisma/client');

/** Shared Prisma client singleton — import this everywhere instead of new PrismaClient() */
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

module.exports = prisma;
