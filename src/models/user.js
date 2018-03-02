const timestamps = require('mongoose-timestamp');
const paginate = require('mongoose-paginate');
const bcrypt = require('bcrypt-nodejs');
const Schema = require('mongoose').Schema;
const userJson = require('./json/user.json');
const userSchema = Schema(userJson);

userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
}

userSchema.plugin(timestamps);
userSchema.plugin(paginate);

module.exports = db.model('User', userSchema);