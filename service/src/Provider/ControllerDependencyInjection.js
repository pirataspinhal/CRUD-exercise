const CardControllerFactory = require('../Controller/CardController');
const { CardService } = require('./ProvidersDepencyInjection');

const CardController = CardControllerFactory(CardService);

module.exports = {
  CardController,
};
