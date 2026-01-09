import React, { useMemo } from "react";
import { Link, withRouter } from "react-router-dom";
import auth from "../services/authService";
import Table from "./common/table";
import Like from "./common/likes";
import { toast } from "react-toastify";
import {
  addToWatchlist,
  getWatchlist
} from "../services/watchlistService";

const MoviesTable = ({
  movies,
  sortColumn,
  onSort,
  onLike,
  onDelete,
  history
}) => {
  const user = auth.getCurrentUser();

  const isInWatchlist = movie => {
    const watchlist = getWatchlist();
    return watchlist.some(m => m._id === movie._id);
  };

 const columns = useMemo(() => {
  const baseColumns = [
    {
      path: "title",
      label: "Title",
      content: movie => (
        <Link to={`/movies/${movie._id}`}>{movie.title}</Link>
      )
    },
    { path: "genre.name", label: "Genre" },
    { path: "numberInStock", label: "Stock" },
    { 
      path: "dailyRentalRate", 
      label: "Rate",
      content: movie => `Rs ${movie.dailyRentalRate}/day`
    },
    {
      key: "like",
      content: movie => (
        <Like liked={movie.liked} onClick={() => onLike(movie)} />
      )
    }
  ];

  if (user) {
    baseColumns.push({
      key: "watchlist",
      content: movie => {
        const added = isInWatchlist(movie);

        return (
          <button
            className={`btn btn-sm ${
              added ? "btn-secondary" : "btn-outline-primary"
            }`}
            disabled={added}
            onClick={() => {
              addToWatchlist(movie);
              toast.success("Added to Watchlist");
              window.dispatchEvent(new Event("storage"));
            }}
          >
            {added ? "Added" : "+ Watchlist"}
          </button>
        );
      }
    });
  }

  if (user && user.isAdmin) {
    baseColumns.push({
      key: "delete",
      content: movie => (
        <button
          onClick={() => onDelete(movie)}
          className="btn btn-danger btn-sm"
        >
          Delete
        </button>
      )
    });
  }

  return baseColumns;
}, [user, onLike, onDelete]);


  return (
    <Table
      columns={columns}
      data={movies}
      sortColumn={sortColumn}
      onSort={onSort}
    />
  );
};

export default withRouter(MoviesTable);
