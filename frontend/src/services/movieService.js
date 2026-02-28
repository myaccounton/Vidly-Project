import http from "./httpService";

const apiEndpoint = "/movies";

export function getMovies() {
  return http.get(apiEndpoint);
}

export function getMovie(movieId) {
  return http.get(apiEndpoint + "/" + movieId);
}

export function saveMovie(movie) {
  const formData = new FormData();

  formData.append("title", movie.title);
  formData.append("genreId", movie.genreId);
  formData.append("numberInStock", movie.numberInStock);
  formData.append("dailyRentalRate", movie.dailyRentalRate);

  
  if (movie.poster) {
    formData.append("poster", movie.poster);
  }

  
  if (movie._id) {
    return http.put(apiEndpoint + "/" + movie._id, formData);
  }

  
  return http.post(apiEndpoint, formData);
}

export function deleteMovie(movieId) {
  return http.delete(apiEndpoint + "/" + movieId);
}

export function getRecommendations(movieId) {
  return http.get(apiEndpoint + "/recommendations/" + movieId);
}
