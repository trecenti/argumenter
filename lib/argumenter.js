// do not 'use strict' here; this module supports non-strict usage.

var strategies = require('./strategies')
  , isArguments = require('is-arguments');

module.exports = function (fn) {
  var self = {}
    , registeredStrategies = []
    , spreads = []
    , args
    , strict = true;

  try {
    // in strict mode this will throw an exception.
    // if it doesn't, support the pre-0.1.0 behavior, where
    // we actually pass the function itself to argumenter().
    args = Array.prototype.slice.call(fn.arguments);
    strict = false;
  } catch (e) {
    if (typeof(fn) === 'function') {
      throw new Error('cannot pass a function to argumenter() in strict mode.  pass "arguments" instead.');
    }
    // if the user passes arguments and only arguments, just use that
    if (arguments.length === 1 && isArguments(fn)) {
      args = Array.prototype.slice.call(fn);
    } else {
      args = Array.prototype.slice.call(arguments);
    }

  }

  function findMatch () {
    for (var index in registeredStrategies) {
      if (registeredStrategies[index].isMatch()) {
        return registeredStrategies[index];
      }
    }

    return null;
  }

  self.done = function done(context) {
    var strategy;

    strategy = findMatch();

    if (strategy) {
      // if strict mode is true, then we don't pass the fn.
      return strategy.execute(context, strict || fn);
    }
  };

  self.spread = function (index) {
    spreads.push(index);

    return self;
  };

  self.when = function (strategy, callback) {

    if (typeof strategy === 'function' || strategy instanceof Array) {
      registeredStrategies.push(new strategies.ByType(strategy, callback, args, spreads));
    } else {
      registeredStrategies.push(new strategies.ByLength(strategy, callback, args, spreads));
    }

    return { when: self.when, done: self.done };
  }

  return self;
};
