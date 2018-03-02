const express = require('express');

// 컨트롤러를 통해서 실행해
const register = require('./user.register.controller');
const mw = require('../middleware');
const query = require('../Query');

const app = express();

const router = express.Router();

// middleware

// passport

// Passport Serializer

// Passport Deserializser


// Local Strategy

router.post('/register', register.try);

router.post('/login');

module.exports = router;