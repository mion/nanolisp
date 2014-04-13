"use strict";

module( "Env" );

test( "new, get and set", function() {
  // TODO: Env receives JS Arrays not our "array": rename this to list or something
  var env = new Env([symbol("a"), symbol("b")], [number(1), number(2)]);

  deepEqual( env.get(symbol("a")), number(1) );
  deepEqual( env.get(symbol("b")), number(2) );
  deepEqual( env.get(symbol("c")), errorReference() );

  deepEqual( env.set(symbol("c"), number(3)), errorNone() );
  deepEqual( env.get(symbol("c")), number(3) );
});

test( "find", function () {
  var root = new Env([symbol("foo")], [number(42)]),
      child = new Env([symbol("bar")], [number(7)], root);

  deepEqual( child.find(symbol("bar")), child );
  deepEqual( child.find(symbol("foo")), root );
  deepEqual( child.find(symbol("baz")), errorReference() );
});