const query = require('../Query');
const ms = require('../message');

exports.edit = async (req, res) => {
  const article = await query.findArticleById(req.params._id);
  if(!article) {
    return res.status(400).json('찾으시는 글이 없습니다.')
  }

  const articleEdit = {
    title: req.body.title,
    description: req.body.description
  }

  const updateArticle = await query.updateTitleAndDescription(article._id, articleEdit);

  if(updateArticle) {
    return res.status(200).json('성공')
  }
};