const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const flash = require('connect-flash');
const User = require('../models/user');
const util = require('../util');

const mw = require('../middleware');
const query = require('../Query');

const app = express();

const router = express.Router();

// middleware
router.use(mw.bodyParserJsonMiddleware);
router.use(mw.bodyParserUrlEncodedMiddleware);
router.use(mw.corsMiddleware);
router.use(mw.cookieSessionMiddleware);

// passport 초기화
router.use(passport.initialize());
router.use(passport.session());

// jwt발급
const oauthHandler = (req, res) => {
  const token = jwt.sign({
    id: req.user.id,
    expiresIn: '1d'
  }, process.env.SECRET);
  const origin = process.env.TARGET_ORIGIN;
  res.send(`<script>window.opener.postMessage('${token}', '${origin}')</script>`);
}
router.use(flash())

// passport serialize
passport.serializeUser(function (user, done) {
  console.log('SerializeUser');
  done(null, user.id);
});

// passport deserialize
passport.deserializeUser(function (id, done) {
  console.log('DeserializeUser');
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// passport local-login
passport.use('login', new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback: true
},
function(req, email, password, done) {
  if(email) {
    // 이메일을 작성시에 소문자만 사용하였는지 체크해주는 부분
    email = email.toLowerCase();
  }

  process.nextTick( function() {
    User.findOne({ 'email': email }, function(err, user) {
        if(err){
          return done(err);
        }

        if(!user) {
          return done(null, false, req.flash('loginMessage', '유저가 없습니다.'));
        }

        if (!user.validPassword(password)) {
          return done(null, false, req.flash('loginMessage', 'Password가 틀렸습니다.'));
        }

        else {         
          return done(null, user);
        }
      });
  });
}));

// 로그인
router.get('/login', util.isLoggedin, (req, res) => {
  res.render('login/login.ejs', {message: req.flash('loginMessage') });
}, oauthHandler);

router.post('/login', passport.authenticate('login', {
  successRedirect : '/article/lists',
  failureRedirect : '/user/login',
  failureFlash : true
}));

// passport local signUp
passport.use('signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
  function(req, email, password, done) {
    if (email) {
      email = email.toLowerCase();
    }

    process.nextTick(function() {
      if (!req.user) {
        User.findOne({ 'email': email }, function (err, user) {
            if (err) {
              return done(err);
            }

            if (user) {
              return done(null, false, req.flash('signupMessage', '이메일이 이미 등록되어 있습니다.'))
            } else {
              const newUser = new User();

              newUser.email = email;
              newUser.password = newUser.generateHash(password);
              newUser.username = req.body.username;

              newUser.save((err, result) => {
                if (err)
                  return done(err);

                return done(null, newUser);
              });
            }
          })
      } else if (!req.user.email) {
        User.findOne({ 'email': email }, function (err, user) {
              if (err) {
                return done(err);
              }

              if (user) {
                return done(null, false, req.flash('loginMessage', '이메일이 이미 등록되어 있습니다.'))
              } else {
                const user = req.user;

                user.email = email;
                user.password = user.generateHash(password);
                user.username = req.body.username;
                user.save(function(err) {
                  if (err) {
                    return done(err);
                  }

                  return done(null, user);
                });
          }
        });
      } else {
        return done(null, req.user);
      }
    });
  }));

// 회원가입
router.get('/register', function(req, res) {
  res.render('login/register.ejs', { message: req.flash('signupMessage') });
}, oauthHandler)

router.post('/register', passport.authenticate('signup', {
  successRedirect: '/user/login',
  failureRedirect: '/user/register',
  failureFlash: true
}));

// router.post('/register', register.try);

router.post('/login');

module.exports = router;