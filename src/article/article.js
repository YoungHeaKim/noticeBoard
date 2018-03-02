const express = require('express');
const multer = require('multer');
const uuid = require('uuid');

const posting = require('./article.post.controller');
const revising = require('./article.revise.controller');
const deleting = require('./article.delete.controller');
const getting = require('./article.get.controller');

const mw = require('../middleware');
const query = require('../Query');

const app = express();

const router = express.Router();

// middleware


router.post('/:uid', upload.single('image'), posting.try);

router.put('/:article_id', upload.single('image'), revising.try);

router.delete('/:article_id', deleting.try);

router.get('/:uid', getting.try);

module.exports = router;