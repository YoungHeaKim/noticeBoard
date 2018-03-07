const express = require('express');
const query = require('../Query');
const ms = require('../message');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const router = express.Router();

exports.try = (req, res) => {
  // passport local signUp
  passport.use('signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  (req, email, password, name, done) => {
    if (email) {
      email = email.toLowerCase();
    }

    process.nextTick(() => {
      if (!req.user) {
        query.findByIdInLocal({ email })
          .then((err, user) => {
            if(err){
              return done(err);
            }

            if(user) {
              return done(null, false, req.flash('signupMessage', '이메일이 이미 등록되어 있습니다.'))
            } else {
              const newUser = query.findAllUser()
                .then()
              
              newUser.local.email = email;
              newUser.local.password = newUser.generateHash(password);
              newUser.local.name = name;

              newUser.save((err) => {
                if(err) {
                  return done(err);
                }

                return done(null, newUser);
              });
            }
          })
      } else if(!req.user.local.email) {
        query.findByIdInLocal({email}, (err, user) => {
          if(err) {
            return done(err);
          }

          if(user) {
            return done(null, false, req.flash('loginMessage', '이메일이 이미 등록되어 있습니다.'))
          } else {
            const user = req.user;
            
            user.local.email = email;
            user.local.password = user.generateHash(password);
            user.save((err) => {
              if(err) {
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
  router.get('/register', (req, res) => {
    res.render('register.ejs', { message: req.flash('signupMessage') });
  })

  router.post('/register', passport.authenticate('singup', {
    successRedirect: '/user/login',
    failureRedirect : '/user/register',
    failureRedirect: true
  }));
};