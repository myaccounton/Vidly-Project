const Joi = require("joi");
const mongoose = require("mongoose");
const moment = require("moment");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      }
    }),
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      title: {
        type: String,
        required: true,
        minlength: 1   // ✅ FIXED
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 10
      }
    }),
    required: true
  },
  dateOut: {
    type: Date,
    default: Date.now
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});

// Return logic
rentalSchema.methods.return = function () {
  this.dateReturned = new Date();
  const rentalDays = moment().diff(this.dateOut, "days");
  // Ensure minimum 1 day rental fee (even if returned same day)
  const daysToCharge = Math.max(1, rentalDays);
  this.rentalFee = daysToCharge * this.movie.dailyRentalRate;
};

const Rental = mongoose.model("Rental", rentalSchema);

function validateRental(rental) {
  const schema = Joi.object({
    movieId: Joi.objectId().required()
  });

  return schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;
