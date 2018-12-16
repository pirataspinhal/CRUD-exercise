const logger = require('../Utils/Logger');
/**
 * @typedef {Object} CardController
 * @property {function(req: Request, res: Response)} createCardAction
 */

/**
 * @param {CardService} cardService
 * @returns {CardController}
 */
function CardController(cardService) {
  return {
    /**
     * @param {Request} req
     * @param {Response} res
     */
    createCardAction({ body }, res) {
      logger.trace('Entered CardController::createCardAction', body);
      try {
        return cardService.createCard(body)
          .then((cardInfo) => {
            logger.debug('CardController::createCardAction successfully created', { id: cardInfo.id });
            return res.status(200)
              .json({ message: 'Card created', responseObject: { cardId: cardInfo.id } });
          });
      } catch (error) {
        logger.error('CardController::createCardAction error', { message: error.message });
        return res.status(500)
          .json({ message: 'Error creating card', error: error.message });
      }
    },
  };
}

module.exports = CardController;
