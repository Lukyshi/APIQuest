'use strict';
const { NODE_ENV } = require('../config/env');

const levels = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = NODE_ENV === 'production' ? 1 : 3;

const formatMsg = (level, message, meta) => {
  const ts = new Date().toISOString();
  const base = `[${ts}] [${level.toUpperCase()}] ${message}`;
  return meta ? `${base} ${JSON.stringify(meta)}` : base;
};

const logger = {
  error: (msg, meta) => { if (levels.error <= currentLevel) console.error(formatMsg('error', msg, meta)); },
  warn:  (msg, meta) => { if (levels.warn  <= currentLevel) console.warn(formatMsg('warn',  msg, meta)); },
  info:  (msg, meta) => { if (levels.info  <= currentLevel) console.log(formatMsg('info',  msg, meta)); },
  debug: (msg, meta) => { if (levels.debug <= currentLevel) console.log(formatMsg('debug', msg, meta)); },
};

module.exports = logger;
