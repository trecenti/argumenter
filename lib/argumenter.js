var strategies = require('./strategies');

module.exports = function (fn) {
  var self = {}
    , registeredStrategies = [];

  function findMatch () {
    for (var index in registeredStrategies) {
      if (registeredStrategies[index].isMatch()) {
        return registeredStrategies[index];
      }
    }

    return null;
  }

  function done(context) {
    var strategy;

    strategy = findMatch();

    if (strategy) {
      return strategy.execute(context);
    } else {
      return undefined;
    }
  }

  self.when = function (strategy, callback) {

    if (typeof strategy === 'function' || strategy instanceof Array) {
      registeredStrategies.push(new strategies.ByType(strategy, callback, fn));
    } else {
      registeredStrategies.push(new strategies.ByLength(strategy, callback, fn));
    }

    return { when: self.when, done: done };
  }

  return self;
};
