import http from "./httpService";

const apiEndpoint =  "/rentals";

/**
 * Get all rentals
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

export function getMyRentals() {
  return http.get(apiEndpoint + "/my");
}

/**
 * Return a rental
 * @param {Object} returnData { movieId }
 */
export function returnRental(returnData) {
  return http.post("/returns", returnData);
}

