// --------------------
// bluebird-extra
// --------------------

// modules
var Promise = require('bluebird');

// imports
var addMethods = require('./addMethods');

// exports
module.exports = addMethods(Promise);
