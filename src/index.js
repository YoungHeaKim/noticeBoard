require('dotenv').config();

const PORT = process.env.PORT || 3000;

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const server = http.Server(app);
global.db = mongoose.createConnection(process.env.MONGO_URI);

// user 부분
const User = require('./user/user');
// 게시판 부분
const Article = require('./article/article');
// cookie체크부분
const checker = require('./user/user.access.controller');

// ejs 템플릿
app.set('view engine', 'ejs');

// express application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// 로그인정보를 뷰에서만 변수로 셋팅
app.use((req, res, next) => {
  app.locals.isLogin = req.isAuthenticated();
  app.locals.userData = req.user;  
  next()
})

app.use('/user', User);
app.use('/article', checker.accessChecker, Article);
// 기본페이지를 리스트페이지로 변환
app.use('/', (req, res) => {
  return res.redirect('/article/lists');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));

server.listen(PORT, () => {
  console.log(`Able to connect to ${PORT}`);
});

module.exports = server;