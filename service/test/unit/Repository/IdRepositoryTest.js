const sinon = require('sinon');
const Hashids = require('hashids');
const { expect } = require('chai');
const CardFixtures = require('../../fixtures/CardFixtures');

const IdRepositoryFactory = require('../../../src/Repository/IdRepository');
const CommunicationError = require('../../../src/Error/CommunicationError');


suite('CardRepository', () => {
    /** @var {IdRepository} */
    let idRepository;
    let idModelMock;
    let hashids;
    beforeEach(() => {
        hashids = new Hashids();
        idModelMock  = {
            findOneAndUpdate: sinon.stub(),
        };
        idRepository = IdRepositoryFactory(idModelMock);
    });

    afterEach(() => {
        sinon.restore();
    })

    suite('getId', () => {
        const {
            cardWithIdInteger,
            cardWithIdAsString,
            requestBodyWithoutId
        } = CardFixtures;
        test('if passing the id type and data with id, return id as string', (done) => {
            const typeMock = 'card';
            idRepository.getId(typeMock, cardWithIdInteger)
                .then((newId) => {
                    expect(newId).to.equal(cardWithIdAsString.id);
                    done();
                });
        });
        test('if passing the id type and data without id, return new hashid as string', (done) => {
            const typeMock = 'card';
            const idDocMock = {
                lastId: 10,
            };
            const expectedId = hashids.encode(parseInt(idDocMock.lastId, 10))
            idModelMock.findOneAndUpdate
                .withArgs({ type: typeMock }, { $inc: { lastId: 1 } })
                .resolves(idDocMock);
            
            idRepository.getId(typeMock, requestBodyWithoutId)
                .then((newId) => {
                    expect(newId).to.equal(expectedId);
                    done();
                });
        });
        test('if some exception is thrown inside the function they fall into catch and'
            .concat(' throw a CommunicationError'), () => {
            const typeMock = 'card';
            const errorMock = new Error('Mama tells me im ok')
            idModelMock.findOneAndUpdate
                .throws(errorMock);
                

            idRepository.getId(typeMock, requestBodyWithoutId)
                .catch((error) => {
                    sinon.assert.calledOnce(idModelMock.findOneAndUpdate);
                    expect(error instanceof CommunicationError).to.equal(true);
                    expect(error.message).to.equal('Error trying to save card doc. Error: Error: Mama tells me im ok');
                    done();
                });
            })
    });
});
