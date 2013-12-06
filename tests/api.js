var argumenter = require('../index');

describe('the argumenter api', function () {
  describe('when chained', function () {
    it('does not throw', function () {
      function fn() {
        return argumenter(fn)
          .when(1, function(one) { return one; })
          .when(0, function() { return 'no-arguments'; })
          .done();
      };

      expect(fn).to.not.throw();
    });

    it('does not throws (if no strategy is defined)', function () {
      function fn() {
        return argumenter(fn).done();
      };

      expect(fn).to.not.throw();
    });

    it('throws (when done is called in a wrong order)', function () {
      function fn() {
        return argumenter(fn)
          .when(1, function(one) { return one; })
          .done()
          .when(0, function() { return 'no-arguments'; });
      };

      expect(fn).to.throw();
    });

    it('throws (when spread called in a wrong order)', function () {
      function fn() {
        return argumenter(fn)
          .when(1, function(one) { return one; })
          .spread(0)
          .when(0, function() { return 'no-arguments'; });
      };

      expect(fn).to.throw();
    });
  });

  it('can be called detached', function () {
    function fn() {
      var handler = argumenter(fn);

      handler.when(1, function(one) { return one; });
      handler.spread(0);
      handler.when(0, function() { return 'no-arguments'; });

      return handler.done();
    };

    expect(fn).to.not.throw();
  });
});
