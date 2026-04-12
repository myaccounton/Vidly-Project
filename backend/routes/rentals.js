const { Rental, validateReturnRental, shapeMyRental } = require("../models/rental");
const { validateCreateRental } = require("../validators/rentalCreate");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");
const express = require("express");
const { User } = require("../models/user");
const { Customer } = require("../models/customer");
const asyncHandler = require("../middleware/async");
const notFound = require("../middleware/notFound");
const constants = require("../utils/constants");
const router = express.Router();
const validateObjectId = require("../middleware/validateObjectId");
const { calculateRentalDetails } = require("../utils/rentalPricing");
const { finalizeReturn } = require("../utils/rentalReturn");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const rentals = await Rental.find().sort("-dateOut");
    res.send(rentals);
  })
);

router.post(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    const { error, value } = validateCreateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (value.paymentStatus !== "SUCCESS") {
      return res
        .status(400)
        .send("Initial payment must succeed before a rental is created.");
    }

    if (
      value.customerId &&
      value.customerId !== req.user._id.toString()
    ) {
      return res.status(400).send("Invalid customer.");
    }

    const movie = await Movie.findById(value.movieId);
    if (!movie) return res.status(400).send("Invalid movie.");

    if (movie.numberInStock === 0) {
      return res.status(400).send(constants.ERRORS.MOVIE_NOT_IN_STOCK);
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send("User not found.");

    if (!user.isAdmin) {
      const pendingRental = await Rental.exists({
        "customer._id": user._id,
        dateReturned: null,
        paymentStatus: "PENDING",
      });
      if (pendingRental) {
        return res.status(400).send(
          "You have a rental with incomplete payment. Resolve it before renting again."
        );
      }

      const customer = await Customer.findOne({ userId: user._id });
      const isGold = customer ? customer.isGold : false;

      const activeRentalsCount = await Rental.countDocuments({
        "customer._id": user._id,
        dateReturned: null,
      });

      const rentalLimit = isGold
        ? constants.MAX_RENTALS_GOLD
        : constants.MAX_RENTALS_REGULAR;

      if (activeRentalsCount >= rentalLimit) {
        return res
          .status(400)
          .send(
            `You have reached your rental limit of ${rentalLimit} movie(s). Please return a movie before renting another one.`
          );
      }
    }

    const expectedInitial = Number(movie.dailyRentalRate);
    if (Math.abs(Number(value.initialPayment) - expectedInitial) > 0.001) {
      return res
        .status(400)
        .send(
          `Initial payment must equal the one-day rate (Rs ${expectedInitial}).`
        );
    }

    const updatedMovie = await Movie.findOneAndUpdate(
      { _id: value.movieId, numberInStock: { $gt: 0 } },
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
          email: user.email,
        },
        movie: {
          _id: updatedMovie._id,
          title: updatedMovie.title,
          dailyRentalRate: updatedMovie.dailyRentalRate,
        },
        dailyRate: updatedMovie.dailyRentalRate,
        initialPayment: expectedInitial,
        initialPaymentMethod: value.paymentMethod,
        totalCost: 0,
        paymentStatus: "PARTIAL",
      });

      await rental.save();
      res.send(rental);
    } catch (err) {
      await Movie.updateOne(
        { _id: value.movieId },
        { $inc: { numberInStock: 1 } }
      );
      throw err;
    }
  })
);

router.get(
  "/my",
  auth,
  asyncHandler(async (req, res) => {
    const rentals = await Rental.find({
      "customer._id": req.user._id,
    }).sort("-dateOut");

    const shaped = rentals.map((r) => {
      const row = shapeMyRental(r);
      const overdue =
        !r.dateReturned &&
        row.days > constants.RENTAL_OVERDUE_DAYS_THRESHOLD;
      return { ...row, overdue };
    });

    res.send(shaped);
  })
);

router.get(
  "/:id/summary",
  validateObjectId,
  auth,
  asyncHandler(async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return notFound("Rental")(req, res);

    if (
      rental.customer._id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).send("Access denied");
    }

    const details = calculateRentalDetails(rental);
    const remainingAmount = rental.dateReturned ? 0 : details.remainingAmount;
    const totalCost =
      rental.dateReturned && rental.totalCost != null
        ? rental.totalCost
        : details.totalCost;

    res.send({
      _id: rental._id,
      movieTitle: rental.movie.title,
      dailyRate: rental.dailyRate ?? rental.movie.dailyRentalRate,
      dateOut: rental.dateOut,
      dateReturned: rental.dateReturned,
      initialPayment: rental.initialPayment,
      days: details.days,
      totalCost,
      remainingAmount,
      requiresFinalPayment: !rental.dateReturned && remainingAmount > 0,
      paymentStatus: rental.paymentStatus,
    });
  })
);

const putReturnHandler = asyncHandler(async (req, res) => {
  const { error, value } = validateReturnRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).send("Rental not found");

  if (
    rental.customer._id.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    return res.status(403).send("Access denied");
  }

  if (rental.dateReturned) {
    return res.status(400).send("Already returned");
  }

  const draft = {
    ...rental.toObject(),
    dateReturned: new Date(),
  };
  const preview = calculateRentalDetails(draft);

  if (preview.remainingAmount > 0 && !value.paymentMethod) {
    return res
      .status(400)
      .send("Payment method is required for the remaining balance.");
  }

  try {
    finalizeReturn(rental, value);
    await rental.save();

    await Movie.updateOne(
      { _id: rental.movie._id },
      { $inc: { numberInStock: 1 } }
    );

    res.send(rental);
  } catch (err) {
    if (err.statusCode === 400) {
      return res.status(400).send(err.message);
    }
    throw err;
  }
});

router.put(
  "/:id/return",
  validateObjectId,
  auth,
  putReturnHandler
);

router.post(
  "/:id/return",
  validateObjectId,
  auth,
  putReturnHandler
);

router.get(
  "/:id",
  validateObjectId,
  asyncHandler(async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return notFound("Rental")(req, res);
    res.send(rental);
  })
);

module.exports = router;
