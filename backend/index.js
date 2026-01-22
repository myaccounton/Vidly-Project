
const mongoose = require("mongoose");
const logger = require("./startup/logger");

const app = require("./app");
require("./startup/prod")(app);

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => logger.info("Connected to MongoDB..."))
  .catch(err => {
    logger.error("Could not connect to MongoDB...", err);
    process.exit(1);
  });

const port = 10000;

const server = app.listen(port, () =>
  logger.info(`Listening on port ${port}...`)
);

module.exports = server;
