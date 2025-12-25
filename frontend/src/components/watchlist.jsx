import React, { useEffect, useState } from "react";
import { getWatchlist, removeFromWatchlist } from "../services/watchlistService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Watchlist = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    setMovies(getWatchlist());
  }, []);

  const handleRemove = movieId => {
  removeFromWatchlist(movieId);
  setMovies(getWatchlist());
  toast.info("Removed from Watchlist");
  window.dispatchEvent(new Event("storage"));
};


  if (movies.length === 0)
    return (
      <div className="container mt-4">
        <h3>My Watchlist</h3>
        <p className="text-muted">Your watchlist is empty.</p>
      </div>
    );

  return (
    <div className="container mt-4">
     <h3 className="mb-4">
       My Watchlist{" "}
      <span className="badge bg-secondary">{movies.length}</span>
         </h3>


      <table className="table table-hover">
        <thead>
          <tr>
            <th>Title</th>
            <th>Genre</th>
            <th>Rating</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {movies.map(movie => (
            <tr key={movie._id}>
              <td>
                <Link to={`/movies/${movie._id}`}>
                  {movie.title}
                </Link>
              </td>
              <td>{movie.genre?.name || "-"}</td>
              <td>Rs {movie.dailyRentalRate}/day</td>
              <td>
                <button
                  onClick={() => handleRemove(movie._id)}
                  className="btn btn-sm btn-outline-danger"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Watchlist;
