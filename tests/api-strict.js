'use strict';

var argumenter = require('../index');

describe('strict mode: the argumenter api', function () {
  describe('strict mode: when chained', function () {
    it('does not throw', function () {
      function fn() {
        return argumenter(arguments)
          .when(1, function(one) { return one; })
          .when(0, function() { return 'no-arguments'; })
          .done();
      };

      expect(fn).to.not.throw();
    });

    it('does not throws (if no strategy is defined)', function () {
      function fn() {
        return argumenter(arguments).done();
      };

      expect(fn).to.not.throw();
    });

    it('throws (when done is called in a wrong order)', function () {
      function fn() {
        return argumenter(arguments)
          .when(1, function(one) { return one; })
          .done()
          .when(0, function() { return 'no-arguments'; });
      };

      expect(fn).to.throw();
    });

    it('throws (when spread called in a wrong order)', function () {
      function fn() {
        return argumenter(arguments)
          .when(1, function(one) { return one; })
          .spread(0)
          .when(0, function() { return 'no-arguments'; });
      };

      expect(fn).to.throw();
    });
  });

  it('can be called detached', function () {
    function fn() {
      var handler = argumenter(arguments);

      handler.when(1, function(one) { return one; });
      handler.spread(0);
      handler.when(0, function() { return 'no-arguments'; });

      return handler.done();
    };

    expect(fn).to.not.throw();
  });

  it('cannot accept a function', function () {
    function fn() {
      argumenter(fn);
    }
    expect(fn).to.throw();
  });
  
  it('can accept named parameters', function () {
    function fn(foo, bar) {
      return argumenter(foo, bar)
        .when([Number, Number], function (num1, num2) {
          return num1 + num2;
        })
        .done();
    }

    expect(fn(2, 2)).to.equal(4);
  })
});
