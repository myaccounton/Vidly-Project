import { useState, useEffect, useCallback } from 'react';
import { getMovies, deleteMovie } from '../services/movieService';
import { getGenres } from '../services/genreService';
import { toast } from 'react-toastify';

const useMovies = (autoFetch = true) => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [moviesResponse, genresResponse] = await Promise.all([
        getMovies(),
        getGenres(),
      ]);

      const safeMovies = Array.isArray(moviesResponse)
        ? moviesResponse
        : Array.isArray(moviesResponse?.data)
          ? moviesResponse.data
          : [];

      const safeGenres = Array.isArray(genresResponse?.data)
        ? genresResponse.data
        : Array.isArray(genresResponse)
          ? genresResponse
          : [];

      setMovies(safeMovies);
      setGenres([{ _id: '', name: 'All Genres' }, ...safeGenres]);
    } catch (ex) {
      console.error('Failed to load data:', ex);
      toast.error('Failed to load movies');
      setMovies([]);
      setGenres([{ _id: '', name: 'All Genres' }]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  const handleDelete = useCallback(async (movie) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${movie.title}"?`
    );

    if (!confirmDelete) return;

    const originalMovies = movies;

    setMovies((prevMovies) =>
      (Array.isArray(prevMovies) ? prevMovies : []).filter((m) => m._id !== movie._id)
    );

    try {
      await deleteMovie(movie._id);
      toast.success('Movie deleted successfully');
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error('This movie has already been deleted.');
      } else {
        toast.error('Failed to delete movie');
      }
      setMovies(originalMovies);
    }
  }, [movies]);

  const handleLike = useCallback((movie) => {
    setMovies((prevMovies) =>
      (Array.isArray(prevMovies) ? prevMovies : []).map((m) =>
        m._id === movie._id ? { ...m, liked: !m.liked } : m
      )
    );
  }, []);

  return {
    movies,
    genres,
    loading,
    fetchData,
    handleDelete,
    handleLike,
    setMovies,
  };
};

export default useMovies;
