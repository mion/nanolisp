(function () { 
  "use strict";

  var eq = deepEqual;

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

    eq( compute(symbol("one"), env), number(1) );
    eq( compute(symbol("two"), env), number(2) );
    eq( compute(symbol("apple"), env), errorReference() );
    eq( compute(symbol("three"), env), number(3) );
  });

  test( "errors", function () { 
    var s1 = array([number(1), number(2)]);

    eq( compute(s1), errorType() , "first element must be a symbol");
  });

  test( "quote form", function () {
    eq( interpret("(quote foo)"), parse("foo") );
    eq( interpret("(quote 1)"), parse("1") );
    eq( interpret("(quote (1 2 3))"), parse("(1 2 3)") );
    eq( interpret('(quote ("hello world" foo -25))'), parse('("hello world" foo -25)') );
    // TODO: (quote), (quote 1 2 3) => argument error
  });

  test( "if form", function () {
    // eq( interpret("("), )
    ok(true);
  });

})();