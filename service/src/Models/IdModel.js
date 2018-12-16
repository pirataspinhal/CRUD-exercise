/**
 * @typedef {Model} IdModel
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
function IdModel(mongoose) {
  const idSchema = mongoose.Schema({
    lastId: Number,
    type: String,
  }, {
    versionKey: false,
    timestamps: true,
  });

  return mongoose.model('ids', idSchema);
}

module.exports = IdModel;
