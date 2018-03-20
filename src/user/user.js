const express = require('express');
const path = require('path');
const passport = require('passport');

const register = require('./user.register.controller');
const cookie = require('./user.cookie.controller');

const router = express.Router();

// 로그인부분
router.get('/login', (req, res) => {
  res.render(path.join(__dirname, '../../views/login/login.ejs'));
});

// 회원가입부분
router.get('/register', (req, res) => {
  res.render(path.join(__dirname, '../../views/login/register.ejs'));
});

// user 수정하는 페이지
router.get('/edit', (req, res) => {
  res.render(path.join(__dirname, '../../views/login/edit.ejs'));
})

// 쿠키 발행 부분
router.post('/cookie', cookie.cookie);

// 로그아웃
router.get('/logout', cookie.cookieRemove);

// 회원가입
router.post('/register', register.signUp);

// 수정하는 부분
router.put('/edit', register.edit);

module.exports = router;