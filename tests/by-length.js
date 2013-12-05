var argumenter = require('../index');

describe('using argumenter by length', function () {
  describe('on a single argument functions', function () {
    var fn;

    describe('with a single strategy', function () {
      beforeEach(function () {
        fn = function () {
          return argumenter(fn).when(1, function (first) { return first + '-argument'; }).done();
        }
      });

      it('executes the strategy (when the number of arguments matches)', function () {
        expect(fn('test')).to.equal('test-argument');
      });

      it('does not execute the strategy (when the number of arguments don\'t match)', function () {
        expect(fn()).to.equal(undefined);
      });
    });

    describe('with multiple strategies', function () {
      beforeEach(function () {
        fn = function () {
          return argumenter(fn)
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

  describe('on a multiple arguments functions', function () {
    var fn;

    describe('with a single strategy', function () {
      beforeEach(function () {
        fn = function () {
          return argumenter(fn).when(2, function (first, second) {
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

      describe('when the number of arguments do not match', function () {
        it('does not execute the strategy (when one of the arguments is passed)', function () {
          expect(fn('first')).to.equal(undefined);
        });

        it('does not execute the strategy (when no argument is passed)', function () {
          expect(fn()).to.equal(undefined);
        });
      });
    });

    describe('with multiple strategies', function () {
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

          result = argumenter(fn)
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
