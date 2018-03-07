const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const paginate = require('mongoose-paginate');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const userJson = require('./json/user.json');
const userSchema = Schema(userJson);

// hash로 password 변환
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// local과 database에 있는 password 확인
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
}

userSchema.plugin(timestamps);
userSchema.plugin(paginate);

module.exports = mongoose.model('User', userSchema);