'use strict';
const prisma = require('../../config/db');

const findById = (id) =>
  prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, username: true, createdAt: true },
  });

module.exports = { findById };
