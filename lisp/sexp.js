"use strict";

function SExp (x, env) {
  var list = [];

  if (_.isArray(x)) {
    list = x;
  }

  if (_.isString(x)) {
    list.
  }

  this.list = list;
}

var env = new Env(
  ["a", "b", "c"],
  [1, 2, 3]
);

var s1 = new SExp(["a"], env);
eql( s1.compute() == 1 );