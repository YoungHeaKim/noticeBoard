const mongoose = require('mongoose');
const ListSchema = require('./json/list.json');

const Schema = mongoose.Schema;

const listSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  list: ListSchema
})

module.exports = mongoose.model('list', listSchema);