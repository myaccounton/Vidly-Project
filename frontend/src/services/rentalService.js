import http from "./httpService";

const apiEndpoint = "/rentals";

/**
 * Get all rentals (Admin)
 */
export function getRentals() {
  return http.get(apiEndpoint);
}

/**
 * Create a new rental
 * @param {Object} rental { movieId }
 */
export function saveRental(rental) {
  return http.post(apiEndpoint, rental);
}

/**
 * Get logged-in user's rentals
 */
export function getMyRentals() {
  return http.get(apiEndpoint + "/my");
}

/**
 * Return a rental with mock payment
 * @param {string} rentalId
 * @param {string} paymentMethod ("UPI" | "Card" | "Cash")
 */
export function returnRental(rentalId, paymentMethod) {
  return http.post(`${apiEndpoint}/${rentalId}/return`, {
    paymentMethod
  });
}
