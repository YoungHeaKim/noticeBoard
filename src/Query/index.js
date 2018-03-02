const { ...AuthQuery } = require('./AuthQuery');
const { ...BoardQuery } = require('./BoardQuery');

module.exports = {
  ...AuthQuery,
  ...BoardQuery,
};