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
  },
  updateTitleAndDescription(Id, data) {
    return Article.findByIdAndUpdate(Id, {
      title: data.title,
      description: data.description
    })
  },
  removeArticle(data) {
    return Article.remove(data)
  }
};