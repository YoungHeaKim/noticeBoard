const User = require('../models/user');

module.exports = {
  checkIdExist(email) {
    return User.findOne({
      email: email
    });
  },
  checkUsernameExist(username) {
    return User.findOne({
      username: username
    });
  },
  createUser(data) {
    return User.create({
      email: data.email,
      password: data.password,
      username: data.username
    })
  },
  updatePasswordAndUsername(data) {
    return User.update({
      email: data.email
    }, {
      password: data.password,
      username: data.username
    })
  },
  checkUserBy_id(data) {
    return User.findById(data)
  }
};