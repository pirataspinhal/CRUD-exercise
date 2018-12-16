const config = {};

config.log = {
  level: 'trace',
};

config.mongo = {
  serverUri: 'mongodb://manager-database/serverDB',
  options: { useNewUrlParser: true },
};

module.exports = config;
