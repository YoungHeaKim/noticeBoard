const cors = require('cors');
const bodyParser = require('body-parser');
const csurf = require('csurf');
const cookieSession = require('cookie-session');
const expressJwt = require('express-jwt');

// 미들웨어
const corsMiddleware = cors({
  origin: process.env.TARGET_ORIGIN
});

const bodyParserJsonMiddleware = bodyParser.json();

const bodyParserUrlEncodedMiddleware = bodyParser.urlencoded({ extended: false });

const jwtMiddleware = expressJwt({
  secret: process.env.SECRET
});

const cookieSessionMiddleware = cookieSession({
  name: 'test-board',
  keys: [
    process.env.SESSION_SECRET
  ],
  cookie: {
    maxAge: 1000 * 60 * 60 * 8
  }
});

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
  res.redirect('/user/login');
};

const localAuthenticated = function (req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
};

module.exports = {
  // 미들웨어 리스트
  jwtMiddleware,
  corsMiddleware,
  bodyParserJsonMiddleware,
  bodyParserUrlEncodedMiddleware,
  cookieSessionMiddleware,
  checkAuthenticated,
  localAuthenticated
};
