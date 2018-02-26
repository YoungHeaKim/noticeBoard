require('dotenv').config();

const userRouter = require('./routes/userAuth');
const uploadRouter = require('./routes/listUpload');

const express = require('express');
const http = require('http');

const app = express();
const server = http.Server(app);

const PORT = process.env.PORT || 3000;

app.set('trust proxy');

app.use('/user', userRouter);
app.use('/posting', uploadRouter);

server.listen(PORT, () => {
  console.log(`Able to connect to ${PORT}`);
});

module.exports = server;