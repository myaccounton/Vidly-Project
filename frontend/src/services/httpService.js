import axios from "axios";
import { toast } from "react-toastify";

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");


const baseURL = isLocalhost
  ? "http://localhost:10000/api"
  : "https://vidly-backend-r69q.onrender.com/api"; // 

axios.defaults.baseURL = baseURL;

// RESPONSE INTERCEPTOR
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

// JWT helpers
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