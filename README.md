# bluebird-extra

# Extra methods for bluebird promises library

## Current status

[![Build Status](https://secure.travis-ci.org/overlookmotel/bluebird-extra.png?branch=master)](http://travis-ci.org/overlookmotel/bluebird-extra)
[![Dependency Status](https://david-dm.org/overlookmotel/bluebird-extra.png)](https://david-dm.org/overlookmotel/bluebird-extra)

API is mostly stable. Tests cover most scenarios but not very battle-tested in production as yet.

Suggestions on additional methods to add or ways to improve the existing methods are very welcome.

## Usage

### Loading module

To load module:

```js
var Promise = require('bluebird-extra');
```

Or, to use another version of bluebird as the base for augmentation (perhaps one which has already been augmented):

```js
var Promise = require('bluebird-extra').usePromise(require('some-bluebird-version'));
```

### Additional methods:

#### eachParallel()

Like `Promise.each()` but run in parallel.

#### mapSeries()

Like `Promise.map()` but run in series.

#### mapOwn()
##### Aliases: `mapObject()`, `mapValues()`

Maps an object like `lodash.mapValues()`

```js
Promise.mapOwn({ a: 1, b: 2 }, function(value, key, object) {
	// do something to the value and return it
});
```

#### mapIn()

Same as `mapOwn()` but also iterates through properties inherited from prototype.

#### mapOwnSeries()
##### Aliases: `mapObjectSeries()`, `mapValuesSeries()`

Same as `mapOwn()` but run in series.

#### mapInSeries()

Same as `mapIn()` but run in series.

#### own()

Iterates through properties of an object, calling the iterator function on each. Returns the object unchanged.

```js
Promise.own({ a: 1, b: 2 }, function(value, key, object) {
	// do something
});
```

#### ownSeries()
##### Alias: `forOwn()`

Same as `own()` but run in series.

#### in()

Same as `own()` but also iterates through properties inherited from prototype.

#### inSeries()
##### Alias: `forIn()`

Same as `in()` but run in series.

#### eachAny()

Runs iterator on each item in an array in series until the iterator returns a result that is not undefined. Iteration is stopped and this result is returned.

#### ifElse()

Tests the value passed in. If truthy, the if function is run, otherwise the else function is run.

```
Promise.ifElse(testExpression, function(value) {
	// this runs if testExpression is truthy
}, function(value) {
	// this runs if testExpression is not truthy
});
```

#### each()
##### Aliases: `forEach()`, `eachSeries()`

`Promise.each()` is a native bluebird construct. `forEach()` and `eachSeries()` are aliases for it, included for consistency.

## Tests

Use `npm test` to run the tests.

## Changelog

See changelog.md

## Issues

If you discover a bug, please raise an issue on Github. https://github.com/overlookmotel/bluebird-extra/issues
