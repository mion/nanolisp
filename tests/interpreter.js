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

test( "errors", function () { 
  var s1 = array([number(1), number(2)]);

  deepEqual( compute(s1), errorType() , "first element must be a symbol");
});

test( "quote", function () {
  var s1 = array([
    symbol("quote"),
    number(1)
  ]);

  deepEqual( compute(s1), number(1) , "quote constant" );

  var s2 = array([
    symbol("quote"),
    array([
      string("universe"),
      symbol("x"),
      number(42)
    ])
  ]);

  deepEqual( compute(s2), array([string("universe"), symbol("x"), number(42)]) );
  
  // TODO: (quote), (quote 1 2 3) => argument error
});