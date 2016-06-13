// --------------------
// bluebird-extra
// Utility functions
// --------------------

// exports

module.exports = {
    /**
     * Return own enumarable properties of object.
     * @param {Object} obj - Object
     * @returns {Array} - Array of object's keys
     */
    keysOwn: Object.keys,

    /**
     * Return enumarable properties of object (including inherited from prototype).
     * @param {Object} obj - Object
     * @returns {Array} - Array of object's keys
     */
    keysIn: function(obj) {
        var keys = [];
    	for (var key in obj) {
    		keys.push(key);
    	}
    	return keys;
    },

    /**
     * Run fn for each property of object.
     * Calls `fn` with arguments (property, propertyName, object).
     * Same as `lodash.forIn()`.
     *
     * @param {Object} obj - Object to iterate over
     * @param {Function} fn - Function to call for each property.
     */
    forIn: function(obj, fn) {
    	for (var name in obj) {
    		fn(obj[name], name, obj);
    	}
    	return obj;
    },

    /**
     * Convert arguments object to Array.
     * @param {Arguments} args - Arguments object
     * @returns {Array} - Array of arguments
     */
    argumentsToArray: function(args) {
        return Array.prototype.slice.call(args);
    }
};
