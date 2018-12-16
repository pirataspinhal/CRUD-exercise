const logger = require('../Utils/Logger');
/**
 * @typedef {Object} CardService
 * @property {function(cardInfo: Object): Promise<Object>} createCard
 */

/**
 *
 * @param {CardRepository} cardRepository
 * @param {IdRepository} idRepository
 * @returns {CardService}
 */
function CardService(cardRepository, idRepository) {
  return {
    /**
     * @param {CardObject} cardInfo
     * @returns {Promise<Object>}
     */
    async createCard(cardInfo) {
      logger.trace('Entered CardService::createCard', cardInfo);
      cardInfo.id = await idRepository.getId('card', cardInfo);
      return cardRepository.createCard(cardInfo)
        .then((savedDoc) => {
          logger.debug('CardService::createCard saved card');
          return savedDoc;
        });
    },
  };
}

module.exports = CardService;
