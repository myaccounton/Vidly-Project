import React, { useState, useEffect, useCallback, useMemo } from "react";
import MoviesTable from "./moviesTable";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import RatingsChart from "./ratingsChart";
import MoviesSkeleton from "./common/moviesSkeleton";
import { Link } from "react-router-dom";
import { PAGE_SIZE } from "../utils/constants";
import useMovies from "../hooks/useMovies";
import usePagination from "../hooks/usePagination";
import useSort from "../hooks/useSort";

const Movies = ({ user }) => {
  const { movies, genres, loading, handleDelete, handleLike } = useMovies();

  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const pageSize = PAGE_SIZE;

  const { currentPage, handlePageChange, getPagedData, resetPage } = usePagination(
    movies,
    pageSize
  );

  const { sortColumn, handleSort, getSortedData } = useSort(movies);

  const handleGenreSelect = useCallback((genre) => {
    setSelectedGenre(genre);
  }, []);

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const { totalCount, data: pagedMovies } = useMemo(() => {
    let filtered = movies;

    if (selectedGenre && selectedGenre._id) {
      filtered = filtered.filter((m) => m.genre._id === selectedGenre._id);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          m.genre.name.toLowerCase().includes(query)
      );
    }

    const sorted = getSortedData(filtered);
    const result = getPagedData(sorted);

    return result;
  }, [movies, selectedGenre, searchQuery, getSortedData, getPagedData]);

  useEffect(() => {
    resetPage();
  }, [selectedGenre, searchQuery, resetPage]);

  if (loading) return <MoviesSkeleton />;

  if (movies.length === 0)
    return (
      <div className="text-center py-5">
        <div className="card shadow-sm">
          <div className="card-body py-5">
            <h5 className="text-muted mb-3">No Movies Available</h5>
            <p className="text-muted mb-4">The database is empty. Add movies to get started.</p>
            {user && user.isAdmin && (
              <Link to="/movies/new" className="btn btn-primary">
                Add First Movie
              </Link>
            )}
          </div>
        </div>
      </div>
    );


  return (
    <>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h3 className="mb-1">Movies</h3>

          {user && !user.isAdmin && (
            <small className="text-muted">
              {user.isGold
                ? "🌟 Gold Member · Rent up to 5 movies"
                : "Regular Member · Rent up to 2 movies"}
            </small>
          )}

          {user?.isAdmin && (
            <small className="text-muted">Admin account</small>
          )}
        </div>

        {user && user.isAdmin && (
          <Link to="/movies/new" className="btn btn-primary">
            + New Movie
          </Link>
        )}
      </div>

      <div className="row">
        <div className="col-3">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h6 className="mb-3">
                <i className="fas fa-filter me-2"></i>
                Filters
              </h6>
              <ListGroup
                items={genres}
                selectedItem={selectedGenre}
                onItemSelect={handleGenreSelect}
              />
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-white" style={{ height: '38px' }}>
                    <i className="fas fa-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search movies by title or genre..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    style={{ height: '38px' }}
                  />
                  {searchQuery && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => handleSearchChange("")}
                      title="Clear search"
                      style={{ height: '38px' }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <small className="text-muted mt-2 d-block" style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                    <i className="fas fa-info-circle me-1"></i>
                    Found {totalCount} movie{totalCount !== 1 ? 's' : ''} matching "{searchQuery}"
                  </small>
                )}
              </div>
              <MoviesTable
                movies={pagedMovies}
                sortColumn={sortColumn}
                onSort={handleSort}
                onDelete={handleDelete}
                onLike={handleLike}
              />
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <Pagination
              itemsCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <RatingsChart movies={movies.slice(0, 6)} />
            </div>
          </div>


        </div>
      </div>
    </>
  );

};

export default Movies;
