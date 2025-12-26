import http from "./httpService";

const apiEndpoint = "/movies";

export function getMovies() {
  return http.get(apiEndpoint);
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
  return http.get("/recommendations/" + movieId);
}

