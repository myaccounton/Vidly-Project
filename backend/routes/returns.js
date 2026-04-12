const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");
const express = require("express");
const asyncHandler = require("../middleware/async");
const constants = require("../utils/constants");
const router = express.Router();
const Joi = require("joi");
const { finalizeReturn } = require("../utils/rentalReturn");

router.post(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    const { error, value } = validateReturnBody(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const rental = await Rental.findOne({
      "customer._id": req.user._id,
      "movie._id": value.movieId,
      dateReturned: null,
    });

    if (!rental) {
      const existingRental = await Rental.findOne({
        "customer._id": req.user._id,
        "movie._id": value.movieId,
      });

      if (existingRental && existingRental.dateReturned) {
        return res
          .status(400)
          .send(constants.ERRORS.RETURN_ALREADY_PROCESSED);
      }
      return res.status(404).send(constants.ERRORS.RENTAL_NOT_FOUND);
    }

    const returnBody = {
      paymentStatus: value.paymentStatus || "SUCCESS",
      paymentMethod: value.paymentMethod || "UPI",
    };

    try {
      finalizeReturn(rental, returnBody);
      await rental.save();

      await Movie.updateOne(
        { _id: rental.movie._id },
        { $inc: { numberInStock: 1 } }
      );

      return res.send(rental);
    } catch (error) {
      if (rental.dateReturned) {
        rental.dateReturned = undefined;
        rental.totalCost = undefined;
        rental.rentalFee = undefined;
        rental.finalPaymentAmount = undefined;
        rental.finalPaymentMethod = undefined;
        rental.paymentStatus = "PARTIAL";
        await rental.save();
      }
      if (error.statusCode === 400) {
        return res.status(400).send(error.message);
      }
      throw error;
    }
  })
);

function validateReturnBody(body) {
  const schema = Joi.object({
    movieId: Joi.objectId().required(),
    paymentStatus: Joi.string().valid("SUCCESS", "FAILED").default("SUCCESS"),
    paymentMethod: Joi.string().valid("UPI", "Card", "Cash"),
  });
  return schema.validate(body);
}

module.exports = router;
