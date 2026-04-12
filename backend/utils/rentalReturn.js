const { calculateRentalDetails } = require("./rentalPricing");

/**
 * @param {import('mongoose').Document} rental
 * @param {{ paymentStatus: string, paymentMethod?: string }} body
 */
function finalizeReturn(rental, body) {
  const end = new Date();
  const plain = rental.toObject ? rental.toObject() : { ...rental };
  const draft = { ...plain, dateReturned: end };
  const details = calculateRentalDetails(draft);

  if (body.paymentStatus !== "SUCCESS") {
    const e = new Error("Payment must be completed to return this rental.");
    e.statusCode = 400;
    throw e;
  }

  if (details.remainingAmount > 0) {
    const method = body.paymentMethod;
    if (!method || !["UPI", "Card", "Cash"].includes(method)) {
      const e = new Error(
        "Payment method is required for the remaining balance."
      );
      e.statusCode = 400;
      throw e;
    }
    rental.finalPaymentAmount = details.remainingAmount;
    rental.finalPaymentMethod = method;
  } else {
    rental.finalPaymentAmount = 0;
    rental.finalPaymentMethod = undefined;
  }

  rental.dateReturned = end;
  rental.totalCost = details.totalCost;
  rental.rentalFee = details.totalCost;
  rental.paymentStatus = "PAID";
}

module.exports = { finalizeReturn };
