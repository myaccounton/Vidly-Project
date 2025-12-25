// Async error handler wrapper
// Wraps async route handlers to automatically catch errors
module.exports = function asyncHandler(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (ex) {
      next(ex);
    }
  };
};

