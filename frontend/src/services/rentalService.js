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

export function returnRental(rentalId, paymentMethod) {
  return http.post(`${apiEndpoint}/${rentalId}/return`, {
    paymentMethod
  });
}
