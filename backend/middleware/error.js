const logger = require('../startup/logger');

module.exports = function (err, req, res, next) {
  // Log the error
  logger.error(err.message, err);

  // Send response
  res.status(500).send('Something failed.');
};
