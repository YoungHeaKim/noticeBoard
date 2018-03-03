const LocalStrategy = require('passport-local').Strategy;
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

  // 로그인 
  passport.use('signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, email, password, done) {
    User.findOne({ 'email': email }, function (err, user) {
      if (err) return done(err);
      if (!user) return done(null, false, req.flash('signinMessage', '아이디가 존재하지 않습니다.'));
      if (!user.validPassword(password)) return done(null, false, req.flash('signinMessage', '비밀번호가 올바르지 않습니다'));
      return done(null, user); 
    });
  }));
}