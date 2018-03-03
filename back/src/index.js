import { Mongoose } from 'mongoose';

require('dotenv').config();

const userRouter = require('./router/userAuth');
const uploadRouter = require('./router/listUpload');

const express = require('express');
const http = require('http');

const app = express();
const server = http.Server(app);

const PORT = process.env.PORT || 3000;

app.set('trust proxy');

app.use('/user', userRouter);
app.use('/posting', uploadRouter);

Mongoose.connect(process.env.MONGO_URI, { useMongoClient: true })
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.log(e));

server.listen(PORT, () => {
  console.log(`Able to connect to ${PORT}`);
});

module.exports = server;