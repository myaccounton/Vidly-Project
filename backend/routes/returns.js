const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const auth = require('../middleware/auth');
const express = require('express');
const asyncHandler = require('../middleware/async');
const constants = require('../utils/constants');
const router = express.Router();
const Joi = require('joi');

router.post('/', auth, asyncHandler(async (req, res) => {
  const { error } = validateReturn(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const rental = await Rental.findOne({
    'customer._id': req.user._id,
    'movie._id': req.body.movieId,
    dateReturned: null
  });

  if (!rental) {
    const existingRental = await Rental.findOne({
      'customer._id': req.user._id,
      'movie._id': req.body.movieId
    });
    
    if (existingRental && existingRental.dateReturned) {
      return res.status(400).send(constants.ERRORS.RETURN_ALREADY_PROCESSED);
    }
    return res.status(404).send(constants.ERRORS.RENTAL_NOT_FOUND);
  }

  try {
    rental.return();
    await rental.save();

    await Movie.updateOne(
      { _id: rental.movie._id },
      { $inc: { numberInStock: 1 } }
    );

    return res.send(rental);
  } catch (error) {
    if (rental.dateReturned) {
      rental.dateReturned = undefined;
      rental.rentalFee = undefined;
      await rental.save();
    }
    throw error;
  }
}));

function validateReturn(req) {
  const schema = Joi.object({
    movieId: Joi.objectId().required()
  });
  return schema.validate(req);
}

module.exports = router;