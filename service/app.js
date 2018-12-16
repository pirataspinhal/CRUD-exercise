const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const mongoose = require('mongoose');

const routes = require('./src/Routes');
const config = require('./etc/config/serviceConfig');
const logger = require('./src/Utils/Logger');
const corsMiddleware = require('./src/Middleware/CorsMiddleware');

function serveMongo() {
  const {serverUri, options} = config.mongo;
  mongoose.connect(serverUri, options);
  mongoose.Promise = global.Promise;

  const db = mongoose.connection;
  db.on('error', () => logger.error('Error trying to connect to mongo'));
  db.once('open', () => logger.info('Manager Service connected to the DB'))
}

function serverSetup(port) {
  const app = express();

  app.use(corsMiddleware);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  function logErrors(err, req, res, next) {
    logger.error(err);
    next(err);
  }
  app.use(logErrors);

  function errorHandler(err, req, res, next) {
    res.status(err.status).json({ error: err });
    next(err);
  }
  app.use(errorHandler);

  routes.registryRoutes(app);
  app.set('port', port);

  return app;
}

const port = process.env.PORT || 80;
const app = serverSetup(port);

serveMongo();

const server = http.createServer(app);

server.listen(port, () => {
  logger.info(`Manager Service is up on port: ${port}`);
});

module.exports = app;
