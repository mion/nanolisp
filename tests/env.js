"use strict";

module( "Env" );

test( "new, get and set", function() {
  // [!] Env receives JS Arrays not our "array": rename this to list or something
  var env = new Env([symbol("a"), symbol("b")], [number(1), number(2)]);

  deepEqual( env.get(symbol("a")), number(1) );
  deepEqual( env.get(symbol("b")), number(2) );
  deepEqual( env.get(symbol("c")), errorReference() );

  deepEqual( env.set(symbol("c"), number(3)), errorNone() );
  deepEqual( env.get(symbol("c")), number(3) );
});

test( "find", function () {
  // TODO: maybe Env should only accept symbols as parameters,
  // instead of raw values.

  var root = new Env([symbol("foo")], [number(42)]),
      child = new Env([symbol("bar")], [number(7)], root);

  deepEqual( child.find(symbol("bar")), child );
  deepEqual( child.find(symbol("foo")), root );
  deepEqual( child.find(symbol("baz")), errorReference() );
  // var env1 = new Env(["e", "x"], [5, 0]);
  // var env2 = new Env(["c", "d", "x"], [3, 4, -1], env1);
  // var env3 = new Env(["a", "b"], [1, 2], env2);

  // deepEqual( env2.find("x"), env2 );
  // deepEqual( env2.find("e"), env1 );

  // deepEqual( env3.find("c"), env2 );
  // deepEqual( env3.find("x"), env2 );

  // deepEqual( env3.find("x").get("x"), -1 );
});