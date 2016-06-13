// --------------------
// bluebird-extra
// Extension methods
// --------------------

// imports
var utils = require('./utils'),
	keysOwn = utils.keysOwn,
	keysIn = utils.keysIn;

// exports

/**
 * Return methods to be added to bluebird
 * @param {Object} Promise - Bluebird instance
 * @returns {Object} - Object of extra methods
 */
module.exports = function(Promise) {
	// create extra promise methods
	var methods = {
		// like bluebird.each() but run in parallel
		eachParallel: function(arr, iterator) {
			return Promise.map.call(this, arr, function(item, index, value) {
				return iterator.call(this, item, index, value);
			}.bind(this)).return(arr);
		},

		// like bluebird.map() but run in series
		mapSeries: function(arr, iterator) {
			if (typeof iterator !== 'function') return apiRejection('iterator must be a function');

			return mapSeries.call(this, arr, iterator);
		},

		// methods for mapping objects
		// (`in` variations for all properties including inherited, `own` variations for just object's own properties)

		mapIn: function(obj, iterator) {
			return mapObjectParallel.call(this, obj, iterator, keysIn);
		},

		mapInSeries: function(obj, iterator) {
			return mapObjectSeries.call(this, obj, iterator, keysIn);
		},

		mapOwn: function(obj, iterator) {
			return mapObjectParallel.call(this, obj, iterator, keysOwn);
		},

		mapOwnSeries: function(obj, iterator) {
			return mapObjectSeries.call(this, obj, iterator, keysOwn);
		},

		// methods for looping through objects' properties
		// (`in` variations for all properties including inherited, `own` variations for just object's own properties)
		in: function(obj, iterator) {
			return methods.mapIn.call(this, obj, iterator).return(obj);
		},

		inSeries: function(obj, iterator) {
			return methods.mapInSeries.call(this, obj, iterator).return(obj);
		},

		own: function(obj, iterator) {
			return methods.mapOwn.call(this, obj, iterator).return(obj);
		},

		ownSeries: function(obj, iterator) {
			return methods.mapOwnSeries.call(this, obj, iterator).return(obj);
		},

		// run iterator on each item in array in series
		// return first result from iterator that is not undefined
		eachAny: function(arr, iterator) {
			if (typeof iterator !== 'function') return apiRejection('iterator must be a function');

			var self = this;
			var i = 0;
			return Promise.resolve().then(function iterate() {
				if (i == arr.length) return;

				return Promise.resolve(iterator.call(self, arr[i]))
				.then(function(result) {
					if (result !== undefined) return result;

					i++;
					return iterate();
				});
			});
		},

		// if value is truthy, run ifFn, otherwise run elseFn
		// returns value for whichever function is run
		ifElse: function(value, ifFn, elseFn) {
			if ((ifFn && typeof ifFn !== 'function') || (elseFn && typeof elseFn !== 'function')) return apiRejection('ifFn and elseFn must be functions');

			var fn = value ? ifFn : elseFn;
			if (!fn) return Promise.resolve(value);

			return Promise.resolve(fn.call(this, value));
		}
	};

	// aliases
	methods.eachSeries = Promise.each;
	methods.forEach = Promise.each;
	methods.forIn = methods.inSeries;
	methods.forOwn = methods.ownSeries;
	methods.mapObject = methods.mapOwn;
	methods.mapValues = methods.mapOwn;
	methods.mapObjectSeries = methods.mapOwnSeries;
	methods.mapValuesSeries = methods.mapOwnSeries;

	// return methods
	return methods;

	// -----------------
	// support functions
	// -----------------

	function mapSeries(arr, iterator) {
		var self = this,
			length = arr.length,
			index = 0;

		return Promise.reduce(arr, function(values, item) {
		    return Promise.resolve(iterator.call(self, item, index, length))
			.then(function(value) {
		        values[index] = value;
				index++;
		        return values;
		    });
		}, []);
	}

	function mapObjectParallel(obj, iterator, keysFn) {
		return mapObject.call(this, obj, iterator, keysFn, Promise.map);
	}

	function mapObjectSeries(obj, iterator, keysFn) {
		return mapObject.call(this, obj, iterator, keysFn, mapSeries);
	}

	function mapObject(obj, iterator, keysFn, mapFn) {
		if (typeof iterator !== 'function') return apiRejection('iterator must be a function');

		var self = this,
			keys = keysFn(obj);

		return mapFn.call(Promise, keys, function(key) {
			return iterator.call(self, obj[key], key, obj);
		}).then(function(arr) {
			var objOut = {};
			for (var i = 0; i < keys.length; i++) {
				objOut[keys[i]] = arr[i];
			}
			return objOut;
		});
	}

	// function to return promise rejected with api error
	function apiRejection(msg) {
	    return Promise.reject(new Promise.TypeError(msg));
	}
};
