const config = require('../mongoosefile').development;

module.exports = require('mongoose')(config);