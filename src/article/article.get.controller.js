const query = require('../Query');
const ms = require('../message');
const Article = require('../models/article');
const path = require('path');

exports.mainPage = (req, res) => {
  console.log('메인페이지~~!!!')
  Article.find((err, articles) => {
    if (err) {
      console.log('메인페이지 에러')      
      return res.status(400).json("데이터베이스와 연결에 오류가 생겼습니다.");
    }
    console.log(articles);
    res.status(200).render((path.join(__dirname, '../../views/article/main.ejs')), {articles: articles});
  });
};

exports.article = async (req, res) => {
  console.log('게시글 페이지~!!');
  const articleList = await Article.find({_id: req.params.article_id})
  if(!articleList) {
    console.log('게시글부분 오류')
    res.status(400).json('게시글이 없습니다.')
  }
  console.log(articleList);
  res.status(200).render((path.join(__dirname, '../../views/article/show.ejs')), {articleList: articleList});
};