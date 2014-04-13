"use strict";

var Env = function (parms, args, outer) {
  this.outer = outer;
  var dict = {};

  if (parms && args) {
    assertArray(parms);
    assertArray(args);
    assertEqual( parms.length, args.length );

    _.zip(parms, args).forEach(function (parm_arg) {
      var parm = parm_arg[0];
      var arg = parm_arg[1];

      assertDefined( parm );
      assertDefined( arg );

      dict[parm] = arg;
    });
  }

  this.dict = dict;
};

Env.prototype.get = function(parm) {
  assertDefined( parm ); 
  return this.dict[parm];
};

Env.prototype.set = function(parm, arg) {
  assertDefined( parm );
  assertDefined( arg ); 
  this.dict[parm] = arg;
  return null;
};

Env.prototype.find = function(parm) {
  var arg = this.get(parm);
  if (arg) { return this; }
  else {
    if (!this.outer) {
      return null;
    } else {
      return this.outer.find(parm);
    }
  }
};