'use strict';
require('dotenv').config();

/**
 * Central config module — import from here instead of process.env directly.
 * Fails fast at startup if required variables are missing.
 */

const required = (key) => {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
};

const optional = (key, fallback) => process.env[key] || fallback;

module.exports = {
  // Server
  PORT: optional('PORT', '5000'),
  NODE_ENV: optional('NODE_ENV', 'development'),

  // Database
  DATABASE_URL: required('DATABASE_URL'),

  // Auth
  JWT_ACCESS_SECRET: required('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: required('JWT_REFRESH_SECRET'),
  JWT_ACCESS_EXPIRES_IN: optional('JWT_ACCESS_EXPIRES_IN', '15m'),
  JWT_REFRESH_EXPIRES_IN: optional('JWT_REFRESH_EXPIRES_IN', '7d'),

  // Sandbox endpoints
  SANDBOX_REST_BASE_URL: optional('SANDBOX_REST_BASE_URL', 'https://jsonplaceholder.typicode.com'),
  SANDBOX_GRAPHQL_BASE_URL: optional('SANDBOX_GRAPHQL_BASE_URL', 'https://countries.trevorblades.com/graphql'),
  SANDBOX_SOAP_BASE_URL: optional('SANDBOX_SOAP_BASE_URL', 'http://www.dneonline.com/calculator.asmx'),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: parseInt(optional('RATE_LIMIT_WINDOW_MS', '60000'), 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(optional('RATE_LIMIT_MAX_REQUESTS', '30'), 10),
};
