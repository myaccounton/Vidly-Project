import http from "./httpService";

const apiEndpoint = "/customers";

/**
 * Get all customers
 */
export function getCustomers() {
  return http.get(apiEndpoint);
}

/**
 * Get single customer
 */
export function getCustomer(customerId) {
  return http.get(apiEndpoint + "/" + customerId);
}

/**
 * Save or update customer
 */
export function saveCustomer(customer) {
  if (customer._id) {
    const body = { ...customer };
    delete body._id;
    return http.put(apiEndpoint + "/" + customer._id, body);
  }

  return http.post(apiEndpoint, customer);
}

/**
 * Delete customer
 */
export function deleteCustomer(customerId) {
  return http.delete(apiEndpoint + "/" + customerId);
}
