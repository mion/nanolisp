"use strict";

var globalEnv = new Env();

// Evaluate an s-expression `s` in an environment `e`
// NB: traditionally called "eval", avoid conflict with JavaScript's own eval
var compute = function(s, e) { 
  assertDefined(s);
  assertInstanceOf(s, Sexp);

  e = e || globalEnv;
 
  if (s.isSymbol()) { // variable reference
    var env = e.find(s);

    if (env instanceof Env) { // FIXME
      var sexp = env.get(s); 
      return sexp;
    } else {
      return env; 
    }
  } else if (s.isArray()) { // compute it as a form
    var first = s.first();

    // first element in a form must be a symbol
    if (!first.isSymbol()) return errorType(); 
  
    // forms
    if (first.value === "quote") { // (quote exp)
      if (s.value.length !== 2) return errorArgument();

      var exp = s.at(1);
      return exp;
    } else if (first.value === "if") { // (if cond conseq alt)
      if (s.value.length !== 4) return errorArgument();

      var condition = compute(s.at(1), e);

      if (!condition.isBool()) return errorType();

      if (condition.value) {
        return compute(s.at(2), e);
      } else {
        return compute(s.at(3), e);
      }
    } else if (first.value === "set") { // (set var exp)
      if (s.value.length !== 3) return errorArgument();

      var sym = s.at(1),
          exp = s.at(2);

      if (!sym.isSymbol()) return errorType();

      var env = e.find(sym);

      if (env === null) return errorReference();

      var computedExp = compute(exp, e);

      if (computedExp.isError()) return computedExp;

      return env.set(sym, computedExp);
    } else if (first.value === "def") { // (def var exp)
      if (s.value.length !== 3) return errorArgument();

      var sym = s.at(1),
          exp = s.at(2);

      if (!sym.isSymbol()) return errorType();

      var computedExp = compute(exp, e);

      if (computedExp.isError()) return computedExp;

      return e.set(sym, compute(exp, e));
    } else if (first.value === "fn") { // (fn (var*) exp)
      if (s.value.length !== 3) return errorArgument();

      var parms = s.at(1),
          exp = s.at(2);

      if (!parms.isArray()) return errorType();
      if (!parms.value.every(function (sexp) { return sexp.isSymbol(); })) return errorType();

      return lambda(function(args) {
        // console.log(exp);
        // console.log(parms);
        // console.log(args);
        // console.log(e);
        // var args = [];
        // for (var i = 0; i < arguments.length; i++) {
        //   args[i] = arguments[i];
        // };
        return compute(exp, new Env(parms.value, args.value, e));
      });
    }
  } else {
    return s; // constant literal, error
  }
};

var evaluate = function (str, env) {
  return compute(parse(str), env);
};