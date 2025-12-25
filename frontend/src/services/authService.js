import jwtDecode from "jwt-decode";
import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/auth";
const tokenKey = "token";

http.setJwt(getJwt());

export async function login(email, password) {
  const { data: jwt } = await http.post(apiEndpoint, { email, password });
  localStorage.setItem(tokenKey, jwt);
  http.setJwt(jwt); // Set JWT in axios headers
}

export async function register(user) {
  return http.post(apiUrl + "/users", {
    email: user.username,
    password: user.password,
    name: user.name
  });
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
  http.setJwt(jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem("watchlist");
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export default {
  login,
  register,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt
};
