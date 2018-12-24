const sinon = require('sinon');
const { expect } = require('chai');

const CardServiceFactory = require('../../../src/Service/CardService');
const CardRepositoryFactory = require('../../../src/Repository/CardRepository');
const IdRepositoryFactory = require('../../../src/Repository/IdRepository');

const CardFixtures = require('../../fixtures/CardFixtures');


suite('CardService', () => {
  /** @var {CardService}  */
  let cardService;
  let cardRepository;
  let idRepository;
  beforeEach(() => {
    cardRepository = CardRepositoryFactory();
    idRepository = IdRepositoryFactory();
    cardService = CardServiceFactory(cardRepository, idRepository);
  });

  afterEach(() => {
    sinon.restore();
  });
  suite('createCard', () => {
    const { defaultRequestBody, defaultCard } = CardFixtures;
    test('if receiving body with id create card', (done) => {
      const getIdStub = sinon.stub(idRepository, 'getId');
      const createCardStub = sinon.stub(cardRepository, 'createCard');

      getIdStub
        .withArgs('card', defaultRequestBody)
        .resolves(defaultRequestBody.id);

      createCardStub
        .withArgs(defaultRequestBody)
        .resolves(defaultCard);

      cardService.createCard(defaultRequestBody)
        .then((savedDoc) => {
          expect(savedDoc).to.eql(defaultCard);
          sinon.assert.calledOnce(getIdStub);
          sinon.assert.calledOnce(createCardStub);
          done();
        });

    });
  });
});
