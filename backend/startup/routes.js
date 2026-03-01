const express = require('express');
const cors = require('cors');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const returns = require('../routes/returns');
const watchlists = require('../routes/watchlists');
const error = require('../middleware/error');

module.exports = function(app) {

  const corsOptions = {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'X-Requested-With'],
    exposedHeaders: ['x-auth-token']
  };

  app.use(cors(corsOptions));   // FIRST
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send({ message: 'Welcome to Vidly API! 🎬' });
  });

  app.use('/api/genres', genres);
  app.use('/api/customers', customers);
  app.use('/api/movies', movies);
  app.use('/api/rentals', rentals);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/api/returns', returns);
  app.use('/api/watchlists', watchlists);

  app.use(error);
};
