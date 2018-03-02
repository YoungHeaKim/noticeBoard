require('dotenv').config();

const PORT = process.env.PORT || 3000;

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const mw = require('./middleware');
const app = express();
const http = require('http');
const path = require('path');
const server = http.Server(app);
global.db = mongoose.createConnection(process.env.MONGO_URI);

// user 부분
const User = require('./user/user');
// 게시판 부분
const Article = require('./article/article');

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../uploads')));
app.use('/uploads', express.static('uploads'));

app.use('/user', User);

app.use('/article', Article);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));

server.listen(PORT, () => {
  console.log(`Able to connect to ${PORT}`);
});

module.exports = server;