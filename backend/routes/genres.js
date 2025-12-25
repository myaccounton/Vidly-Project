const express = require('express');
const { Genre, validate } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const asyncHandler = require('../middleware/async');
const notFound = require('../middleware/notFound');
const router = express.Router();

// GET all genres
router.get('/', asyncHandler(async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
}));

// GET genre by id
router.get('/:id', validateObjectId, asyncHandler(async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return notFound('Genre')(req, res);
  res.send(genre);
}));

// POST new genre
router.post('/', auth, asyncHandler(async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  res.send(genre);
}));

// PUT update genre
router.put('/:id', [auth, validateObjectId], asyncHandler(async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!genre) return notFound('Genre')(req, res);
  res.send(genre);
}));

// DELETE genre
router.delete('/:id', [auth, admin, validateObjectId], asyncHandler(async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) return notFound('Genre')(req, res);
  res.send(genre);
}));

module.exports = router;
