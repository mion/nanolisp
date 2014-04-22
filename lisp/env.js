(function (exports) {
  'use strict';

  function makeEnv() {
    var args = Array.prototype.slice.call(arguments, 0);

    if (args.length == 1) {
      return makeEnvWithSpec(args[0]);
    } else if (args.length == 2) {
      return makeEnvWithArray(args[0], args[1]);
    } else if (args.length == 3) {
      return makeEnvWithArray(args[0], args[1], args[2]);
    } else throw new RangeError();
  }

  function makeEnvWithArray(symbols, values, outerEnv) {
    var ctx = {};    

    for (var i = 0; i < symbols.length; i++) {
      ctx[symbols[i]] = values[i];
    };

    return makeEnvWithSpec({
      context: ctx,
      outer: outerEnv
    });
  }

  function makeEnvWithSpec(spec) {
    var that = {},
        context,
        outer;

    outer = spec.outer;

    if (outer) {
      context = Object.create(outer.context);

      var key;
      for (key in spec.context) {
        context[key] = spec.context[key];
      }
    } else {
      context = spec.context;
    }

    that.context = context;
    that.outer = outer;

    that.get = function (key) {
      return that.context[key];
    };

    that.set = function (key, value) {
      that.context[key] = value;
    };

    that.find = function (key) {
      if (that.context.hasOwnProperty(key)) {
        return that;
      } else if (that.outer) {
        return that.outer.find(key);
      } else {
        return undefined;
      }
    };

    return that;
  }

  exports.makeEnv = makeEnv;
})(window);