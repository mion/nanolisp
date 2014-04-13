"use strict";

var Env = function (parms, args, outer) {
  this.outer = outer;
  var dict = {};

  if (parms && args) {
    // assertArray(parms);
    // assertArray(args);
    // assertEqual( parms.length, args.length );

    _.zip(parms, args).forEach(function (parm_arg) {
      var parm = parm_arg[0];
      var arg = parm_arg[1];

      // assertDefined( parm );
      // assertDefined( arg );
      // assert( parm.isSymbol() );

      dict[parm.value] = arg;
    });
  }

  this.dict = dict;
};

Env.prototype.get = function(parm) {
  if (this.dict[parm.value]) {
    return this.dict[parm.value];
  } else {
    return errorReference();
  }
};

Env.prototype.set = function(sym, sexp) {
  this.dict[sym.value] = sexp;
  return errorNone();
};

Env.prototype.find = function(sym) {
  var sexp = this.get(sym);

  if (sexp.isError()) {
    if (!this.outer) {
      return errorReference();
    } else {
      return this.outer.find(sym);
    }
  } else {
    return this;
  }
};