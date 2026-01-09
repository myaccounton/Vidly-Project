const config = require('config');
const mongoose = require('mongoose');
const logger = require('./startup/logger');

const app = require('./app');
require('./startup/prod')(app);

const db = process.env.MONGODB_URI || config.get('db');

mongoose.connect(db)
    .then(() => logger.info(`Connected to ${db}...`))
    .catch(err => {
        logger.error('Could not connect to MongoDB...', err);
        process.exit(1);
    });

const port = process.env.PORT || 10000;

const server = app.listen(port, () => logger.info(`Listening on port ${port}...`));

module.exports = server;
