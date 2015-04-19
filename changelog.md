# Changelog

## 0.0.1

* Initial release

## 0.1.0

* eachAny copes with iterator function returning sync
* Remove unnecessary bind() on iterator function
* Tests for chaining when passed promise
* Tests for `this` binding being preserved along chain
* Tests for bound `this` being passed to iterator function
* Tests for sync iterator functions

## v0.1.1

* Correct mistake in README

## 0.1.2

* `forEach` alias of `each`

## 0.1.3

* Added `eachParallel` method
* Added `eachSeries` alias of `each`
* Tests for execution order for parallel functions

## Next

* Update bluebird dependency to ^2.9.24
* Corrected typo in README
