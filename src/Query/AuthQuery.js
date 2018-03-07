const User = require('../models/user');

module.exports = {
  findById({ id }) {
    return User.findById(id)
  },
  findByIdInLocal({ email }) {
    return User.findOne()
      .where({'provide' : 'local', email})
  },
  findAllUser() {
    return User.find()
  }
};