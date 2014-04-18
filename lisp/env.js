(function (exports) {
  'use strict';

  function makeEnv(spec) {
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