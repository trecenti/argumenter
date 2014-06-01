'use strict';

var argumenter = require('../index');

describe('strict mode: context binding', function () {
  var context;

  it('uses context if passed to done', function () {
    context = new (function () {
      this.fn = function () {
        return argumenter(arguments)
                  .when(Number, function () { return this; })
                  .when(2, function () { return this; })
                  .done(this);
      }
    })();

    expect(context.fn(1)).to.equal(context);
    expect(context.fn(1, 2)).to.equal(context);
  });

  // this is an expected failure.
  it('uses null as context if none passed to done', function () {
    context = new (function () {
      this.fn = function () {
        return argumenter(arguments)
                  .when(Number, function () { return this; })
                  .when(2, function () { return this; })
                  .done();
      }
    })();

    expect(context.fn(1)).to.be.null;
    expect(context.fn(1, 2)).to.be.null;
  });
});
