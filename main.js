"use strict";

function Env (parms, args, outer) {
  if (parms && args) { _equal( parms.length, args.length ); }

  this.outer = outer || null;

  var dict = {};
  var pairs = _.zip(parms, args);

  pairs.forEach(function (parm_arg) {
    var parm = parm_arg[0];
    var arg = parm_arg[1];

    _ok( parm );
    _ok( arg );

    dict[parm] = arg;
  });

  this.dict = dict;
}

Env.prototype.get = function(parm) {
  _ok( parm );
  return this.dict[parm];
};

Env.prototype.set = function(parm, arg) {
  _ok( parm ); _ok( arg ); 
  this.dict[parm] = arg;
};

Env.prototype.find = function(parm) {
  var arg = this.get(parm);
  if (arg) { return arg; }
  else {
    if (!this.outer) {
      return null;
    } else {
      return this.outer.find(parm);
    }
  }
};