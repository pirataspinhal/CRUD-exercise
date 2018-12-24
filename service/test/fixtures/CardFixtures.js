const CardFixtures = {};

CardFixtures.defaultRequestBody = {
  id: 'j1oi3j2oi1j2',
  name: 'TRUCO LADRÂO',
  imageUrl: 'imagem.de.teste.com',
  cardType: 'Monster',
  type: 'Neutral',
  lore: 'Monstro criado a partir de uma partida de truco muito louca entre uma galera no bar',
  properties: ['Rare', 'Special'],
};

CardFixtures.requestBodyWithoutId = {
  name: 'TRUCO LADRÂO',
  imageUrl: 'imagem.de.teste.com',
  cardType: 'Monster',
  type: 'Neutral',
  lore: 'Monstro criado a partir de uma partida de truco muito louca entre uma galera no bar',
  properties: ['Rare', 'Special'],
};

CardFixtures.defaultCard = {
  createdAt: new Date('2018-10-10'),
  updatedAt: new Date('2018-10-10'),
  id: 'j1oi3j2oi1j2',
  name: 'TRUCO LADRÂO',
  imageUrl: 'imagem.de.teste.com',
  cardType: 'Monster',
  type: 'Neutral',
  lore: 'Monstro criado a partir de uma partida de truco muito louca entre uma galera no bar',
  properties: ['Rare', 'Special'],
};

CardFixtures.emptyCard = {
  createdAt: new Date('2018-10-10'),
  updatedAt: new Date('2018-10-10'),
  id: 'j1oi3j2oi1j2',
  name: '',
  imageUrl: '',
  cardType: '',
  type: '',
  lore: '',
  properties: [],
};

module.exports = CardFixtures;
