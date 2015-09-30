// --------------------
// bluebird-extra
// Tests
// --------------------

// modules
var chai = require('chai'),
	expect = chai.expect,
	promised = require('chai-as-promised'),
	Promise = require('../lib/');

// init
chai.use(promised);
chai.config.includeStack = true;

// tests

/* jshint expr: true */
/* global describe, it */

// define tests
var Obj = function() {};
Obj.prototype.c = 3;

var obj = new Obj();
obj.a = 1;
obj.b = 2;

var tests = {
	eachParallel: {
		value: [1, 2],
		fn: function(value) {
			return value + 10;
		},
		expectResult: [1, 2],
		expectExecFirst: [['start', 1], ['start', 2]]
	},

	mapSeries: {
		value: [1, 2],
		fn: function(value) {
			return value + 10;
		},
		expectResult: [11, 12],
		expectExec: [['start', 1], ['end', 1], ['start', 2], ['end', 2]]
	},

	mapIn: {
		value: obj,
		fn: function(value) {
			return value + 10;
		},
		expectResult: {a: 11, b: 12, c: 13},
		expectExecFirst: [['start', 1], ['start', 2], ['start', 3]]
	},
	mapInSeries: {
		value: obj,
		fn: function(value) {
			return value + 10;
		},
		expectResult: {a: 11, b: 12, c: 13},
		expectExec: [['start', 1], ['end', 1], ['start', 2], ['end', 2], ['start', 3], ['end', 3]]
	},
	mapOwn: {
		value: obj,
		fn: function(value) {
			return value + 10;
		},
		expectResult: {a: 11, b: 12},
		expectExecFirst: [['start', 1], ['start', 2]]
	},
	mapOwnSeries: {
		value: obj,
		fn: function(value) {
			return value + 10;
		},
		expectResult: {a: 11, b: 12},
		expectExec: [['start', 1], ['end', 1], ['start', 2], ['end', 2]]
	},

	in: {
		value: obj,
		fn: function(value) {
			return value + 10;
		},
		expectResult: {a: 1, b: 2, c: 3},
		expectExecFirst: [['start', 1], ['start', 2], ['start', 3]]
	},
	inSeries: {
		value: obj,
		fn: function(value) {
			return value + 10;
		},
		expectResult: {a: 1, b: 2, c: 3},
		expectExec: [['start', 1], ['end', 1], ['start', 2], ['end', 2], ['start', 3], ['end', 3]]
	},
	own: {
		value: obj,
		fn: function(value) {
			return value + 10;
		},
		expectResult: {a: 1, b: 2, c: 3},
		expectExecFirst: [['start', 1], ['start', 2]]
	},
	ownSeries: {
		value: obj,
		fn: function(value) {
			return value + 10;
		},
		expectResult: {a: 1, b: 2, c: 3},
		expectExec: [['start', 1], ['end', 1], ['start', 2], ['end', 2]]
	},

	eachAny: {
		value: [undefined, 1, 2],
		fn: function(value) {
			return value;
		},
		expectResult: 1,
		expectExec: [['start', undefined], ['end', undefined], ['start', 1], ['end', 1]]
	}
};

// run tests
for (var method in tests) {
	runTests(method);
}

runIfElseTests();

// test functions
function runTests(method) {
	var params = tests[method];
	var execArr;

	function expectation(result, async) {
		if (params.expectResult) expect(result).to.deep.equal(params.expectResult);
		if (params.expectExec) expect(execArr).to.deep.equal(params.expectExec);
		if (params.expectExecFirst && async) expect(execArr.slice(0, params.expectExecFirst.length)).to.deep.equal(params.expectExecFirst);
	}

	describe(method, function() {
		describe('with sync iterator function', function() {
			runTestsDo(function(value) {
				execArr.push(['start', value]);
				execArr.push(['end', value]);
				return params.fn(value);
			}, false);
		});

		describe('with async iterator function', function() {
			runTestsDo(function(value) {
				execArr.push(['start', value]);

				return Promise.delay(1).then(function() {
					execArr.push(['end', value]);
					return params.fn(value);
				});
			}, true);
		});
	});

	function runTestsDo(fn, async) {
		it('runs on Promise', function() {
			execArr = [];
			return Promise[method](params.value, fn)
			.then(function(result) {
				return expectation(result, async);
			});
		});

		it('runs chained when passed value', function() {
			execArr = [];
			return Promise.resolve(params.value)[method](fn)
			.then(function(result) {
				return expectation(result, async);
			});
		});

		it('runs chained when passed promise', function() {
			execArr = [];
			return Promise.try(function() {
				return Promise.delay(0).then(function() {
					return params.value;
				});
			})[method](fn)
			.then(function(result) {
				return expectation(result, async);
			});
		});

		it('preserves binding when chained with passed value', function() {
			return Promise.bind({x: 9})
			.return(params.value)[method](fn)
			.then(function() {
				expect(this).to.deep.equal({x: 9});
			});
		});

		it('preserves binding when chained with passed promise', function() {
			return Promise.bind({x: 9})
			.then(function() {
				return Promise.delay(0).then(function() {
					return params.value;
				});
			})[method](fn)
			.then(function() {
				expect(this).to.deep.equal({x: 9});
			});
		});

		it('iterator function receives binding with passed value', function() {
			return Promise.bind({x: 9})
			.return(params.value)[method](function() {
				expect(this).to.deep.equal({x: 9});
			});
		});

		it('iterator function receives binding with passed promise', function() {
			return Promise.bind({x: 9})
			.then(function() {
				return Promise.delay(0).then(function() {
					return params.value;
				});
			})[method](function() {
				expect(this).to.deep.equal({x: 9});
			});
		});

		it('runs first iteration asyncronously', function() {
			execArr = [];
			var promise = Promise[method](params.value, fn);
			execArr.push(['sync']);

			return promise.then(function() {
				expect(execArr[0]).to.deep.equal(['sync']);
			});
		});
	}
}

function runIfElseTests() {
	describe('ifElse', function() {
		describe('runs on Promise', function() {
			it('runs 1st function if value true', function() {
				var run1, run2;
				return Promise.ifElse(true, function(value) {run1 = value;}, function(value) {run2 = value;}).then(function() {
					expect(run1).to.be.true;
					expect(run2).to.be.undefined;
				});
			});

			it('runs 2nd function if value false', function() {
				var run1, run2;
				return Promise.ifElse(false, function(value) {run1 = value;}, function(value) {run2 = value;}).then(function() {
					expect(run1).to.be.undefined;
					expect(run2).to.be.false;
				});
			});
		});

		describe('runs chained', function() {
			it('runs 1st function if value true', function() {
				var run1, run2;
				return Promise.resolve(true).ifElse(function(value) {run1 = value;}, function(value) {run2 = value;}).then(function() {
					expect(run1).to.be.true;
					expect(run2).to.be.undefined;
				});
			});

			it('runs 2nd function if value false', function() {
				var run1, run2;
				return Promise.resolve(false).ifElse(function(value) {run1 = value;}, function(value) {run2 = value;}).then(function() {
					expect(run1).to.be.undefined;
					expect(run2).to.be.false;
				});
			});
		});
	});
}
