const query = require('../Query');
const ms = require('../message');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const router = express.Router();

exports.try = (req, res) => {
  // 회원가입
  passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, email, password, done) {
    User.findOne({ 'email': email }, function (err, user) {
      if (err) return done(null);
      if (user) return done(null, false, req.flash('signupMessage', '중복된 아이디입니다.'));

      const newUser = new User();

      newUser.email = email;
      newUser.password = newUser.generateHash(password);
      newUser.name = req.body.name;

      newUser.save(function (err) {
        if (err) throw err;
        return done(null, newUser);
      });
    })
  }));
};