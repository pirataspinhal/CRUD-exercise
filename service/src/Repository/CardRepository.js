const logger = require('../Utils/Logger');
const CommunicationError = require('../Error/CommunicationError');

/**
 * @typedef {Object} CardRepository
 * @property {function(cardInfo: Object): Promise<Object>} createCard
 */

/**
 * @param {CardModel} cardModel
 * @constructor
 */
function CardRepository(cardModel) {
  return {
    /**
     * @param {Object} cardInfo
     * @returns {Promise<Object>}
     */
    createCard(cardInfo) {
      logger.trace('Entered CardRepository::createCard', cardInfo);
      try {
        const cardDoc = cardModel.create(cardInfo);
        return cardDoc.save()
          .then((savedDoc) => {
            logger.debug('CardRepository::createCard saved successfully');
            return savedDoc;
          });
      } catch (error) {
        logger.error('CardRepository::createCard error trying to save card doc.', error);
        throw new CommunicationError(`Error trying to save card doc. Error: ${error}`);
      }
    },
  };
}

module.exports = CardRepository;
