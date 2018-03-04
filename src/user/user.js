const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// 컨트롤러를 통해서 실행해
const register = require('./user.register.controller');
const mw = require('../middleware');
const query = require('../Query');

const app = express();
require('./passport')(passport);

const router = express.Router();

// middleware
router.use(mw.bodyParserJsonMiddleware);
router.use(mw.bodyParserUrlEncodedMiddleware);
router.use(mw.corsMiddleware);
router.use(mw.cookieSessionMiddleware);
router.use(mw.csrfMiddleware);
router.use(mw.insertToken);

// passport 초기화
router.use(passport.initialize());
router.use(passport.session());

// 로그인 
passport.use('signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, email, password, done) {
  query.findUserByEmail({ email })
    .then( function (err, user) {
      if (err) return done(err);
      if (!user) return done(null, false, req.flash('signinMessage', '아이디가 존재하지 않습니다.'));
      if (!user.validPassword(password)) return done(null, false, req.flash('signinMessage', '비밀번호가 올바르지 않습니다'));
      return done(null, user);
        });
}));

router.post('/register', register.try);

router.post('/login');

module.exports = router;