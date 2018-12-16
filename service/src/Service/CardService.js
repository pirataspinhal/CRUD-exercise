const logger = require('../Utils/Logger');
/**
 * @typedef {Object} CardService
 * @property {function(cardInfo: Object): Promise<Object>} createCard
 */

/**
 *
 * @param {CardRepository} cardRepository
 * @returns {CardService}
 */
function CardService(cardRepository) {
  return {
    /**
     * @param {Object} cardInfo
     * @returns {Promise<Object>}
     */
    createCard(cardInfo) {
      logger.trace('Entered CardService::createCard', cardInfo);
      return cardRepository.createCard(cardInfo)
        .then((savedDoc) => {
          logger.debug('CardService::createCard saved card');
          return savedDoc;
        });
    },
  };
}

module.exports = CardService;
