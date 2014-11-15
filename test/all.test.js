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

var obj = {a: 1, b: 2};
obj.__proto__ = {c: 3};

var tests = {
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
		expectResult: {a: 11, b: 12, c: 13}
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
		expectResult: {a: 11, b: 12}
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
		}
	},
	inSeries: {
		value: obj,
		fn: function(value) {
			return value + 10;
		},
		expectExec: [['start', 1], ['end', 1], ['start', 2], ['end', 2], ['start', 3], ['end', 3]]
	},
	own: {
		value: obj,
		fn: function(value) {
			return value + 10;
		}
	},
	ownSeries: {
		value: obj,
		fn: function(value) {
			return value + 10;
		},
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

describe('Method', function() {
	for (var method in tests) {
		runTests(method);
	}
	
	runIfElseTests();
});

function runTests(method) {
	describe(method, function() {
		var params = tests[method];
		var execArr;
		
		function fnWrapper(value) {
			execArr.push(['start', value]);
			
			return Promise.delay(100).then(function() {
				execArr.push(['end', value]);
				return params.fn(value);
			});
		}
		
		function expectation(result) {
			if (params.expectResult) expect(result).to.deep.equal(params.expectResult);
			if (params.expectExec) expect(execArr).to.deep.equal(params.expectExec);
		}
		
		it('runs on Promise', function() {
			execArr = [];
			return Promise[method](params.value, fnWrapper).then(expectation);
		});
		
		it('runs chained', function() {
			execArr = [];
			return Promise.resolve(params.value)[method](fnWrapper).then(expectation);
		});
	});
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
