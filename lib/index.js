// --------------------
// bluebird-extra
// --------------------

// load new instance of bluebird
var Promise = require('bluebird/js/release/promise')();

// imports
var addMethods = require('./addMethods');

// exports
module.exports = addMethods(Promise);
