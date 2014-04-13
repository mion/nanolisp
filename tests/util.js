(function () {
  "use strict";

  module("util");

  test("object.create", function () {
    var parent = {name: "John", age: 25};
    var child = Object.create(parent);
    equal( child.name, "John" );

    parent.name = "Frank";
    equal( child.name, "Frank" );

    child.name = "Bob";
    notEqual( child.name, "Frank" );
  });
})();