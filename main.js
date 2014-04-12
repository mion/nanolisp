"use strict";

function Env (parms, args, outer) {
  if (parms && args) {
    _array(parms);
    _array(args);
    _equal( parms.length, args.length );
  }

  this.outer = outer;

  var dict = {};
  var pairs = _.zip(parms, args);

  pairs.forEach(function (parm_arg) {
    var parm = parm_arg[0];
    var arg = parm_arg[1];

    _defined( parm );
    _defined( arg );

    dict[parm] = arg;
  });

  this.dict = dict;
}

Env.prototype.get = function(parm) {
  _defined( parm ); 
  return this.dict[parm];
};

Env.prototype.set = function(parm, arg) {
  _defined( parm );
  _defined( arg ); 
  this.dict[parm] = arg;
};

Env.prototype.find = function(parm) {
  var arg = this.get(parm);
  if (arg) { return this; }
  else {
    if (!this.outer) {
      return undefined;
    } else {
      return this.outer.find(parm);
    }
  }
};
