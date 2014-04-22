(function (exports) {
  'use strict';
  // var global = new Env();

  // var makeLambda = function (env, name, opt, func) {
  //   var wrapper = function (sexps) { 
  //     if (opt.length && (sexps.length !== opt.length)) return errorArgument();

  //     var args = _.map(sexps.value, function (sexp) { return sexp.value; });
  //     var ret = func.apply(this, args);

  //     if (_.isNumber(ret)) return number(ret);
  //     else if (_.isString(ret)) return string(ret);
  //     else if (_.isBoolean(ret)) return bool(ret);
  //     else if (_.isArray(ret)) return array(ret);
  //     else return errorType(); // TODO: dont know how to convert
  //   };

  //   env.dict[name] = lambda(wrapper);
  // };
  // makeLambda(global, "+", {}, function () {
  //   var args = Array.prototype.slice.call(arguments);
  //   return _.reduce(args, function (m, x) { return m + x; }, 0);
  // });
  // makeLambda(global, "*", {}, function () {
  //   var args = Array.prototype.slice.call(arguments);
  //   return _.reduce(args, function (m, x) { return m * x; }, 1);
  // });

  var global = makeEnv({
    context: {}
  });

  // Evaluate an s-expression `s` in an environment `e`
  // NB: Traditionally called `eval`, we use `compute` to avoid conflict with JavaScript's builtin `eval`
  var compute = function (s, e) {
    e = e || global;

    if (_.isString(s)) { // variable reference
      var value = e.get(s);

      if (value) {
        return value;
      } else {
        throw new ReferenceError();
      }
    } else if (_.isArray(s)) { // list
      return null;
    } else { // constant literal
      return s;
    }
  };
  // var compute = function (s, e) { 
  //   e = e || global;
   
  //   if (s.isSymbol()) { // variable reference
  //     var env = e.find(s);

  //     if (env instanceof Env) { // FIXME
  //       var sexp = env.get(s); 
  //       return sexp;
  //     } else {
  //       return env; 
  //     }
  //   } else if (s.isArray()) { // compute it as a form
  //     var first = s.first();

  //     // first element in a form must be a symbol
  //     if (!first.isSymbol()) return errorType(); 
    
  //     // forms
  //     if (first.value === "quote") { // (quote exp)
  //       if (s.value.length !== 2) return errorArgument();

  //       var exp = s.at(1);
  //       return exp;
  //     } else if (first.value === "if") { // (if cond conseq alt)
  //       if (s.value.length !== 4) return errorArgument();

  //       var condition = compute(s.at(1), e);

  //       if (!condition.isBool()) return errorType();

  //       if (condition.value) {
  //         return compute(s.at(2), e);
  //       } else {
  //         return compute(s.at(3), e);
  //       }
  //     } else if (first.value === "set") { // (set var exp)
  //       if (s.value.length !== 3) return errorArgument();

  //       var sym = s.at(1),
  //           exp = s.at(2);

  //       if (!sym.isSymbol()) return errorType();

  //       var env = e.find(sym);

  //       if (env === null) return errorReference();

  //       var computedExp = compute(exp, e);

  //       if (computedExp.isError()) return computedExp;

  //       return env.set(sym, computedExp);
  //     } else if (first.value === "def") { // (def var exp)
  //       if (s.value.length !== 3) return errorArgument();

  //       var sym = s.at(1),
  //           exp = s.at(2);

  //       if (!sym.isSymbol()) return errorType();

  //       var computedExp = compute(exp, e);

  //       if (computedExp.isError()) return computedExp;

  //       return e.set(sym, compute(exp, e));
  //     } else if (first.value === "fn") { // (fn (var*) exp)
  //       if (s.value.length !== 3) return errorArgument();

  //       var parms = s.at(1),
  //           exp = s.at(2);

  //       if (!parms.isArray()) return errorType();
  //       if (!parms.value.every(function (sexp) { return sexp.isSymbol(); })) return errorType();

  //       return lambda(function(args) {
  //         return compute(exp, new Env(parms.value, args.value, e));
  //       });
  //     } else if (first.value === "do") { // (do exp*)
  //       if (s.value.length < 2) return errorArgument();

  //       var val = errorNone(),
  //           sexps = s.rest().value;

  //       sexps.forEach(function (sexp) {
  //         val = compute(sexp, e);
  //       });

  //       return val;
  //     } else { // (proc exp*)
  //       var exps = s.value.map(function (sexp) {
  //         return compute(sexp, e);
  //       });

  //       var proc = exps.shift();
  //       var sexps = array(exps);

  //       return proc.value(sexps);
  //     }
  //   } else {
  //     return s; // constant literal, error
  //   }
  // };

  var evaluate = function (str, env) {
    return compute(parse(str), env);
  };

  exports.compute = compute;
  exports.evalute = evaluate;
})(window);