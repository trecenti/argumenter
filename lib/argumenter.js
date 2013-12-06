var strategies = require('./strategies');

module.exports = function (fn) {
  var self = {}
    , registeredStrategies = []
    , spreads = [];

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
      return strategy.execute(context);
    } else {
      return undefined;
    }
  };

  self.spread = function (index) {
    spreads.push(index);

    return self;
  };

  self.when = function (strategy, callback) {

    if (typeof strategy === 'function' || strategy instanceof Array) {
      registeredStrategies.push(new strategies.ByType(strategy, callback, fn, spreads));
    } else {
      registeredStrategies.push(new strategies.ByLength(strategy, callback, fn, spreads));
    }

    return { when: self.when, done: self.done };
  }

  return self;
};
