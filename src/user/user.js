const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const flash = require('connect-flash');

// 컨트롤러를 통해서 실행해
const register = require('./user.register.controller');
const mw = require('../middleware');
const query = require('../Query');

const app = express();

const router = express.Router();

// middleware
router.use(mw.bodyParserJsonMiddleware);
router.use(mw.bodyParserUrlEncodedMiddleware);
router.use(mw.corsMiddleware);
router.use(mw.cookieSessionMiddleware);
// router.use(mw.csrfMiddleware);
// router.use(mw.insertToken);

// jwt발급
const oauthHandler = (req, res) => {
  const token = jwt.sign({
    id: req.user.id,
    expiresIn: '1d'
  }, process.env.SECRET);
  const origin = process.env.TARGET_ORIGIN;
  res.send(`<script>window.opener.postMessage('${token}', '${origin}')</script>`);
}

// passport 초기화
router.use(passport.initialize());
router.use(passport.session());
router.use(flash())

// passport serialize
passport.serializeUser(function (user, done) {
  console.log('SerializeUser');
  done(null, user.id);
});

// passport deserialize
passport.deserializeUser(function (id, done) {
  console.log('DeserializeUser');
  query.findById({ id })
    .then(
      (err, user) => {
        done(err, user);
      });
});

// passport local-login
passport.use('login', new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback: true
},
(req, email, password, done) => {
  if(email) {
    // 이메일을 작성시에 소문자만 사용하였는지 체크해주는 부분
    email = email.toLowerCase();
  }

  process.nextTick( () => {
    query.findByIdInLocal({ email })
      .then((err, user) => {
        if(err){
          return done(err);
        }

        if(!user) {
          return done(null, false, req.flash('loginMessage', '유저가 없습니다.'));
        }

        if(!user.validPasswoord(password)) {
          return done(null, false, req.flash('loginMessage', 'Password가 틀렸습니다.'));
        }

        else {
          return done(null, user);
        }
      });
  });
}));

// 로그인
router.get('/login', (req, res) => {
  res.render('login.ejs', {message: req.flash('loginMessage') });
});

router.post('/login', passport.authenticate('login', {
  successRedirect : '/article/lists',
  failureRedirect : '/user/login',
  failureFlash : true
}));

router.post('/register', register.try);

router.post('/login');

module.exports = router;