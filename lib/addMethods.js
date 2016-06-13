// --------------------
// bluebird-extra
// function to add methods to a bluebird instance
// --------------------

// imports
var extensions = require('./extensions'),
	utils = require('./utils');

// exports

/**
 * Add extra methods to bluebird instance provided.
 * @param {Object} Promise - Bluebird instance
 * @returns {Object} - Bluebird instance
 */
var addMethods = function(Promise) {
    // get extension methods
	var methods = extensions(Promise);

	// add methods to Promise (e.g. Promise.series(arr))
	// add bound versions of methods to Promise.prototype (e.g. promise.series())
	utils.forIn(methods, function(fn, name) {
		Promise[name] = fn;

		Promise.prototype[name] = function() {
			var args = utils.argumentsToArray(arguments);

			return this.then(function(result) {
				args.unshift(result);
				return fn.apply(this, args);
			});
		};
	});

	// usePromise method
	Promise.usePromise = addMethods;

	// done
	return Promise;
};

module.exports = addMethods;
