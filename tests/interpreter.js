"use strict";

module( "interpreter" );

test( "constant literals", function () {
  var sexpResult1 = compute(string("hello"));
  ok( string("hello").equal(sexpResult1) );

  var sexpResult2 = compute(number(3));
  ok( number(3).equal(sexpResult2) );
});

test( "variable reference", function () {
  var root = new Env(["three"], [number(3)]);
  var env = new Env(["one", "two"], [number(1), number(2)], root);

  deepEqual( compute(symbol("one"), env), number(1) );
  deepEqual( compute(symbol("two"), env), number(2) );
  deepEqual( compute(symbol("apple"), env), errorUnknownSymbol() );
  deepEqual( compute(symbol("three"), env), number(3) );
});