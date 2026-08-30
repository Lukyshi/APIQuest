'use strict';

/**
 * Wraps async route handlers so you don't need try/catch in every controller.
 * Caught errors are forwarded to Express's error middleware via next().
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
