const query = require('../Query');
const ms = require('../message');
const jwt = require('jsonwebtoken');

exports.createList = async (req, res) => {
  // 로그인되어 있는 유저의 정보를 가져오는 부분
  const token = req.cookies.auth;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await query.checkUserBy_id(decoded.id);
  const articleInfo = {
    title: req.body.title,
    writer: user._id,
    description: req.body.description,
  };
  const articleCreate = await query.createArticle(articleInfo);
  if(articleCreate) {
    return res.status(200).redirect('/article/lists');
  }
};