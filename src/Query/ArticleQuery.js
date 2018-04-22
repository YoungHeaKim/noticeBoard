const Article = require('../models/article');

module.exports = {
  findAllArticle(data) {
    return Article.find(data)
  },
  createArticle(data) {
    return Article.create({
      title: data.title,
      writer: data.writer,
      description: data.description
    })
  },
  findArticleById(data) {
    return Article.findById(data)
  }
};