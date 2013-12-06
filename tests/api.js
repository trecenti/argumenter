var argumenter = require('../index');

describe('the argumenter api', function () {
  it('can be called in a chain', function () {
    function fn() {
      return argumenter(fn)
        .when(1, function(one) { return one; })
        .when(0, function() { return 'no-arguments'; })
        .done();
    };

    expect(fn).to.not.throw();
  });

  it('can be called detached', function () {
    function fn() {
      var handler = argumenter(fn);

      handler.when(1, function(one) { return one; });
      handler.when(0, function() { return 'no-arguments'; });

      return handler.done();
    };

    expect(fn).to.not.throw();
  });

});
