import React, { useEffect, useState } from "react";
import MoviesTable from "./moviesTable";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import RatingsChart from "./ratingsChart";
import SearchBox from "./common/searchBox";
import { Link } from "react-router-dom";
import { getMovies, deleteMovie } from "../services/movieService";
import { toast } from "react-toastify";
import { getGenres } from "../services/genreService";
import { paginate } from "../utils/paginate";
import { PAGE_SIZE } from "../utils/constants";
import _ from "lodash";

const Movies = ({ user }) => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState({
    path: "title",
    order: "asc",
  });

  const pageSize = PAGE_SIZE;

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: moviesData } = await getMovies();
        const { data: genresData } = await getGenres();

        setMovies(moviesData);
        setGenres([{ _id: "", name: "All Genres" }, ...genresData]);
      } catch (ex) {
        console.error("Failed to load data:", ex);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-3">Loading movies...</p>
      </div>
    );

  const handleDelete = async movie => {

    const confirmDelete = window.confirm(
    `Are you sure you want to delete "${movie.title}"?`
  );

  if (!confirmDelete) return;


  const originalMovies = movies;

  setMovies(movies.filter(m => m._id !== movie._id));

  try {
    await deleteMovie(movie._id);
  } catch (ex) {
    if (ex.response && ex.response.status === 404)
      toast.error("This movie has already been deleted.");

    setMovies(originalMovies);
  }
};


  const handleLike = movie => {
    const updated = movies.map(m =>
      m._id === movie._id ? { ...m, liked: !m.liked } : m
    );
    setMovies(updated);
  };

  const handleGenreSelect = genre => {
    setSelectedGenre(genre);
    setCurrentPage(1);
  };

  const handleSearchChange = query => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handleSort = sortColumn => {
    setSortColumn(sortColumn);
  };

  const getPagedData = () => {
    let filtered = movies;

    if (selectedGenre && selectedGenre._id) {
      filtered = filtered.filter(m => m.genre._id === selectedGenre._id);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.title.toLowerCase().includes(query) ||
        m.genre.name.toLowerCase().includes(query)
      );
    }

    const sorted = _.orderBy(
      filtered,
      [sortColumn.path],
      [sortColumn.order]
    );

    const pagedMovies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: pagedMovies };
  };

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

  const { totalCount, data: pagedMovies } = getPagedData();

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
