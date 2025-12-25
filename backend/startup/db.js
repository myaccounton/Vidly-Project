const logger = require('./logger');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
  // Check for MONGODB_URI first (standard), then DB, then config fallback
  const db = process.env.MONGODB_URI || process.env.DB || config.get('db');

  // Skip DB connection during tests
  if (process.env.NODE_ENV === 'test') return;

  mongoose.connect(db)
    .then(() => logger.info(`Connected to ${db}...`))
    .catch(err => {
      logger.error('Could not connect to MongoDB...', err);
      process.exit(1); // crash gracefully
    });
};