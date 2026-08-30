'use strict';
const app = require('./app');
const { PORT } = require('./config/env');
const prisma = require('./config/db');
const logger = require('./utils/logger');

const start = async () => {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected');

    app.listen(PORT, () => {
      logger.info(`🚀 API Quest backend running on http://localhost:${PORT}`);
      logger.info(`   Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    logger.error('Failed to start server', { error: err.message });
    process.exit(1);
  }
};

start();
