const helmet = require('helmet');
const compression = require('compression');

module.exports = function(app){
    // Configure Helmet to not interfere with CORS
    app.use(helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      crossOriginEmbedderPolicy: false
    }));
    app.use(compression());
}