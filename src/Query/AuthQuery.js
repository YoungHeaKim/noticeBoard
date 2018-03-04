const User = require('../models/user');

module.exports = {
  findUserByEmail({ email }) {
    return User.findOne({ 'email': email })
  },
  createUserByEmail({email, password, name}) {
    return User
      .insert({
        "email" : email,
        "password" : password,
        "name" : name,
      })
      .save(function (err) {
        if (err) throw err;
        return done(null, User);
      })
    }
};