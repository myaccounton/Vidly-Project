
const KEY = "watchlist";

export function getWatchlist() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function addToWatchlist(movie) {
  const list = getWatchlist();

  if (!list.find(m => m._id === movie._id)) {
    list.push(movie);
    localStorage.setItem(KEY, JSON.stringify(list));
  }
}

export function removeFromWatchlist(id) {
  const list = getWatchlist().filter(m => m._id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
}


