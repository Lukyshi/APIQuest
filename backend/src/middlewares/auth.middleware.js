'use strict';
const jwt = require('jsonwebtoken');
const { JWT_ACCESS_SECRET } = require('../config/env');
const ApiError = require('../utils/ApiError');

/**
 * Verifies the Bearer JWT from the Authorization header.
 * Attaches the decoded payload to req.user.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('No token provided'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    req.user = decoded; // { id, email, username }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Token expired'));
    }
    return next(ApiError.unauthorized('Invalid token'));
  }
};

/**
 * Optional auth — attaches req.user if token present, but does not block if absent.
 */
const optionalAuthenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, JWT_ACCESS_SECRET);
    } catch {
      // ignore — req.user stays undefined
    }
  }
  next();
};

module.exports = { authenticate, optionalAuthenticate };
