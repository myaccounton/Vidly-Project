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

  // Look for rental - SECURITY: Only allow users to return their own rentals
  // Only find active rentals (not already returned)
  const rental = await Rental.findOne({
    'customer._id': req.user._id,  // Use authenticated user's ID, not from request body
    'movie._id': req.body.movieId,
    dateReturned: null  // Only find active rentals
  });

  if (!rental) {
    // Check if rental exists but is already returned
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
    // If stock increment fails, rollback the rental return
    if (rental.dateReturned) {
      rental.dateReturned = undefined;
      rental.rentalFee = undefined;
      await rental.save();
    }
    throw error; // Re-throw to be handled by error middleware
  }
}));

function validateReturn(req) {
  const schema = Joi.object({
    movieId: Joi.objectId().required()  // Removed customerId - now using authenticated user
  });
  return schema.validate(req);
}

module.exports = router;