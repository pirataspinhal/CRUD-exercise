/**
 * @typedef {Model} CardModel
 * @property {function(card: Object): CardModel} create
 */

/**
 * @typedef {Object} CardObject
 * @property {String} [id]
 * @property {String} name
 * @property {String} imageUrl
 * @property {String} cardType
 * @property {String} type
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @param {Mongoose} mongoose
 */
function CardModel(mongoose) {
  const cardSchema = mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    cardType: { type: String, default: '' },
    type: { type: String, default: '' },
  }, {
    versionKey: false,
    timestamps: true,
  });

  cardSchema.statics.create = function create(card) {
    return new this(card);
  };

  return mongoose.model('cards', cardSchema);
}

module.exports = CardModel;
