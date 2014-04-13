(function () {
  "use strict";

  function equalSexp (s1, s2) {
    if (s1.equal(s2)) {
      ok( true );
    } else {
      console.log(s1);
      console.log(s2);
      ok( false );
    }
  }

  // QUnit.assert.equalSexp = function( sexp1, sexp2, message ) {
  //   var result = false;

  //   if (sexp1.equal(sexp2)) {
  //     result = true;
  //   } else {
  //     print(sexp1 + " is not equal to " + sexp2);
  //     print(sexp1);
  //     print(sexp2);
  //   }

  //   QUnit.push(result, result, sexp1, sexp2, message);
  // };

  module( "SExp" );
  test( "equality", function () {
    var sym1 = symbol("foo"),
        sym2 = symbol("bar");

    ok( ! sym1.equal(sym2) );
    ok( sym1.equal(symbol("foo")) );

    var str1 = string("hello"),
        str2 = string("bye");

    ok( ! str1.equal(str2) );
    ok( str1.equal(string("hello")) );

    var num1 = number(13),
        num2 = number(42);

    ok( ! num1.equal(num2) );
    ok( num1.equal(number(13)) );

    // [!] Be careful with this: an sexp is an array of other sexps,
    // NOT raw values!
    var ary1 = array([ symbol("foo"), number(3), string("hello") ]);    
    var ary2 = array([ symbol("foo"), number(3), string("hello") ]);
    var ary3 = array([ symbol("foo"), number(2), string("hi") ]);

    ok( ary1.equal(ary2) );
    ok( ! ary1.equal(ary3) );

    // (lambda (x) (* x 2))
    var ary4 = array([ symbol("lambda"), array([ symbol("x") ]), array([ symbol("*"), symbol("x"), number(2) ]) ]);
    var ary5 = array([ symbol("lambda"), array([ symbol("x") ]), array([ symbol("*"), symbol("x"), number(2) ]) ]);

    ok( ary4.equal(ary5) );
    ok( !ary4.equal(ary1) );
  });
  test("first, rest", function () {
    ok( true );
  });

  module( "Env" );
  test( "new, get and set", function() {
    var env = new Env(["a", "b"], [1, 2]);

    deepEqual( env.get("a"), 1 );
    deepEqual( env.get("b"), 2 );

    env.set("c", 3);
    deepEqual( env.get("c"), 3 );
  });
  test( "find", function () {
    // TODO: maybe Env should only accept symbols as parameters,
    // instead of raw values.
    var env1 = new Env(["e", "x"], [5, 0]);
    var env2 = new Env(["c", "d", "x"], [3, 4, -1], env1);
    var env3 = new Env(["a", "b"], [1, 2], env2);

    deepEqual( env2.find("x"), env2 );
    deepEqual( env2.find("e"), env1 );

    deepEqual( env3.find("c"), env2 );
    deepEqual( env3.find("x"), env2 );

    deepEqual( env3.find("x").get("x"), -1 );
  });

  module( "compute" );
  test( "constant literals", function () {
    var sexpResult1 = compute(string("hello"));
    ok( string("hello").equal(sexpResult1) );

    var sexpResult2 = compute(number(3));
    ok( number(3).equal(sexpResult2) );
  });

  test( "variable reference", function () {
    var globalEnv = new Env(["three"], [number(3)]);
    var env = new Env(["one", "two"], [number(1), number(2)], globalEnv);

    deepEqual( compute(symbol("one"), env), number(1) );
    deepEqual( compute(symbol("two"), env), number(2) );
    deepEqual( compute(symbol("apple"), env), errorUnknownSymbol() );
    deepEqual( compute(symbol("three"), env), number(3) );
  });

})();