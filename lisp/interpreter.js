(function (exports) {
  'use strict';

  var global = makeEnv({
    context: {
      '+': function () {
        return _.reduce(arguments, function (m, x) { return m + x; }, 0);
      },
      '-': function () {
        var args = Array.prototype.slice.call(arguments);
        var first = args.shift();
        return _.reduce(args, function (m, x) { return m - x; }, first);
      },
      '*': function () {
        var args = Array.prototype.slice.call(arguments);
        return _.reduce(args, function (m, x) { return m * x; }, 1);
      },
      '/': function () {
        var args = Array.prototype.slice.call(arguments);
        var first = args.shift();
        return _.reduce(args, function (m, x) { return m / x; }, first);
      },
      '=': function () {
        var args = Array.prototype.slice.call(arguments);
        var first = args.shift();
        return _.every(_.map(args, function (x) { return _.isEqual(first, x); }), _.identity);
      },
      '>': function () { return arguments[0] > arguments[1]; },
      '>=': function () { return arguments[0] >= arguments[1]; },
      '<': function () { return arguments[0] < arguments[1]; },
      '<=': function () { return arguments[0] <= arguments[1]; },
      'not': function () { return !arguments[0]; },
      'size': function () { return arguments[0].length; },
      'list': function () { return Array.prototype.slice.call(arguments); },
      'push': function () { return arguments[1].concat(arguments[0]); },
      'add': function () { return [arguments[0]].concat(arguments[1]); },
      'list?': _.isArray,
      'null?': _.isNull,
      'symbol?': _.isString,
      'first': _.first,
      'rest': _.rest,
      'random': _.random
    }
  });

  // Evaluate an s-expression `s` in an environment `e`
  // NB: Traditionally called `eval`, we use `compute` to avoid conflict with JavaScript's builtin `eval`
  var compute = function (s, e) {
    var value,
        returnValue,
        msg,
        first,
        cond,
        exp,
        exps,
        proc,
        env,
        params,
        sym;

    e = e || global;

    if (_.isString(s)) { // variable reference
      value = e.get(s);

      if (value !== undefined) {
        return value;
      } else {
        msg = sprintf('symbol "%s" is undefined', s);
        throw new ReferenceError(msg);
      }
    } else if (_.isArray(s)) { // list: we assume it's a form
      first = _.first(s);

      // if (!_.isString(first)) {
      //   msg = sprintf('first element in a form must be a string, not %s', first);
      //   throw new TypeError(msg);
      // }

      switch (first) {
      case 'quote':
        if (s.length !== 2) { throw new RangeError(); }

        return s[1];
      case 'if':
        if (s.length !== 4) { throw new RangeError(); }

        cond = compute(s[1], e);

        if (!_.isBoolean(cond)) { throw new TypeError(sprintf('if form condition must be a boolean, not %s', inspect(cond))); }

        if (cond) {
          return compute(s[2], e);
        } else {
          return compute(s[3], e);
        }
      case 'set':
        if (s.length !== 3) { throw new RangeError(); }

        sym = s[1];
        exp = s[2];

        if (!_.isString(sym)) { throw new TypeError(sprintf('set form first argument must be a symbol, not %s', inspect(sym))); }

        env = e.find(sym);

        if (env) {
          env.set(sym, compute(exp, e));
          return null;
        } else {
          throw new ReferenceError();
        }
      case 'def':
        if (s.length !== 3) { throw new RangeError(); }

        sym = s[1];
        exp = s[2];

        if (!_.isString(sym)) { throw new TypeError(sprintf('def form first argument must be a symbol, not %s', inspect(sym))); }

        e.set(sym, compute(exp, e));
        return null;
      case 'fn':
        if (s.length !== 3) { throw new RangeError(); } 

        params = s[1];
        exp = s[2];

        if (!_.isArray(params)) { throw new TypeError(sprintf('fn form first argument must be an array, not %s', inspect(params))); }
        if (!params.every(function (x) {return _.isString(x);})) { throw new TypeError('fn form: parameter %s is not a string', inspect(x)); }

        return function () {
          var args = Array.prototype.slice.call(arguments, 0);
          return compute(exp, makeEnv(params, args, e));
        }
      case 'do':
        if (s.length < 2) { throw new RangeError(); }

        _.rest(s).forEach(function (exp) { 
          returnValue = compute(exp, e);
        });

        return returnValue;
      default: // (proc exp*)
        exps = s.map(function (exp) {
          return compute(exp, e);
        });
        proc = exps.shift();

        return proc.apply(null, exps);
      }
    } else { // constant literal
      return s;
    }
  };

  var evaluate = function (str, env) {
    return compute(parse(str), env);
  };

  exports.compute = compute;
  exports.evaluate = evaluate;
})(window);