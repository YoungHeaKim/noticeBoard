const timestamps = require('mongoose-timestamp');
const paginate = require('mongoose-paginate');
const Schema = require('mongoose').Schema;
const articleJson = require('./json/article.json');
const articleSchema = Schema(
  articleJson,
  {
    toObject: {virtuals: true}
});
const util = require('../util');

articleSchema.plugin(timestamps);
articleSchema.plugin(paginate);

// virtuals
articleSchema.virtual("createdDate")
  .get(function () {
    return util.getDate(this.createdAt);
  });

articleSchema.virtual("createdTime")
  .get(function () {
    return util.getTime(this.createdAt);
  });

articleSchema.virtual("updatedDate")
  .get(function () {
    return util.getDate(this.updatedAt);
  });

articleSchema.virtual("updatedTime")
  .get(function () {
    return util.getTime(this.updatedAt);
  });

module.exports = db.model('Article', articleSchema);