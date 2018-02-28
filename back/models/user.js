const mongoose = require('mongoose');
const UserSchema = require('./json/user.json');

const Schema = mongoose.Schema;

const userSchema = new Schema ({
  id: mongoose.Schema.Types.ObjectId,
  user: UserSchema
})

module.exports = mongoose.model('user', userSchema);