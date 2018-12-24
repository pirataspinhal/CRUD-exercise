const httpMock = require('node-mocks-http');
const sinon = require('sinon');
const { expect } = require('chai');
const { EventEmitter } = require('events');
const CardControllerFactory = require('../../../src/Controller/CardController');
const CardServiceFactory = require('../../../src/Service/CardService');
const CardFixtures = require('../../fixtures/CardFixtures');


suite('CardController', () => {
  /** @var {CardService} cardService */
  let cardService;
  /** @var {CardController} cardController */
  let cardController;
  beforeEach(() => {
    cardService = CardServiceFactory();
    cardController = CardControllerFactory(cardService);
  });
  afterEach(() => {
    sinon.restore();
  });
  suite('createCardAction', () => {
    const { defaultCard } = CardFixtures;
    test('if passing full body works correctly', (done) => {
      const { defaultRequestBody } = CardFixtures;
      const request = httpMock.createRequest({
        method: 'POST',
        url: '/cards',
        body: defaultRequestBody,
      });
      const response = httpMock.createResponse({ eventEmitter: EventEmitter });

      const createCardStub = sinon.stub(cardService, 'createCard');
      createCardStub
        .withArgs(defaultRequestBody)
        .resolves(defaultCard);

      cardController.createCardAction(request, response);

      response.on('end', () => {
        expect(response.statusCode).to.equal(200);
        const responseBody = { message: 'Card created', responseObject: { cardId: defaultCard.id } };
        expect(JSON.parse(response._getData())).to.eql(responseBody);
        sinon.assert.calledOnce(createCardStub);
        done();
      });
    });
    test('if passing body without id works correctly', (done) => {
      const { requestBodyWithoutId } = CardFixtures;
      const request = httpMock.createRequest({
        method: 'POST',
        url: '/cards',
        body: requestBodyWithoutId,
      });
      const response = httpMock.createResponse({ eventEmitter: EventEmitter });

      const createCardStub = sinon.stub(cardService, 'createCard');
      createCardStub
        .withArgs(requestBodyWithoutId)
        .resolves(defaultCard);

      cardController.createCardAction(request, response);

      response.on('end', () => {
        expect(response.statusCode).to.equal(200);
        const responseBody = { message: 'Card created', responseObject: { cardId: defaultCard.id } };
        expect(JSON.parse(response._getData())).to.eql(responseBody);
        sinon.assert.calledOnce(createCardStub);
        done();
      });
    });
    test('if passing empty body works correctly', (done) => {
      const { emptyCard } = CardFixtures;
      const request = httpMock.createRequest({
        method: 'POST',
        url: '/cards',
        body: {},
      });
      const response = httpMock.createResponse({ eventEmitter: EventEmitter });

      const createCardStub = sinon.stub(cardService, 'createCard');
      createCardStub
        .withArgs({})
        .resolves(emptyCard);

      cardController.createCardAction(request, response);

      response.on('end', () => {
        expect(response.statusCode).to.equal(200);
        const responseBody = { message: 'Card created', responseObject: { cardId: emptyCard.id } };
        expect(JSON.parse(response._getData())).to.eql(responseBody);
        sinon.assert.calledOnce(createCardStub);
        done();
      });
    });
    test('if throwing an error is caught correctly', (done) => {
      const error = new Error('Error trying to save card');
      const request = httpMock.createRequest({
        method: 'POST',
        url: '/cards',
        body: {},
      });
      const response = httpMock.createResponse({ eventEmitter: EventEmitter });

      const createCardStub = sinon.stub(cardService, 'createCard');
      createCardStub
        .withArgs({})
        .rejects(error);

      cardController.createCardAction(request, response);

      response.on('end', () => {
        expect(response.statusCode).to.equal(500);
        const responseBody = { message: 'Error creating card', error: error.message };
        expect(JSON.parse(response._getData())).to.eql(responseBody);
        sinon.assert.calledOnce(createCardStub);
        done();
      });
    });
  });
});
