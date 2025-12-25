const config = require('config');

module.exports = function(){
    // Validate required configuration
    const requiredConfig = ['jwtPrivateKey', 'db'];
    
    for (const key of requiredConfig) {
        if (!config.get(key)) {
            throw new Error(`FATAL ERROR: ${key} is not defined.`);
        }
    }
    
    // Log successful configuration (without sensitive data)
    console.log('Configuration validated successfully');
}