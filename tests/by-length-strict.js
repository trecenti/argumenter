'use strict';

var argumenter = require('../index');

describe('strict mode: using argumenter by length', function () {
  describe('strict mode: on a single argument functions', function () {
    var fn;

    describe('strict mode: with a single strategy', function () {
      beforeEach(function () {
        fn = function () {
          return argumenter(arguments).when(1, function (first) { return first + '-argument'; }).done();
        }
      });

      it('executes the strategy (when the number of arguments matches)', function () {
        expect(fn('test')).to.equal('test-argument');
      });

      it('does not execute the strategy (when the number of arguments don\'t match)', function () {
        expect(fn()).to.equal(undefined);
      });
    });

    describe('strict mode: with multiple strategies', function () {
      beforeEach(function () {
        fn = function () {
          return argumenter(arguments)
                  .when(1, function (first) { return first + '-argument'; })
                  .when(0, function () { return 'no-arguments'; })
                  .done();
        }
      });

      it('executes the strategy (for length == 1)', function () {
        expect(fn('test')).to.equal('test-argument');
      });

      it('executes the strategy (for length == 0)', function () {
        expect(fn()).to.equal('no-arguments');
      });

      it('does not execute the strategy (when the number of arguments don\'t match)', function () {
        expect(fn('a', 'b')).to.equal(undefined);
      });
    });
  });

  describe('strict mode: on a multiple arguments functions', function () {
    var fn;

    describe('strict mode: with a single strategy', function () {
      beforeEach(function () {
        fn = function () {
          return argumenter(arguments).when(2, function (first, second) {
            return {
              first: first + '-argument',
              second: second + '-argument'
            };
          }).done();
        }
      });

      it('executes the strategy (when the number of arguments matches)', function () {
        expect(fn('first', 'second')).to.deep.equal(
          { first: 'first-argument', second: 'second-argument' }
        );
      });

      describe('strict mode: when the number of arguments do not match', function () {
        it('does not execute the strategy (when one of the arguments is passed)', function () {
          expect(fn('first')).to.equal(undefined);
        });

        it('does not execute the strategy (when no argument is passed)', function () {
          expect(fn()).to.equal(undefined);
        });
      });
    });

    describe('strict mode: with multiple strategies', function () {
      beforeEach(function () {
        fn = function () {
          var result;

          function noArguments() {
            return  'no-arguments';
          }

          function oneArgument(first) {
            return  first + '-argument';
          }

          function twoArguments(first, second) {
            return {
              first: first + '-argument',
              second: second + '-argument'
            };
          }

          result = argumenter(arguments)
                    .when(0, noArguments)
                    .when(1, oneArgument)
                    .when(2, twoArguments).done();

          return result;
        }
      });

      it('executes the strategy (when length == 2)', function () {
        expect(fn('first', 'second')).to.deep.equal(
          { first: 'first-argument', second: 'second-argument' }
        );
      });

      it('executes the strategy (when length == 1)', function () {
        expect(fn('first')).to.equal('first-argument');
      });

      it('executes the strategy (when no argument is passed)', function () {
        expect(fn()).to.equal('no-arguments');
      });

      it('does not execute the strategy (when the number of arguments do not match)', function () {
        expect(fn('first', 'second', 'third')).to.equal(undefined);
      });
    });
  });
});
