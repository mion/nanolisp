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
  deepEqual( compute(symbol("apple"), env), errorReference() );
  deepEqual( compute(symbol("three"), env), number(3) );
});

test( "errors", function () { 
  var s1 = array([number(1), number(2)]);

  deepEqual( compute(s1), errorType() , "first element must be a symbol");
});

test( "quote form", function () {
  deepEqual( interpret("(quote foo)"), parse("foo") );
  deepEqual( interpret("(quote 1)"), parse("1") );
  deepEqual( interpret("(quote (1 2 3))"), parse("(1 2 3)") );
  deepEqual( interpret('(quote ("hello world" foo -25))'), parse('("hello world" foo -25)') );
  // TODO: (quote), (quote 1 2 3) => argument error
});

test( "if form", function () {
  ok( true );
});