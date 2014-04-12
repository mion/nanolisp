(function () {
  "use strict";

  var eql = deepEqual;

  test( "Env", function() {
    var env = new Env(["foo", "bar"], [1, 2]);

    eql( env.dict["foo"], 1 );
    eql( env.dict["bar"], 2 );
  });
})();
