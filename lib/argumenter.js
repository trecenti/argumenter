module.exports = function (fn) {
  var self = {}
    , strategies = {};

  function done() {
    var toExecute;

    for (var index in strategies) {
      if (strategies.hasOwnProperty(index)) {
        if (index == fn.arguments.length) {
          toExecute = strategies[index];
        }
      }
    }
    if (toExecute) {
      return toExecute.apply(fn, Array.prototype.slice.apply(fn.arguments));
    } else {
      return undefined;
    }
  }

  self.when = function (strategy, callback) {
    strategies[strategy] = callback;

    return { when: self.when, done: done };
  }

  return self;
};
