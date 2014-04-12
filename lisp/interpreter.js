var globalEnv = new Env();

// Evaluate an s-expression `s` in an environment `e`
// NB: traditionally called "eval", avoid conflict with JavaScript's own eval
function compute (s, e) { 
  assertDefined(s);
  assertInstanceOf(s, Sexp);

  e = e || globalEnv;
 
  if (s.is("String") || s.is("Number")) { // constant literal
    return s;
  } else if (s.is("Symbol")) { // variable reference
    var env = e.find(s.value);
    var sexp = env.get(s.value);

    return sexp;
  }
}