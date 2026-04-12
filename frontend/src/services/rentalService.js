import http from "./httpService";

const apiEndpoint = "/rentals";

export function getRentals() {
  return http.get(apiEndpoint);
}

export function saveRental(rental) {
  return http.post(apiEndpoint, rental);
}

export function getMyRentals() {
  return http.get(apiEndpoint + "/my");
}

export function getRentalSummary(rentalId) {
  return http.get(`${apiEndpoint}/${rentalId}/summary`);
}

export function returnRental(rentalId, body) {
  return http.put(`${apiEndpoint}/${rentalId}/return`, body);
}
