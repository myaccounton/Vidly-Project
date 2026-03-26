import React, { useState, useEffect, useCallback, useMemo } from "react";
import MovieCardsGrid from "./movieCardsGrid";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import MoviesSkeleton from "./common/moviesSkeleton";
import { Link } from "react-router-dom";
import { PAGE_SIZE } from "../utils/constants";
import useMovies from "../hooks/useMovies";
import usePagination from "../hooks/usePagination";
import useSort from "../hooks/useSort";

const Movies = ({ user }) => {
  const { movies, genres, loading, handleDelete, handleLike } = useMovies();
  const safeMovies = Array.isArray(movies) ? movies : [];

  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyLiked, setShowOnlyLiked] = useState(false);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const { currentPage, handlePageChange, getPagedData, resetPage } = usePagination(
    safeMovies,
    pageSize
    );

  const { sortColumn, setSortColumn, getSortedData } = useSort(safeMovies);

  const handleGenreSelect = useCallback((genre) => {
    setSelectedGenre(genre);
  }, []);

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const { totalCount, data: pagedMovies } = useMemo(() => {
    let filtered = safeMovies;

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

    if (showOnlyLiked) {
      filtered = filtered.filter((m) => m.liked);
    }

    if (showOnlyAvailable) {
      filtered = filtered.filter((m) => m.numberInStock > 0);
    }

    const sorted = getSortedData(filtered);
    const result = getPagedData(sorted);

    return result;
  }, [
    safeMovies,
    selectedGenre,
    searchQuery,
    showOnlyLiked,
    showOnlyAvailable,
    getSortedData,
    getPagedData
  ]);

  useEffect(() => {
    resetPage();
  }, [selectedGenre, searchQuery, showOnlyLiked, showOnlyAvailable, pageSize, resetPage]);

  const likedCount = useMemo(
    () => safeMovies.filter((movie) => movie.liked).length,
    [safeMovies]
  );

  const availableCount = useMemo(
    () => safeMovies.filter((movie) => movie.numberInStock > 0).length,
    [safeMovies]
  );

  const clearAllFilters = useCallback(() => {
    setSelectedGenre(null);
    setSearchQuery("");
    setShowOnlyLiked(false);
    setShowOnlyAvailable(false);
  }, []);

  const handleSortPresetChange = useCallback(
    (value) => {
      const [path, order] = value.split("|");
      setSortColumn({ path, order });
    },
    [setSortColumn]
  );

  if (loading) return <MoviesSkeleton />;

  if (safeMovies.length === 0)
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-10 text-center text-zinc-300">
        <h5 className="mb-3 text-2xl font-semibold text-white">No Movies Available</h5>
        <p className="mb-4 text-zinc-400">The database is empty. Add movies to get started.</p>
            {user && user.isAdmin && (
              <Link to="/movies/new" className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white no-underline transition hover:bg-red-500">
                Add First Movie
              </Link>
            )}
      </div>
    );


  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-gray-800 pb-5 md:flex-row md:items-start">
        <div>
          <h3 className="mb-2 text-3xl font-bold tracking-tight text-white">Movies</h3>
          <p className="mb-0 text-sm text-gray-400">
            Discover and manage your catalog in a modern browsing experience.
          </p>

          {user && !user.isAdmin && (
            <small className="mt-2 block text-gray-400">
              {user.isGold
                ? "🌟 Gold Member · Rent up to 5 movies"
                : "Regular Member · Rent up to 2 movies"}
            </small>
          )}

          {user?.isAdmin && (
            <small className="mt-2 block text-gray-400">Admin account</small>
          )}
        </div>

        {user && user.isAdmin && (
          <Link
            to="/movies/new"
            className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 font-semibold text-white no-underline transition hover:bg-red-500"
          >
            + New Movie
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="w-full lg:w-72 lg:flex-shrink-0">
          <div className="rounded-xl bg-gray-900 p-4">
              <h6 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-300">
                <i className="fas fa-filter me-2"></i>
                Filters
              </h6>
              <ListGroup
                items={genres}
                selectedItem={selectedGenre}
                onItemSelect={handleGenreSelect}
              />
          </div>
        </aside>

        <section className="flex-1">
          <div className="rounded-xl bg-gray-900 p-4 md:p-5">
              <div className="mb-4">
                <div className="flex items-center overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
                  <span className="px-3 text-gray-400">
                    <i className="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    className="w-full border-0 bg-transparent px-2 py-3 text-sm text-gray-100 outline-none placeholder:text-gray-500"
                    placeholder="Search movies by title or genre..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      className="px-3 py-2 text-gray-400 transition hover:text-white"
                      type="button"
                      onClick={() => handleSearchChange("")}
                      title="Clear search"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <small className="mt-2 block text-xs text-gray-400">
                    <i className="fas fa-info-circle me-1"></i>
                    Found {totalCount} movie{totalCount !== 1 ? 's' : ''} matching "{searchQuery}"
                  </small>
                )}
              </div>

              <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-gray-800 pb-4">
                <button
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition ${
                    showOnlyAvailable
                      ? "bg-red-600 text-white"
                      : "border border-gray-700 bg-transparent text-gray-200 hover:border-gray-500 hover:bg-gray-800"
                  }`}
                  type="button"
                  onClick={() => setShowOnlyAvailable((prev) => !prev)}
                >
                  In Stock ({availableCount})
                </button>
                <button
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition ${
                    showOnlyLiked
                      ? "bg-red-600 text-white"
                      : "border border-gray-700 bg-transparent text-gray-200 hover:border-gray-500 hover:bg-gray-800"
                  }`}
                  type="button"
                  onClick={() => setShowOnlyLiked((prev) => !prev)}
                >
                  Liked ({likedCount})
                </button>
                <div className="ml-auto flex min-w-[185px] items-center gap-2">
                  <label htmlFor="sortPreset" className="mb-0 text-xs uppercase tracking-wide text-gray-400">
                    Sort:
                  </label>
                  <select
                    id="sortPreset"
                    className="min-w-[130px] rounded-lg border border-gray-700 bg-gray-800 px-2 py-2 text-sm text-gray-100 outline-none"
                    value={`${sortColumn.path}|${sortColumn.order}`}
                    onChange={(e) => handleSortPresetChange(e.target.value)}
                  >
                    <option value="title|asc">Title (A-Z)</option>
                    <option value="title|desc">Title (Z-A)</option>
                    <option value="dailyRentalRate|desc">Rate (High-Low)</option>
                    <option value="dailyRentalRate|asc">Rate (Low-High)</option>
                    <option value="numberInStock|desc">Stock (High-Low)</option>
                    <option value="numberInStock|asc">Stock (Low-High)</option>
                  </select>
                </div>
                <div className="flex min-w-[150px] items-center gap-2">
                  <label htmlFor="pageSize" className="mb-0 text-xs uppercase tracking-wide text-gray-400">
                    Rows:
                  </label>
                  <select
                    id="pageSize"
                    className="min-w-[90px] rounded-lg border border-gray-700 bg-gray-800 px-2 py-2 text-sm text-gray-100 outline-none"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                  >
                    <option value={4}>4</option>
                    <option value={8}>8</option>
                    <option value={12}>12</option>
                  </select>
                </div>
                <button
                  className="rounded-full border border-gray-700 px-4 py-2 text-xs font-semibold tracking-wide text-gray-200 transition hover:border-gray-500 hover:bg-gray-800"
                  type="button"
                  onClick={clearAllFilters}
                >
                  Clear Filters
                </button>
              </div>

              <MovieCardsGrid
                movies={pagedMovies}
                user={user}
                onLike={handleLike}
                onDelete={handleDelete}
              />
          </div>
          <div className="mt-5 flex justify-center">
            <Pagination
              itemsCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </section>
      </div>
    </div>
  );

};

export default Movies;
