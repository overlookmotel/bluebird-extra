// --------------------
// bluebird-extra
// --------------------

// modules
var bluebird = require('bluebird');

// imports
var extensions = require('./extensions');

// exports
var Promise = addMethods(bluebird);

Promise.usePromise = function(Promise) {
	return addMethods(Promise);
};

module.exports = Promise;

// function to add methods to bluebird Promise object
function addMethods(Promise) {
	// get extension methods to Promise
	var methods = extensions(Promise);
	
	// add methods to Promise (e.g. Promise.series(arr))
	// add bound versions of methods to Promise.prototype (e.g. promise.series())
	for (var name in methods) {
		(function() {
			var fn = methods[name];
		
			Promise[name] = fn;
		
			Promise.prototype[name] = function() {
				var args = Array.prototype.slice.call(arguments);

				return this.then(function(result) {
					args.unshift(result);
					return fn.apply(this, args);
				});
			};
		})();
	}
	
	// done
	return Promise;
}
