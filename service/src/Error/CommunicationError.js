/**
 * @typedef {Error} CommunicationError
 */

module.exports = class CommunicationError extends Error {
  /**
   * @param {String} message
   * @param {Object} additionalInfo
   */
  constructor(message, additionalInfo) {
    super(message);

    this.name = this.constructor.name;
    this.additionalInfo = additionalInfo || {};

    Error.captureStackTrace(this, this.constructor);
  }
};
