import axios from "axios";
import { toast } from "react-toastify";


axios.defaults.baseURL = process.env.REACT_APP_API_URL || "/api";

axios.interceptors.response.use(
  response => response,
  error => {
    const expectedError =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;

    if (!expectedError) {
      toast.error("An unexpected error occurred.");
    }

    return Promise.reject(error);
  }
);

function setJwt(jwt) {
  axios.defaults.headers.common["x-auth-token"] = jwt;
}

function clearJwt() {
  delete axios.defaults.headers.common["x-auth-token"];
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
  clearJwt
};
