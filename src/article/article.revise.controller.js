const query = require('../Query');
const ms = require('../message');
const Article = require('../models/article');

exports.edit = async (req, res) => {
  const article = await Article.findById(req.params.article_id);
  if(!article) {
    return res.status(400).json('찾으시는 글이 없습니다.')
  }

  const articleEdit = {
    title: req.body.title,
    description: req.body.description
  }

  const updateArticle = await Article.update({
    title: articleEdit.title,
    description: articleEdit.description
  })

  if(updateArticle) {
    return res.status(200).json('성공')
  }
};