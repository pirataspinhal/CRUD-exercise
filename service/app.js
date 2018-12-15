const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const routes = require('./src/Routes');
const logger = require('./src/Utils/Logger');

function serverSetup(port) {
  const app = express();
  routes.registryRoutes(app);
  app.set('port', port);

  return app;
}

const port = process.env.PORT || 80;
const app = serverSetup(port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const server = http.createServer(app);

server.listen(port, () => {
  logger.info(`Manager Service is up on port: ${port}`);
});

module.exports = app;
