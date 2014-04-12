(function () {
  "use strict";

  test( "S-expressions", function () {
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

    // be careful with this: an sexp is an array of other sexps
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

  test( "Env new, get and set", function() {
    var env = new Env(["a", "b"], [1, 2]);

    deepEqual( env.get("a"), 1 );
    deepEqual( env.get("b"), 2 );

    env.set("c", 3);
    deepEqual( env.get("c"), 3 );
  });

  test( "Env find", function () {
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
    var sexpString = compute(string("hello"));
    ok( string("hello").equal(sexpString) );

    var sexpNumber = compute(number(3));
    ok( number(3).equal(sexpNumber) );
  });

})();