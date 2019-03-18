const sinon = require('sinon');
const { assert, expect } = require('chai');
const CardFixtures = require('../../fixtures/CardFixtures');

const CardRepositoryFactory = require('../../../src/Repository/CardRepository');
const CommunicationError = require('../../../src/Error/CommunicationError');

suite('CardRepository', () => {
    /** @var {CardRepository} */
    let cardRepository;
    let cardModelMock;
    beforeEach(() => {
        cardModelMock  = {
            create: sinon.stub(),
        };
        cardRepository = CardRepositoryFactory(cardModelMock);
    });

    afterEach(() => {
        sinon.restore();
    })

    suite('createCard', () => {
        const { defaultCard } = CardFixtures;
        test('if passing a cardInfo tries to insert and save on mongo', (done) => {
            const cardDocMock = {
                save: sinon.stub()
            }
            cardModelMock.create
                .withArgs(defaultCard)
                .returns(cardDocMock)
            
            cardDocMock.save
                .resolves(defaultCard)

            cardRepository.createCard(defaultCard)
                .then((response) => {
                    sinon.assert.calledOnce(cardModelMock.create);
                    sinon.assert.calledOnce(cardDocMock.save);
                    expect(response).to.eql(defaultCard);
                    done();
                });
        });
        test('if some exception is thrown inside the function they fall into catch and'
            .concat(' throw a CommunicationError'), () => {
            const cardDocMock = {
                save: sinon.stub()
            }
            cardModelMock.create
                .withArgs(defaultCard)
                .returns(cardDocMock)
                
            const errorMock = new Error('Mama tells me im ok')
            cardDocMock.save
                .throws(errorMock);
                
            assert.throws(
                () => cardRepository.createCard(defaultCard),
                CommunicationError,
                'Error trying to save card doc. Error: Error: Mama tells me im ok'
                );
            sinon.assert.calledOnce(cardModelMock.create);
            sinon.assert.calledOnce(cardDocMock.save);
            })
    });
});
