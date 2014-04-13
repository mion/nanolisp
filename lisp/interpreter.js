"use strict";

var globalEnv = new Env();

// Evaluate an s-expression `s` in an environment `e`
// NB: traditionally called "eval", avoid conflict with JavaScript's own eval
function compute (s, e) { 
  assertDefined(s);
  assertInstanceOf(s, Sexp);

  e = e || globalEnv;
 
  if (s.isSymbol()) { // variable reference
    var env = e.find(s.value);

    if (env !== null) {
      var sexp = env.get(s.value); 
      return sexp;
    } else {
      return errorReference();
    }
  } else if (s.isArray()) { // interpret is as a form
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
    }
  } else {
    return s; // constant literal, error
  }
}

var interpret = function (str) {
  return compute(parse(str));
};