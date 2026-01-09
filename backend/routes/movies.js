const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const asyncHandler = require('../middleware/async');
const notFound = require('../middleware/notFound');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


async function getGenreById(genreId) {
  const genre = await Genre.findById(genreId);
  if (!genre) {
    const error = new Error('Invalid genre.');
    error.status = 400;
    throw error;
  }
  return genre;
}

router.get('/', asyncHandler(async (req, res) => {
  const movies = await Movie.find().sort('title');
  res.send(movies);
}));

router.get('/:id', validateObjectId, asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return notFound('Movie')(req, res);
  res.send(movie);
}));

router.get("/recommendations/:id", asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return notFound('Movie')(req, res);

  const recommendations = await Movie.find({
    genre: movie.genre,
    _id: { $ne: movie._id }
  })
    .sort({ dailyRentalRate: -1 })
    .limit(5);

  res.send(recommendations);
}));

router.post('/', auth, asyncHandler(async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await getGenreById(req.body.genreId);

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });

  await movie.save();
  res.send(movie);
}));

router.put('/:id', [auth, validateObjectId], asyncHandler(async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await getGenreById(req.body.genreId);

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    },
    { new: true }
  );

  if (!movie) return notFound('Movie')(req, res);
  res.send(movie);
}));

router.delete('/:id', [auth, admin, validateObjectId], asyncHandler(async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return notFound('Movie')(req, res);
  res.send(movie);
}));

module.exports = router;