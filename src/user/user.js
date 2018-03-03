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

router.post('/register', register.try);

router.post('/login');

module.exports = router;