exports.ByLength = function (length, callback, target) {
  var self = {};

  self.isMatch = function () {
    return length == target.arguments.length;
  }

  self.execute = function (context) {
    return callback.apply((context || target), Array.prototype.slice.apply(target.arguments));
  }

  return self;
};

exports.ByType = function (types, callback, target) {
  var self = {};

  types = [].concat(types);

  function matchesNumber(type, instance) {
    return type.name === 'Number' && !isNaN(parseFloat(instance)) && isFinite(instance);
  }

  function matchesObject(type, instance) {
    return type.name === 'Object' && instance != null && typeof instance === 'object';
  }

  function matchesString(type, instance) {
    return type.name === 'String' && typeof instance === 'string';
  }

  function matchesBoolean(type, instance) {
    return type.name === 'Boolean' && typeof instance === 'boolean';
  }

  self.isMatch = function () {
    for (var i in types) {
      isMatch = matchesObject(types[i], target.arguments[i])
          || matchesString(types[i], target.arguments[i])
          || matchesNumber(types[i], target.arguments[i])
          || matchesBoolean(types[i], target.arguments[i])
          || target.arguments[i] instanceof types[i];

      if (!isMatch)  {
        return false;
      }
    }

    return true;
  }

  self.execute = function (context) {
    return callback.apply((context || target), Array.prototype.slice.apply(target.arguments));
  }

  return self;
};
