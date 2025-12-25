// Application constants
module.exports = {
  // Pagination
  DEFAULT_PAGE_SIZE: 4,
  
  // Movie limits
  MAX_STOCK: 255,
  MAX_RENTAL_RATE: 255,
  MAX_TITLE_LENGTH: 50,
  
  // User limits
  MAX_RENTALS_REGULAR: 2,
  MAX_RENTALS_GOLD: 5,
  
  // Error messages
  ERRORS: {
    INVALID_TOKEN: 'Invalid token',
    ACCESS_DENIED: 'Access denied. No token provided.',
    INVALID_EMAIL_PASSWORD: 'Invalid email or password.',
    USER_EXISTS: 'User already registered',
    MOVIE_NOT_IN_STOCK: 'Movie not in stock.',
    RENTAL_NOT_FOUND: 'Rental not found.',
    RETURN_ALREADY_PROCESSED: 'Return already processed.',
    RENTAL_LIMIT_REACHED: 'You have reached your rental limit. Please return a movie before renting another one.'
  }
};

