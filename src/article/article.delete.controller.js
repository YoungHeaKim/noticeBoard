const query = require('../Query');
const ms = require('../message');
const Article = require('../models/article');

exports.delete = (req, res) => {
  Article.remove({_id: req.params.article_id}, (err) => {
    if(err) {
      return res.status(500).json({ error: "데이터베이스 연결상에 문제가 있습니다."});
    }

    res.status(204).redirect('/lists');
  }) 
};