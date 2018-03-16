const cors = require('cors');
const csurf = require('csurf');
const expressJwt = require('express-jwt');

// 미들웨어
const corsMiddleware = cors({
  origin: process.env.TARGET_ORIGIN
});

const jwtMiddleware = expressJwt({
  secret: process.env.SECRET
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
  checkAuthenticated,
  localAuthenticated
};
