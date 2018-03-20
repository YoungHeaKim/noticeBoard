require('dotenv').config();

const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ms = require('../message');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const query = require('../Query/index');

// passport serialize
passport.serializeUser((user, done) => {
  console.log('serialize');
  console.log(user);
  done(null, user);
});

// passport deserialize
passport.deserializeUser((user, done) => {
  console.log('deserialize');
  console.log(user);
  done(null, user);
});

// local strategy
passport.use('sign-in', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  const checkUser = await User.findOne({ email: email });
  console.log(email, password, checkUser);
  (checkUser && bcrypt.compareSync(password, checkUser.password)) ? done(null, checkUser) : done(null, false);
}));

// 로그인시 쿠키 생성하는 부분
exports.cookie = (req, res) => {
  passport.authenticate('sign-in', (err, user) => {
    const token = jwt.sign({
      id: user._id,
      expiresIn: '10h'
    }, process.env.JWT_SECRET);
    let date = new Date();
    // 토큰 10시간 유지
    date.setTime(date.getTime() + (1000 * 60 * 60 * 10));

    if (!token) {
      return res.redirect('/user/login');
    }
    return res.cookie('auth', token, { expires: date }).redirect('/article/lists');
  })(req, res);
};

// log out 부분
exports.cookieRemove = (req, res) => {
  const date = new Date();
  // token에 빈 문자열을 넣어주면서 원래있던 토큰 삭제
  const token = "";
  return res.cookie('auth', token, { expires: date }).redirect('/user/login');
};