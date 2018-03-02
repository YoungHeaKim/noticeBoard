const timestamps = require('mongoose-timestamp');
const paginate = require('mongoose-paginate');
const Schema = require('mongoose').Schema;
const articleJson = require('./json/article.json');
const articleSchema = Schema(articleJson);

articleSchema.plugin(timestamps);
articleSchema.plugin(paginate);

module.exports = db.model('Article', articleSchema);