(function () {
  "use strict";

  test( "S-expressions", function () {
    var sym1 = symbol("foo");
    var sym2 = symbol("bar");

    ok( ! sym1.equal(sym2) );
    ok( sym1.equal(symbol("foo")) );
  });

  test( "Env new, get and set", function() {
    var env = new Env(["a", "b"], [1, 2]);

    deepEqual( env.get("a"), 1 );
    deepEqual( env.get("b"), 2 );

    env.set("c", 3);
    deepEqual( env.get("c"), 3 );
  });

  test( "Env find", function () {
    var env1 = new Env(["e", "x"], [5, 0]);
    var env2 = new Env(["c", "d", "x"], [3, 4, -1], env1);
    var env3 = new Env(["a", "b"], [1, 2], env2);

    deepEqual( env2.find("x"), env2 );
    deepEqual( env2.find("e"), env1 );

    deepEqual( env3.find("c"), env2 );
    deepEqual( env3.find("x"), env2 );

    deepEqual( env3.find("x").get("x"), -1 );
  });

  test( "compute", function () {
    ok( true );
  });

})();