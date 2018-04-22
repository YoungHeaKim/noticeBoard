const query = require('../Query');
const ms = require('../message');
const Article = require('../models/article');
const path = require('path');
const jwt = require('jsonwebtoken');

exports.mainPage = async(req, res) => {
  // 1. 모든 등록되어있는 글을 가져옴
  const articleList = await query.findAllArticle();
  // 2. writer에 등록되어 있는 유저id를 통해 유저이름을 찾아서 writer에 넣어줌
  // 이부분 오류 발생(메인페이지에서 배열에 첫번째에서만 user를 찾음)
  const article = articleList.find((article) => {
    console.log(article.writer);
    return article.writer;
  });
  const writerId = article.writer;
  const user = await query.findUserById(writerId);
  const username = user.username;
  console.log(articleList);
  console.log(writerId);
  // 위에서 불러온 정보를 화면에 뿌려준다.
  res.status(200).render((path.join(__dirname, '../../views/article/main.ejs')), {articleList: articleList, username: username});
};

exports.article = async (req, res) => {
  // 현재 로그인이 되어있는 token을 가져오는 부분
  const token = req.cookies.auth;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await query.checkUserBy_id(decoded.id);

  // 원하는 글의 정보를 불러오는 부분
  const articleList = await query.findArticleById(req.params._id);
  // 해당게시글에 username을 가져오는 부분
  const writerId = articleList.writer;
  const userId = await query.findUserById(writerId);
  const username = userId.username;
  console.log(user._id)
  console.log(articleList.writer)  
  if(!articleList) {
    console.log('게시글부분 오류')
    res.status(400).json('게시글이 없습니다.')
  }
  res.status(200).render((path.join(__dirname, '../../views/article/show.ejs')), { articleList: articleList, user: user, username: username});
};