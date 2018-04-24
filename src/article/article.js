const express = require('express');
const multer = require('multer');
const uuid = require('uuid');
const path = require('path');

const posting = require('./article.post.controller');
const revising = require('./article.revise.controller');
const deleting = require('./article.delete.controller');
const getting = require('./article.get.controller');

const app = express();

const router = express.Router();

// 계시글 등록하는 부분
router.get('/new', (req, res) => {
  res.render(path.join(__dirname, '../../views/article/new.ejs'));
})

// 게시글 수정하는 페이지
router.get('/edit/:_id', getting.edit);

// main page에 모든 article을 불러오는 부분
router.get('/lists', getting.mainPage);

// 게시글 보기
router.get('/lists/:_id', getting.article);

// 새로운 리스트를 만드는 부분
router.post('/new', posting.createList);

// 수정한 게시글 update
router.post('/edit/:_id', revising.edit);
router.put('/edit/:_id', revising.edit);

// 게시글을 삭제하는 부분
router.post('/lists/:_id', deleting.delete);
router.delete('/lists/:_id', deleting.delete);

module.exports = router;