(function () {
  "use strict";

  module( "Env" );
  test( "new, get and set", function() {
    var env = new Env(["a", "b"], [1, 2]);

    deepEqual( env.get("a"), 1 );
    deepEqual( env.get("b"), 2 );

    env.set("c", 3);
    deepEqual( env.get("c"), 3 );
  });
  test( "outer", function () {
    var env1 = new Env(["d"], [4]);
    var env2 = new Env(["c"], [3], env1);
    var env3 = new Env(["a", "b"], [1, 2], env2);

    deepEqual( env3.find("c"), 3 );
    deepEqual( env3.find("d"), 4 );

    deepEqual( env2.find("d"), 4 );

    deepEqual( env1.find("a"), null );
  });

})();