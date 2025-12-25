// app.js
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const express = require('express');
const app = express();
const error = require('./middleware/error');

require('./startup/routes')(app);  // 👈 load all routes in one place
app.use(error);

module.exports = app;