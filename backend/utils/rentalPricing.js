/**
 * Core rental pricing: elapsed days, total due, balance after initial prepaid day.
 * @param {object} rental - plain object or mongoose doc with dateOut, optional dateReturned, dailyRate or movie.dailyRentalRate, initialPayment
 */
function calculateRentalDetails(rental) {
  const rentalObj = rental.toObject ? rental.toObject() : rental;
  const currentDate = rentalObj.dateReturned
    ? new Date(rentalObj.dateReturned)
    : new Date();

  const dateOut = new Date(rentalObj.dateOut);
  const msPerDay = 1000 * 60 * 60 * 24;
  const rawDays =
    Math.ceil((currentDate - dateOut) / msPerDay) || 1;
  const days = Math.max(1, rawDays);

  const dailyRate =
    rentalObj.dailyRate != null
      ? rentalObj.dailyRate
      : rentalObj.movie?.dailyRentalRate ?? 0;

  const totalCost = days * dailyRate;
  const initialPayment = Number(rentalObj.initialPayment ?? 0);
  const remainingAmount = Math.max(0, totalCost - initialPayment);

  return {
    days,
    totalCost,
    remainingAmount,
  };
}

module.exports = {
  calculateRentalDetails,
};
