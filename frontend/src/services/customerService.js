import http from "./httpService";

const apiEndpoint = "/customers";


export function getCustomers() {
  return http.get(apiEndpoint);
}


export function getCustomer(customerId) {
  return http.get(apiEndpoint + "/" + customerId);
}


export function saveCustomer(customer) {
  if (customer._id) {
    const body = { ...customer };
    delete body._id;
    return http.put(apiEndpoint + "/" + customer._id, body);
  }

  return http.post(apiEndpoint, customer);
}


export function deleteCustomer(customerId) {
  return http.delete(apiEndpoint + "/" + customerId);
}
