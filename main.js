"use strict";

function Env (parms, args, outer) {
  assert( parms.length == args.length );

  this.outer = outer || null;

  var dict = {};
  var pairs = _.zip(parms, args);

  _.each(pairs, function (parm_arg) {
    var parm = parm_arg[0];
    var arg = parm_arg[1];

    assert( parm );

    dict[parm] = arg;
  });

  this.dict = dict;
}
