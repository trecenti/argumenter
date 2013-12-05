exports.ByLength = function (length, callback, target) {
  var self = {};

  self.isMatch = function () {
    return length == target.arguments.length;
  }

  self.execute = function () {
    return callback.apply(target, Array.prototype.slice.apply(target.arguments));
  }

  return self;
};
