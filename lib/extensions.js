// --------------------
// bluebird-extra
// Extension methods
// --------------------

// exports

module.exports = function(Promise) {
	// import error function from bluebird internals
	var apiRejection = require('../node_modules/bluebird/js/main/errors_api_rejection')(Promise);
	
	// create extra promise methods
	var methods = {
		// like bluebird.map() but run in series
		mapSeries: function(arr, iterator) {
			if (typeof iterator !== 'function') return apiRejection('iterator must be a function');
			
			return mapSeries.call(this, arr, iterator);
		},
		
		// methods for mapping objects
		// (`in` variations for all properties including inherited, `own` variations for just object's own properties)
		
		mapIn: function(obj, iterator) {
			return mapObject.call(this, obj, iterator, keysAll);
		},
		
		mapInSeries: function(obj, iterator) {
			return mapObjectSeries.call(this, obj, iterator, keysAll);
		},
		
		mapOwn: function(obj, iterator) {
			return mapObject.call(this, obj, iterator, Object.keys);
		},
		
		mapOwnSeries: function(obj, iterator) {
			return mapObjectSeries.call(this, obj, iterator, Object.keys);
		},
		
		// methods for looping through objects' properties
		// (`in` variations for all properties including inherited, `own` variations for just object's own properties)
		in: function(obj, iterator) {
			return mapObject.call(this, obj, iterator, keysAll).return();
		},
		
		inSeries: function(obj, iterator) {
			return mapObjectSeries.call(this, obj, iterator, keysAll).return();
		},
		
		own: function(obj, iterator) {
			return mapObject.call(this, obj, iterator, Object.keys).return();
		},
		
		ownSeries: function(obj, iterator) {
			return mapObjectSeries.call(this, obj, iterator, Object.keys).return();
		},
		
		
		// run iterator on each item in array in series
		// return first result from iterator that is not undefined
		eachAny: function(arr, iterator) {
			if (typeof iterator !== 'function') return apiRejection('iterator must be a function');
			
			var self = this;
			var i = 0;
			return (function iterate() {
				if (i == arr.length) return Promise.resolve();
				
				return Promise.resolve(iterator.call(self, arr[i]))
				.then(function(result) {
					if (result !== undefined) return Promise.resolve(result);
					
					i++;
					return iterate();
				});
			})();
		},
		
		// if value is truthy, run ifFn, otherwise run elseFn
		// returns value for whichever function is run
		ifElse: function(value, ifFn, elseFn) {
			if ((ifFn && typeof ifFn !== 'function') || (elseFn && typeof elseFn !== 'function')) return apiRejection('ifFn and elseFn must be functions');
			
			var self = this;
			var fn = value ? ifFn : elseFn;
			if (!fn) return Promise.resolve(value);
			
			return Promise.try(function() {
				return fn.call(self, value);
			});
		}
	};
	
	// aliases
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
		iterator = Promise.method(iterator.bind(this)); //xxx bind here isn't good - see if works another way
		
		var length = arr.length,
			index = 0;
		return Promise.reduce(arr, function(values, item) {
		    return iterator(item, index, length).then(function(value) {
		        values[index] = value;
				index++;
		        return values;
		    });
		}, []);
	}
	
	function mapObject(obj, iterator, keysFn) {
		if (typeof iterator !== 'function') return apiRejection('iterator must be a function');

		iterator = Promise.method(iterator.bind(this)); //xxx bind here isn't good - see if works another way
		
		var keys = keysFn(obj);
		return Promise.map.call(this, keys, function(key) {
			return iterator.call(this, obj[key], key, obj);
		}).then(function(arr) {
			var objOut = {};
			for (var i = 0; i < keys.length; i++) {
				objOut[keys[i]] = arr[i];
			}
			return objOut;
		});
	}

	function mapObjectSeries(obj, iterator, keysFn) {
		if (typeof iterator !== 'function') return apiRejection('iterator must be a function');

		iterator = Promise.method(iterator.bind(this)); //xxx bind here isn't good - see if works another way
		
		var keys = keysFn(obj);
		return mapSeries.call(this, keys, function(key) {
			return iterator.call(this, obj[key], key, obj);
		}).then(function(arr) {
			var objOut = {};
			for (var i = 0; i < keys.length; i++) {
				objOut[keys[i]] = arr[i];
			}
			return objOut;
		});
	}
	
	// returns array of obj's keys including inherited from prototype
	function keysAll(obj) {
		var keys = [];
		for (var key in obj) {
			keys.push(key);
		}
		return keys;
	}
};
