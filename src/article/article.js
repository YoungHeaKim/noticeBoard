const express = require('express');
const multer = require('multer');
const uuid = require('uuid');

const posting = require('./article.post.controller');
const revising = require('./article.revise.controller');
const deleting = require('./article.delete.controller');
const getting = require('./article.get.controller');

const query = require('../Query');

const app = express();

const router = express.Router();

// main page에 모든 article을 불러오는 부분
router.get('/lists', getting.mainPage);

// 게시글 보기
router.get('/lists/:article_id', getting.article);

// 게시글 수정하는 페이지
router.get('/edit/:article_id', (req, res) => {
  res.render(path.join(__dirname, '../../views/article/edit.ejs'));
});

// 새로운 리스트를 만드는 부분
router.post('/new', posting.createList);

// 수정한 게시글 update
router.put('/edit/:article_id', revising.edit);

// 게시글을 삭제하는 부분
router.delete('/lists/:article_id', deleting.delete);

module.exports = router;