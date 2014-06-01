'use strict';

var argumenter = require('../index')
  , sinon = require('sinon');

describe('strict mode: using argumenter by type', function () {
  describe('strict mode: on a single argument functions', function () {
    var fn;

    describe('strict mode: with a single strategy', function () {
      beforeEach(function () {
        fn = function () {
          return argumenter(arguments).when(Function, function (firstFn) { return firstFn('my-fn-call'); }).done();
        }
      });

      it('executes the strategy (when the argument is a function)', function () {
        var fnArg = sinon.spy();

        fn(fnArg);

        expect(fnArg).to.have.been.calledWith('my-fn-call');
      });

      it('does not execute the strategy (when the argument is not a function)', function () {
        expect(fn(1)).to.equal(undefined);
      });
    });


    describe('strict mode: with multiple strategies', function () {
      beforeEach(function () {
        fn = function () {
          return argumenter(arguments)
                  .when(Function, function (firstFn) { return firstFn('my-fn-call'); })
                  .when(Array, function (array) { return array.concat(1); })
                  .when(Number, function (number) { return number + 1; })
                  .when(Object, function (obj) { obj.id = 'id'; return obj; })
                  .when(String, function (string) { return string.replace(/\s/g, '-'); })
                  .when(Boolean, function (bool) { return !bool; })
                  .when(0, function () { return 'no-arguments'; })
                  .done();
        }
      });

      it('executes the strategy (for function)', function () {
        var fnArg = sinon.spy();

        fn(fnArg);

        expect(fnArg).to.have.been.calledWith('my-fn-call');
      });

      it('executes the strategy (for array)', function () {
        expect(fn([])).to.eql([1]);
      });

      it('executes the strategy (for number)', function () {
        expect(fn(1)).to.equal(2);
      });

      it('executes the strategy (for object)', function () {
        expect(fn({})).to.deep.equal({ id: 'id' });
      });

      it('executes the strategy (for string)', function () {
        expect(fn('my string')).to.equal('my-string');
      });

      it('executes the strategy (for boolean)', function () {
        expect(fn(true)).to.equal(false);
      });

      it('executes the strategy (for length == 0)', function () {
        expect(fn()).to.equal('no-arguments');
      });

      it('does not execute the strategy (when the arguments do not match any strategy)', function () {
        expect(fn(null, 'b')).to.equal(undefined);
      });
    });
  });

  describe('strict mode: on a multiple arguments functions', function () {
    var fn;

    describe('strict mode: with a single strategy', function () {
      beforeEach(function () {
        fn = function () {
          return argumenter(arguments)
            .when([Function, Number], function (func, number) {
              func('my-fn-call');
              return number + 1;
            }).done();
        }
      });

      it('executes the strategy (when the arguments match)', function () {
        var fnArg, result;
        fnArg = sinon.spy();

        result = fn(fnArg, 1);

        expect(result).to.equal(2);
        expect(fnArg).to.have.been.calledWith('my-fn-call');
      });

      it('does not execute the strategy (when the argument do not match)', function () {
        expect(fn(1, function () {})).to.equal(undefined);
      });
    });

    describe('strict mode: with multiple strategies', function () {
      beforeEach(function () {
        fn = function () {
          return argumenter(arguments)
            .when([Function, Number], function (func, number) {
              func('my-fn-call');
              return number + 1;
            })
            .when(Boolean, function (bool) { return !bool; })
            .when(0, function () { return 'no-arguments'; })
            .done();
        }
      });

      it('executes the strategy (when the arguments match [Function, Number])', function () {
        var fnArg, result;
        fnArg = sinon.spy();

        result = fn(fnArg, 1);

        expect(result).to.equal(2);
        expect(fnArg).to.have.been.calledWith('my-fn-call');
      });

      it('executes the strategy (when the arguments match Boolean)', function () {
        expect(fn(true)).to.equal(false);
      });

      it('executes the strategy (when the arguments match Boolean)', function () {
        expect(fn()).to.equal('no-arguments');
      });

      it('does not execute the strategy (when the arguments do not match any strategy)', function () {
        expect(fn(null, 'b')).to.equal(undefined);
      });
    });
  });
});
