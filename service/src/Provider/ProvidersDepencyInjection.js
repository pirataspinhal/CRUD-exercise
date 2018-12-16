const mongoose = require('mongoose');

const CardServiceFactory = require('../Service/CardService');
const CardRepositoryFactory = require('../Repository/CardRepository');
const IdRepositoryFactory = require('../Repository/IdRepository');

const ChatModel = require('../Models/CardModel')(mongoose);
const IdModel = require('../Models/IdModel')(mongoose);


const CardRepository = CardRepositoryFactory(ChatModel);
const IdRepository = IdRepositoryFactory(IdModel);

const CardService = CardServiceFactory(CardRepository, IdRepository);

module.exports = {
  CardService,
};
