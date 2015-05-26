'use strict';

var type = require('type-of');

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
    else if (type(fn) === 'function') {
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

  // for built-ins, type() will always return the same string
  // property "name" does, but lowercase.
  function match(t, instance) {
    return t !== null && t.name && t.name.toLowerCase() === type(instance);
  }

  self.isMatch = function () {
    var a, t;
    for (var i in types) {
      t = types[i];
      a = args[i]
      if (!(match(t, a)
        || (a === null && t === null)
        || (type(a) === 'object' && a instanceof t))) {
        return false;
      }
    }

    return true;
  }

  self.execute = executor(callback, args);

  return self;
};
