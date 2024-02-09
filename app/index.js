const express = require('express');
const consign = require('consign');
const app = express();

// Disable x-powered-by header
app.disable('x-powered-by');

// Configure consign for automatic loading of modules
consign({
    cwd: 'app',
    verbose: process.env.APP_DEBUG === 'true' || false,
    locale: 'pt-br',
})
    .include('./middlewares/log')
    .then('./hassio/config')
    .then('./middlewares/globals')
    .then('./middlewares/connections/tuyaCloud.js')
    .then('./middlewares/connections/mqtt.js')
    .then('./services')
    .then('./controllers')
    .then('./routes/tuya.js')
    .then('./routes/error.js')
    .then('./hassio')
    .into(app);

// Get logger from middlewares
const logger = app.middlewares.log.logger;

// Start the server
const PORT = process.env.APP_PORT || 40009;
app.listen(PORT, () => {
    logger.debug(`Server running on http://localhost:${PORT}`);
    logger.debug(`GET http://localhost:${PORT}${process.env.APP_PREFIX}`);
});
