"use strict";

var globalEnv = new Env();

// Evaluate an s-expression `s` in an environment `e`
// NB: traditionally called "eval", avoid conflict with JavaScript's own eval
function compute (s, e) { 
  assertDefined(s);
  assertInstanceOf(s, Sexp);

  e = e || globalEnv;
 
  if (s.isString() || s.isNumber()) { // constant literal
    return s;
  } else if (s.isSymbol()) { // variable reference
    var env = e.find(s.value);

    if (env !== null) {
      var sexp = env.get(s.value); 
      return sexp;
    } else {
      return errorUnknownSymbol();
    }
  } else if (s.isArray()) { // interpret is as a form
    var first = s.first();

    // first element in a form must be a symbol
    if (!first.isSymbol()) return errorType(); 

    // (quote exp) => exp
    if (first.value === "quote") {
      var exp = s.rest();
      return exp;
    }
  } else {
    // TODO: what should we do here?
    // return errorType();
    throw new TypeError("s-expression has type: " + s.type);
  }
}