import { useState, useEffect } from 'react';
import { getWatchlist, removeFromWatchlist, addToWatchlist } from '../services/watchlistService';
import { toast } from 'react-toastify';

const useWatchlist = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    loadWatchlist();
    
    const handleStorageChange = () => {
      loadWatchlist();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadWatchlist = () => {
    const watchlist = getWatchlist();
    setMovies(watchlist);
    return watchlist;
  };

  const addMovie = (movie) => {
    addToWatchlist(movie);
    loadWatchlist();
    toast.success('Added to watchlist');
    window.dispatchEvent(new Event('storage'));
  };

  const removeMovie = (movieId) => {
    removeFromWatchlist(movieId);
    loadWatchlist();
    toast.info('Removed from Watchlist');
    window.dispatchEvent(new Event('storage'));
  };

  const isInWatchlist = (movieId) => {
    return movies.some((m) => m._id === movieId);
  };

  return {
    movies,
    count: movies.length,
    addMovie,
    removeMovie,
    isInWatchlist,
    loadWatchlist,
  };
};

export default useWatchlist;
