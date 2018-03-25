const query = require('../Query');
const ms = require('../message');
const Article = require('../models/article');

exports.createList = async (req, res) => {
  const articleInfo = {
    title: req.body.title,
    description: req.body.description
  };
  const article = await Article.create(articleInfo);
  if(article) {
    console.log('success')
    return res.status(200).json('성공적으로 업데이트가 되었습니다.').redirect('/article/lists');
  }
};