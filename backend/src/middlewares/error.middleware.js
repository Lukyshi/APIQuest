'use strict';
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Central error handler. Maps known errors to structured JSON responses.
 * Unknown errors are treated as 500 Internal Server Error.
 */
// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  // Prisma known errors
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists`,
      errors: [],
    });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Record not found', errors: [] });
  }

  // Zod validation errors (forwarded from validate middleware)
  if (err.name === 'ZodError') {
    const errors = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  // Our structured ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Unexpected errors
  logger.error('Unhandled error', { message: err.message, stack: err.stack, url: req.url });
  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    errors: [],
  });
};

module.exports = errorMiddleware;
