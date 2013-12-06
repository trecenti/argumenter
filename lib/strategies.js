function spread(currentArgs, spreads) {
  var newArgs, shouldSpread, argToSpread, isArray;

  newArgs = [];

  for (var i in currentArgs) {
    isArray = currentArgs[i] instanceof Array;
    shouldSpread = isArray && spreads.indexOf(parseInt(i)) >= 0;

    if (shouldSpread) {
      argToSpread = currentArgs[i];

      for (var spreadIndex in argToSpread) {
        newArgs.push(argToSpread[spreadIndex]);
      }
    } else {
      newArgs.push(currentArgs[i]);
    }
  }

  return newArgs;
};

exports.ByLength = function (length, callback, target, spreads) {
  var self = {}
    , args = spread(Array.prototype.slice.apply(target.arguments), spreads || []);

  self.isMatch = function () {
    return length == args.length;
  }

  self.execute = function (context, spreads) {

    return callback.apply((context || target), args);
  }

  return self;
};

exports.ByType = function (types, callback, target, spreads) {
  var self = {}
    , args = spread(Array.prototype.slice.apply(target.arguments), spreads || []);

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
      isMatch = matchesObject(types[i], args[i])
          || matchesString(types[i], args[i])
          || matchesNumber(types[i], args[i])
          || matchesBoolean(types[i], args[i])
          || args[i] instanceof types[i];

      if (!isMatch)  {
        return false;
      }
    }

    return true;
  }

  self.execute = function (context) {
    return callback.apply((context || target), args);
  }

  return self;
};
