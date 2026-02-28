const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const asyncHandler = require('../middleware/async');
const notFound = require('../middleware/notFound');
const upload = require('../middleware/upload');
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

router.post(
  "/",
  [auth, upload.single("poster")],
  asyncHandler(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await getGenreById(req.body.genreId);

    if (!req.file)
      return res.status(400).send("Poster file is required.");

    const movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      posterUrl: req.file.path, 
    });

    await movie.save();
    res.send(movie);
  })
);


router.put(
  "/:id",
  [auth, validateObjectId, upload.single("poster")],
  asyncHandler(async (req, res) => {

   
    if (!req.body) return res.status(400).send("Request body missing");

    const { title, genreId, numberInStock, dailyRentalRate } = req.body;

    if (!genreId) return res.status(400).send("genreId is required");

    const genre = await Genre.findById(genreId);
    if (!genre) return res.status(400).send("Invalid genre.");

    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send("Movie not found.");

    movie.title = title;
    movie.genre = { _id: genre._id, name: genre.name };
    movie.numberInStock = numberInStock;
    movie.dailyRentalRate = dailyRentalRate;

    
    if (req.file) {
      movie.posterUrl = req.file.path;  
    }

    await movie.save();
    res.send(movie);
  })
);

router.delete('/:id', [auth, admin, validateObjectId], asyncHandler(async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return notFound('Movie')(req, res);
  res.send(movie);
}));

module.exports = router;