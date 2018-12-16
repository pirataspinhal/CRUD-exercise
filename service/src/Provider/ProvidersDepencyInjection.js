const mongoose = require('mongoose');

const CardServiceFactory = require('../Service/CardService');
const CardRepositoryFactory = require('../Repository/CardRepository');
const ChatModel = require('../Models/CardModel')(mongoose);

const CardRepository = CardRepositoryFactory(ChatModel);
const CardService = CardServiceFactory(CardRepository);

module.exports = {
  CardService,
};
