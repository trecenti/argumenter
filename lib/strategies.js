'use strict';

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

// returns an execution function given a callback and arguments
function executor(callback, args) {
  return function execute(context, fn) {
    // if the context is explicitly defined, we use it.
    // if we are NOT in strict mode, we can expect fn to actually be
    // a function, so we'll use that instead.
    var ctx = null;
    if (context) {
      ctx = context;
    }
    else if (typeof(fn) === 'function') {
      ctx = fn;
    }
    return callback.apply(ctx, args);
  };
}

exports.ByLength = function (length, callback, args, spreads) {
  var self = {};

  args = spread(args, spreads || []);

  self.isMatch = function () {
    return length == args.length;
  }

  self.execute = executor(callback, args);

  return self;
};

exports.ByType = function (types, callback, args, spreads) {
  var self = {};

  args = spread(args, spreads || []);

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
      if (!(matchesObject(types[i], args[i])
          || matchesString(types[i], args[i])
          || matchesNumber(types[i], args[i])
          || matchesBoolean(types[i], args[i])
          || args[i] instanceof types[i])) {
        return false;
      }
    }

    return true;
  }

  self.execute = executor(callback, args);

  return self;
};
