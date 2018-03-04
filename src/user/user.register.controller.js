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
    query.findUserByEmail({ email })
      .then( function (err, user) {
        if (err) {
          return done(null)
        };
        if (user) {
          return done(null, false, req.flash('signupMessage', '중복된 아이디입니다.'))
        }
 
        query.createUserByEmail({ email, password, name})
          .then(newUser => {
            newUser.email = req.body.email;
            newUser.password = newUser.generateHash(password);
            newUser.name = req.body.name;
          })
          .then(() => {
            res.redirect('/user/login');
          })

    })
  }));
};