const config = require('config');

module.exports = function(){
    const requiredConfig = ['jwtPrivateKey', 'db'];
    
    for (const key of requiredConfig) {
        if (!config.get(key)) {
            throw new Error(`FATAL ERROR: ${key} is not defined.`);
        }
    }
    
    console.log('Configuration validated successfully');
}