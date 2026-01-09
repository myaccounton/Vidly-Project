const {Rental, validate} = require('../models/rental'); 
const {Movie} = require('../models/movie');  
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const express = require('express');
const { User } = require("../models/user");
const { Customer } = require("../models/customer");
const asyncHandler = require('../middleware/async');
const notFound = require('../middleware/notFound');
const constants = require('../utils/constants');
const router = express.Router();
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', asyncHandler(async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
}));

router.post("/", auth, asyncHandler(async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  if (movie.numberInStock === 0)
    return res.status(400).send(constants.ERRORS.MOVIE_NOT_IN_STOCK);

  const user = await User.findById(req.user._id);
  if (!user) return res.status(400).send("User not found.");

  // Check rental limit for non-admin users
  if (!user.isAdmin) {
    // Get customer to check gold status
    const customer = await Customer.findOne({ userId: user._id });
    const isGold = customer ? customer.isGold : false;
    
    // Count active rentals (not returned)
    const activeRentalsCount = await Rental.countDocuments({
      "customer._id": user._id,
      dateReturned: null
    });

    // Determine rental limit based on membership
    const rentalLimit = isGold ? constants.MAX_RENTALS_GOLD : constants.MAX_RENTALS_REGULAR;

    // Check if user has reached their rental limit
    if (activeRentalsCount >= rentalLimit) {
      return res.status(400).send(
        `You have reached your rental limit of ${rentalLimit} movie(s). Please return a movie before renting another one.`
      );
    }
  }

  // Use atomic operation to prevent race condition
  // Only decrement if stock > 0
  const updatedMovie = await Movie.findOneAndUpdate(
    { _id: req.body.movieId, numberInStock: { $gt: 0 } },
    { $inc: { numberInStock: -1 } },
    { new: true }
  );

  if (!updatedMovie) {
    return res.status(400).send(constants.ERRORS.MOVIE_NOT_IN_STOCK);
  }

  try {
    const rental = new Rental({
      customer: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      movie: {
        _id: updatedMovie._id,
        title: updatedMovie.title,
        dailyRentalRate: updatedMovie.dailyRentalRate
      }
    });

    await rental.save();
    res.send(rental);
  } catch (error) {
    // Rollback stock increment if rental save fails
    await Movie.updateOne(
      { _id: req.body.movieId },
      { $inc: { numberInStock: 1 } }
    );
    throw error; // Re-throw to be handled by error middleware
  }
}));

router.post("/:id/return", auth, async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).send("Rental not found");

  if (rental.customer._id.toString() !== req.user._id && !req.user.isAdmin)
    return res.status(403).send("Access denied");

  if (rental.dateReturned)
    return res.status(400).send("Already returned");

  const allowedMethods = ["UPI", "Card", "Cash"];
  if (!allowedMethods.includes(req.body.paymentMethod))
    return res.status(400).send("Invalid payment method");

  rental.dateReturned = new Date();

  const days = Math.max(
    1,
    Math.ceil((rental.dateReturned - rental.dateOut) / (1000 * 60 * 60 * 24))
  );

  const amount = days * rental.movie.dailyRentalRate;

  rental.payment = {
    amount,
    method: req.body.paymentMethod,
    status: "Paid",
    paidAt: new Date()
  };

  await rental.save();

  await Movie.updateOne(
    { _id: rental.movie._id },
    { $inc: { numberInStock: 1 } }
  );

  res.send(rental);
});



router.get("/my", auth, asyncHandler(async (req, res) => {
  const rentals = await Rental.find({
    "customer._id": req.user._id
  }).sort("-dateOut");

  res.send(rentals);
}));

router.get('/:id', validateObjectId, asyncHandler(async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return notFound('Rental')(req, res);
  res.send(rental);
}));


module.exports = router;