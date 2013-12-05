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

  function done() {
    var strategy;

    strategy = findMatch();

    if (strategy) {
      return strategy.execute();
    } else {
      return undefined;
    }
  }

  self.when = function (strategy, callback) {
    registeredStrategies.push(new strategies.ByLength(strategy, callback, fn));

    return { when: self.when, done: done };
  }

  return self;
};
