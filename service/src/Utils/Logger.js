const log4js = require('log4js');
const util = require('util');
const config = require('../../etc/config/serviceConfig');

log4js.configure({
  appenders: {
    default: {
      type: 'console',
      layout: { type: 'basic' },
    },
  },
  categories: {
    default: { appenders: ['default'], level: 'debug' },
    'manager-service': { appenders: ['default'], level: 'debug' },
  },
  replaceConsole: true,
});

const configuredLogs = log4js.getLogger('manager-service');

configuredLogs.level = config.log.level;

/**
 * @param {String} text
 * @param {Object} object
 * @returns {String}
 */
const mapTextAndObject = (text, object) =>
  (object !== undefined ? `${text} ${util.inspect(object, false, null)}` : text);

/**
 * @param {String} method
 * @returns {function(text: String, object: Object): String}
 */
const getLogText = method =>
  (text, object) => configuredLogs[method](mapTextAndObject(text, object));

const logger = {
  trace: getLogText('trace'),
  debug: getLogText('debug'),
  info: getLogText('info'),
  warn: getLogText('warn'),
  error: getLogText('error'),
  fatal: getLogText('fatal'),
};

module.exports = logger;
