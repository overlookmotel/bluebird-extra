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

## 0.1.4

* Update `bluebird` dependency to ^2.9.24
* Better way to produce API errors
* Travis runs tests against node 0.10 and 0.12
* Travis runs on new container infrastructure
* README code examples tagged as Javascript
* Corrected typo in README
* Remove trailing spaces

## 0.1.5

* Update `bluebird` dependency to ^2.9.25
* Update dev dependencies
* README contribution section

## 0.1.6

* Test code coverage & Travis sends to coveralls
* Run jshint on tests
* Remove use of `__proto__` in tests
* Update README badges to use shields.io

## 0.1.7

* Disable Travis dependency cache

## 1.0.0

* `.eachAny()` method runs first iteration asyncronously
* `.usePromise()` method on results of `.usePromise(Promise)`
* Update `bluebird` dependency to ^2.10.1
* Update dev dependencies
* Tests for asynchronous execution of first iteration
* Code tidy
* Speed up tests
* Travis runs test on node v4
* README

Breaking changes:

* `.eachAny()` method runs first iteration asynchronously rather than straight away

## 1.0.1

* Fix: `.usePromise()` method
* Test for `.usePromise()` method

## 2.0.0

* Return independent instance of bluebird
* Refactor code
* Update `bluebird` dependency to ^2.10.2
* Update dev dependencies
* Replace `Makefile` with npm scripts
* Travis tests against node v6
* `package.json` keywords
* Update license
* Update `.npmignore`
* README update
