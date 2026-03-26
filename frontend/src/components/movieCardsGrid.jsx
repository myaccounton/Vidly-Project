import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addToWatchlist, getWatchlist } from "../services/watchlistService";

const MovieCardsGrid = ({ movies, user, onLike, onDelete }) => {
  const isInWatchlist = (movie) => {
    const watchlist = getWatchlist();
    return watchlist.some((m) => m._id === movie._id);
  };

  if (!movies.length) {
    return (
      <div className="rounded-xl bg-gray-900 p-10 text-center text-gray-300">
        <h5 className="mb-2 text-lg font-semibold text-white">No movies found</h5>
        <p className="mb-0 text-sm text-gray-400">Try changing search or filter options.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {movies.map((movie) => {
        const added = user ? isInWatchlist(movie) : false;

        return (
          <article
            key={movie._id}
            className="group overflow-hidden rounded-xl bg-gray-900 shadow-md transition duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl"
          >
            <Link to={`/movies/${movie._id}`} className="block">
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-800">
                {movie.posterUrl ? (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-500">
                    No Poster
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="mb-0 line-clamp-2 text-base font-semibold text-white">{movie.title}</h3>
                </div>
              </div>
            </Link>

            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-red-600/20 px-3 py-1 text-xs font-medium text-red-300">
                  {movie.genre?.name || "Unknown"}
                </span>
                <div className="text-sm font-semibold text-gray-100">Rs {movie.dailyRentalRate}/day</div>
              </div>

              <div className="text-xs text-gray-400">Stock: {movie.numberInStock}</div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-200 transition hover:border-gray-500 hover:bg-gray-800"
                  onClick={() => onLike(movie)}
                  title="Like movie"
                >
                  <i className={`${movie.liked ? "fa-solid text-red-400" : "fa-regular text-gray-300"} fa-heart`} />
                  {movie.liked ? "Liked" : "Like"}
                </button>

                {user && (
                  <button
                    type="button"
                    disabled={added}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      added
                        ? "cursor-not-allowed bg-gray-700 text-gray-300"
                        : "border border-gray-700 text-gray-200 hover:border-gray-500 hover:bg-gray-800"
                    }`}
                    onClick={() => {
                      addToWatchlist(movie);
                      toast.success("Added to Watchlist");
                      window.dispatchEvent(new Event("storage"));
                    }}
                  >
                    {added ? "Added" : "+ Watchlist"}
                  </button>
                )}
              </div>

              {user?.isAdmin && (
                <button
                  type="button"
                  onClick={() => onDelete(movie)}
                  className="w-full rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-500"
                >
                  Delete Movie
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default MovieCardsGrid;
