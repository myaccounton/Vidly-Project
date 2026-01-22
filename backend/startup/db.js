const logger = require('./logger');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
  const db = config.get('db');

  mongoose.connect(db)
    .then(() => logger.info(`Connected to ${db}...`))
    .catch(err => {
      logger.error('Could not connect to MongoDB...', err);
      process.exit(1);
    });
};