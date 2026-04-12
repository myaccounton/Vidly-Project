const Joi = require("joi");

/**
 * POST /api/rentals — validated after app.js registers Joi.objectId.
 * Kept in a dedicated module so the schema always matches the route handler.
 */
const createRentalSchema = Joi.object({
  movieId: Joi.objectId().required(),
  customerId: Joi.objectId().optional().allow(null, ""),
  initialPayment: Joi.number().min(0).required(),
  paymentStatus: Joi.string().valid("SUCCESS", "FAILED").required(),
  paymentMethod: Joi.string().valid("UPI", "Card", "Cash").required(),
});

function validateCreateRental(body) {
  return createRentalSchema.validate(body, { abortEarly: false });
}

module.exports = { validateCreateRental };
