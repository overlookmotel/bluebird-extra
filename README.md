# bluebird-extra

# Extra methods for bluebird promises library

## Current status

[![NPM version](https://img.shields.io/npm/v/bluebird-extra.svg)](https://www.npmjs.com/package/bluebird-extra)
[![Build Status](https://img.shields.io/travis/overlookmotel/bluebird-extra/master.svg)](http://travis-ci.org/overlookmotel/bluebird-extra)
[![Dependency Status](https://img.shields.io/david/overlookmotel/bluebird-extra.svg)](https://david-dm.org/overlookmotel/bluebird-extra)
[![Dev dependency Status](https://img.shields.io/david/dev/overlookmotel/bluebird-extra.svg)](https://david-dm.org/overlookmotel/bluebird-extra)
[![Coverage Status](https://img.shields.io/coveralls/overlookmotel/bluebird-extra/master.svg)](https://coveralls.io/r/overlookmotel/bluebird-extra)

API is stable. Test coverage of all features.

Suggestions on additional methods to add or ways to improve the existing methods are very welcome.

## Usage

Augments [bluebird](https://www.npmjs.com/package/bluebird) with extra flow control methods, similar to what's available in [async](https://www.npmjs.com/package/async) (for async code) or [lodash](https://www.npmjs.com/package/lodash) (for sync code).

### Loading module

To load module:

```js
var Promise = require('bluebird-extra');
```

This returns an independent instance of `bluebird` v2, augmented with additional methods. It does not alter the global version of `bluebird` which would be received from `require('bluebird')`.

Or, to use another version of bluebird as the base for augmentation:

```js
var Promise = require('bluebird');
require('bluebird-extra').usePromise(Promise);
```

### Additional methods

All the following methods can be called either on the `Promise` constructor, or a `Promise` instance.

e.g.
```js
Promise.mapSeries([1, 2], function(value) {
	// do something
});

Promise.resolve([1, 2]).mapSeries(function(value) {
	// do something
});

```

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

Use `npm test` to run the tests. Use `npm run cover` to check coverage.

## Changelog

See [changelog.md](https://github.com/overlookmotel/bluebird-extra/blob/master/changelog.md)

## Issues

If you discover a bug, please raise an issue on Github. https://github.com/overlookmotel/bluebird-extra/issues

## Contribution

Pull requests are very welcome. Please:

* ensure all tests pass before submitting PR
* add an entry to changelog
* add tests for new features
* document new functionality/API additions in README
