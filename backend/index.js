// index.js
const config = require('config');
const mongoose = require('mongoose');
const logger = require('./startup/logger');

const app = require('./app'); // just the express app
require('./startup/prod')(app);

// Use environment variable first, then config fallback
const db = process.env.MONGODB_URI || config.get('db');

// Connect to MongoDB
mongoose.connect(db)
    .then(() => logger.info(`Connected to ${db}...`))
    .catch(err => {
        logger.error('Could not connect to MongoDB...', err);
        process.exit(1);
    });

// Use Render’s PORT, fallback to 10000 for local dev
const port = process.env.PORT || 10000;

// Bind to 0.0.0.0 (required for Render)
const server = app.listen(port, () => logger.info(`Listening on port ${port}...`));

module.exports = server;
