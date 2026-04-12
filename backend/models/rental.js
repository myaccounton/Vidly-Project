const Joi = require("joi");
const mongoose = require("mongoose");
const { calculateRentalDetails } = require("../utils/rentalPricing");
const { finalizeReturn } = require("../utils/rentalReturn");

const PAYMENT_METHODS = ["UPI", "Card", "Cash"];
const PAYMENT_STATUS = ["PENDING", "PARTIAL", "PAID"];

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      title: {
        type: String,
        required: true,
        minlength: 1,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  /** Snapshot of daily rate at checkout (single source for pricing). */
  dailyRate: {
    type: Number,
    required: true,
    min: 0,
  },
  /** One-day prepaid charge collected before rental starts. */
  initialPayment: {
    type: Number,
    required: true,
    min: 0,
  },
  initialPaymentMethod: {
    type: String,
    enum: PAYMENT_METHODS,
  },
  /** Final amount paid on return (remainder); 0 if none due. */
  finalPaymentAmount: {
    type: Number,
    min: 0,
  },
  finalPaymentMethod: {
    type: String,
    enum: PAYMENT_METHODS,
  },
  /** Settled total when returned; while active may stay 0 (use calculateRentalDetails). */
  totalCost: {
    type: Number,
    default: 0,
    min: 0,
  },
  paymentStatus: {
    type: String,
    enum: PAYMENT_STATUS,
    default: "PENDING",
  },
  /** Kept for dashboard revenue aggregation. */
  rentalFee: {
    type: Number,
    min: 0,
  },
  /** @deprecated legacy shape; optional for old documents */
  payment: {
    amount: Number,
    method: String,
    status: String,
    paidAt: Date,
  },
});

rentalSchema.methods.return = function (body) {
  finalizeReturn(
    this,
    body || { paymentStatus: "SUCCESS", paymentMethod: "UPI" }
  );
};

const Rental = mongoose.model("Rental", rentalSchema);

function validateReturnRental(body) {
  const schema = Joi.object({
    paymentStatus: Joi.string().valid("SUCCESS", "FAILED").required(),
    paymentMethod: Joi.string().valid(...PAYMENT_METHODS).optional(),
  });

  return schema.validate(body);
}

function shapeMyRental(rentalDoc) {
  const r = rentalDoc.toObject ? rentalDoc.toObject() : rentalDoc;
  const dailyRate = r.dailyRate ?? r.movie?.dailyRentalRate ?? 0;
  const initialPayment = Number(r.initialPayment ?? 0);
  const details = calculateRentalDetails(r);
  const remainingAmount = r.dateReturned ? 0 : details.remainingAmount;
  const totalCost =
    r.dateReturned && r.totalCost != null ? r.totalCost : details.totalCost;

  return {
    _id: r._id,
    movieTitle: r.movie?.title,
    dateOut: r.dateOut,
    dateReturned: r.dateReturned,
    dailyRate,
    days: details.days,
    totalCost,
    initialPayment,
    remainingAmount,
    paymentStatus: r.paymentStatus,
    movie: r.movie,
    finalPaymentAmount: r.finalPaymentAmount,
    finalPaymentMethod: r.finalPaymentMethod,
  };
}

exports.Rental = Rental;
exports.validateReturnRental = validateReturnRental;
exports.shapeMyRental = shapeMyRental;
exports.PAYMENT_METHODS = PAYMENT_METHODS;
exports.PAYMENT_STATUS = PAYMENT_STATUS;
