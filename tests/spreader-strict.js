'use strict';

var argumenter = require('../index');

describe('strict mode: spreader', function () {
  it('spread array argument on a give index', function () {
    function fn() {
      var handler = argumenter(arguments);

      handler.spread(0).spread(2)
        .when([String, Object, Number, Array], function (string, obj, n, array) {
          return {
            string: string,
            obj: obj,
            number: n,
            array: array
          };
        });

      return handler.done();
    };

    expect(
      fn(['test', { a: 1 }], 1, [[3,4]])
    ).to.deep.equal({
      string: 'test',
      obj: { a: 1 },
      number: 1,
      array: [3, 4]
    });
  });

  it('does not throw if arg to spread is not an array', function () {
    function fn() {
      var handler = argumenter(arguments);

      handler.spread(0).spread(1).spread(2);

      handler
        .when([String, Object, Number, Array], function (string, obj, n, array) {
          return {
            string: string,
            obj: obj,
            number: n,
            array: array
          };
        });

      return handler.done();
    };

    expect(fn(['test', { a: 1 }], 1, [[3,4]])).to.deep.equal({
      string: 'test',
      obj: { a: 1 },
      number: 1,
      array: [3, 4]
    });
  });
});
