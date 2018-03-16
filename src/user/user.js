require('dotenv').config();

const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const flash = require('connect-flash');
const User = require('../models/user');
const util = require('../util');

const query = require('../Query');

const app = express();

const router = express.Router();

router.use(flash())

// passport 초기화
app.use(passport.initialize());
app.use(passport.session());

// passport serialize
passport.serializeUser((user, done) => { done(null, user.id); });

// passport deserialize
passport.deserializeUser((id, done) => {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// local strategy
passport.use('singin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  const checkUser = User.findOne({ email: email });
  (checkUser && bcrypt.compareSync(password, checkUser.password)) ? done(null, checkUser) : done(null, false);
}));

// 로그인부분
router.get('/login', (req, res) => {
  res.render('login/login.ejs');
});

// 쿠키 발행 부분
router.post('/cookie', (res, req) => {
  passport.authenticate('singin', (err, user) => {
    const token = jwt.sign({
      id: user._id,
      expiresIn: '1d'
    }, process.env.JWT_SECRET);
    let date = new Date();
    // 토큰 하루 유지
    date.setTime(date.getTime() + 1000 * 60 * 60 * 24);

    if(!token) {
      return res.redirect('/user/login');
    }

    return res.cookie('auth', token, { expires: date })
      .redirect('/article/lists');
  })(req, res);
})

// 로그아웃
router.get('/logout', (req, res) => {
  const date = new Date();
  // token에 빈 문자열을 넣어주면서 원래있던 토큰 삭제
  const token = "";
  return res.cookie('auth', token, {expires: date})
    .redirect('/user/login');
})

// 회원가입
router.post('/user/register', (req, res) => {
  if(!req.body.email){
    return res.status(400).json('이메일을 입력해주세요')
  } else if(!req.body.password) {
    return res.status(400).json('비밀번호를 입력해주세요')    
  } else if(!req.body.username) {
    return res.status(400).json('유저을 입력해주세요')    
  }
  // 입력한 정보를 userInfo에 저장하는 부분
  const userInfo = {
    email = req.body.email,
    // bcrypt를 사용하여 hash로 들어오는 비밀번호 변환
    password = bcrypt.hashSync(req.body.password, 10),    
    username = req.body.username
  };
  // 이메일이 하나만 있는지 확인하는 부분
  const checkUser = User.findOne({email: userInfo.email});
  if (checkUser !== null) {
    return res.status(400).json('아이디가 이미 존재합니다.')
  }

  // 확인이 완료된 userInfo를 데이터베이스에 생성하는 부분
  const createUser = User.create({
    email = userInfo.email,
    password = userInfo.password,
    username = userInfo.username
  })
  if (createUser) {
    return res.status(200).json('성공')
  }
})

// 수정하는 부분

module.exports = router;