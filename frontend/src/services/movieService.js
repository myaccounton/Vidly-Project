import http from "./httpService";

const apiEndpoint = "/movies";

export async function getMovies() {
  const response = await http.get(apiEndpoint);
  const payload = response && Object.prototype.hasOwnProperty.call(response, "data")
    ? response.data
    : response;

  return Array.isArray(payload) ? payload : [];
}

export function getMovie(movieId) {
  return http.get(apiEndpoint + "/" + movieId);
}

export function saveMovie(movie) {
  const body = {
    title: movie.title,
    genreId: movie.genreId,               // 🔥 FIX HERE
    numberInStock: Number(movie.numberInStock),
    dailyRentalRate: Number(movie.dailyRentalRate)
  };

  if (movie._id) {
    return http.put(apiEndpoint + "/" + movie._id, body);
  }

  return http.post(apiEndpoint, body);
}


export function deleteMovie(movieId) {
  return http.delete(apiEndpoint + "/" + movieId);
}

export function getRecommendations(movieId) {
  // Use `apiEndpoint` so this calls `/movies/recommendations/:id` (then baseURL is applied)
  return http.get(apiEndpoint + "/recommendations/" + movieId);
}

