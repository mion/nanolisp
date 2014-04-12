var globalEnv = new Env();

// Evaluate an s-expression in an environment
// NB: traditionally called "eval", avoid conflict with JavaScript's own eval
function compute (sexp, env) { 
  assertDefined(sexp);

  env = env || globalEnv;

  // constant literal
  if (sexp.is("String") || sexp.is("Number")) {
    return sexp;
  }

  return nil();
}