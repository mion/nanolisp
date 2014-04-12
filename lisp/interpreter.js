var globalEnv = new Env();

// Evaluate an s-expression in an environment
// NB: traditionally called "eval", avoid conflict with JavaScript's own eval
function compute (sexp, env) { 
  assertDefined(sexp);

  env = env || globalEnv;
 
  if (sexp.is("String") || sexp.is("Number")) { // constant literal
    return sexp;
  } else if (sexp.is("Symbol")) { // variable reference
    var e = env.find(sexp.value);
    return e.get(sexp.value);
  } else {
    return nil();
  }
}