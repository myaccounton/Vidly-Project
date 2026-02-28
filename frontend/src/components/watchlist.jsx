import React from "react";
import useWatchlist from "../hooks/useWatchlist";
import { Link } from "react-router-dom";

const Watchlist = () => {
  const { movies, removeMovie } = useWatchlist();


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
                  onClick={() => removeMovie(movie._id)}
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
