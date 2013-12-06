var argumenter = require('../index');

describe('context binding', function () {
  var context;

  it('uses context if passed to done', function () {
    context = new (function () {
      this.fn = function () {
        return argumenter(this.fn)
                  .when(Number, function () { return this; })
                  .when(2, function () { return this; })
                  .done(this);
      }
    })();

    expect(context.fn(1)).to.equal(context);
    expect(context.fn(1, 2)).to.equal(context);
  });

  it('uses fn as context if none passed to done', function () {
    context = new (function () {
      this.fn = function () {
        return argumenter(this.fn)
                  .when(Number, function () { return this; })
                  .when(2, function () { return this; })
                  .done();
      }
    })();

    expect(context.fn(1)).to.equal(context.fn);
    expect(context.fn(1, 2)).to.equal(context.fn);
  });
});
