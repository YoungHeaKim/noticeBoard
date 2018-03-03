const User = require('../models/user');

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    console.log('SerializeUser');
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    console.log('DeserializeUser');    
    User.findById(id, function (err, user) {
      done(err, user);
    })
  });
}