// Standardized 404 handler for resources
module.exports = function notFound(resourceName = 'Resource') {
  return (req, res) => {
    res.status(404).send(`The ${resourceName} with the given ID was not found.`);
  };
};

