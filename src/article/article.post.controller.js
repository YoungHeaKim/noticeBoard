const query = require('../Query');
const ms = require('../message');
const Article = require('../models/article');
const jwt = require('jsonwebtoken');

exports.createList = async (req, res) => {
  const token = req.cookies.auth;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await query.checkUserBy_id(decoded.id);
  const articleInfo = {
    title: req.body.title,
    writer: user.username,
    description: req.body.description,
  };
  const articleCreate = await Article.create(articleInfo);
  if(articleCreate) {
    return res.status(200).redirect('/article/lists');
  }
};