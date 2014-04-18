(function () {
  'use strict';

  module('s-expression');

  test('array methods', function () {
    ok( true );
  });

})();

// "use strict";

// module( "SExp" );

// test( "equality", function () {
//   var sym1 = symbol("foo"),
//       sym2 = symbol("bar");

//   ok( ! sym1.equal(sym2) );
//   ok( sym1.equal(symbol("foo")) );

//   var str1 = string("hello"),
//       str2 = string("bye");

//   ok( ! str1.equal(str2) );
//   ok( str1.equal(string("hello")) );

//   var num1 = number(13),
//       num2 = number(42);

//   ok( ! num1.equal(num2) );
//   ok( num1.equal(number(13)) );

//   // [!] Be careful with this: an sexp is an array of other sexps,
//   // NOT raw values!
//   var ary1 = array([ symbol("foo"), number(3), string("hello") ]);    
//   var ary2 = array([ symbol("foo"), number(3), string("hello") ]);
//   var ary3 = array([ symbol("foo"), number(2), string("hi") ]);

//   ok( ary1.equal(ary2) );
//   ok( ! ary1.equal(ary3) );

//   // (lambda (x) (* x 2))
//   var ary4 = array([ symbol("lambda"), array([ symbol("x") ]), array([ symbol("*"), symbol("x"), number(2) ]) ]);
//   var ary5 = array([ symbol("lambda"), array([ symbol("x") ]), array([ symbol("*"), symbol("x"), number(2) ]) ]);

//   ok( ary4.equal(ary5) );
//   ok( !ary4.equal(ary1) );
// });

// test("list methods", function () {
//   var s1 = array([number(1), number(2), number(3)]);

//   deepEqual( s1.first(), number(1) );
//   deepEqual( s1.at(1), number(2) );
//   deepEqual( s1.at(2), number(3) );
//   deepEqual( s1.rest(), array([number(2), number(3)]) );

//   var s2 = string("hi");
//   deepEqual( s2.first(), errorType() );
//   deepEqual( s2.rest(), errorType() );
// });

// // helpers
// function equalSexp (s1, s2) {
//   if (s1.equal(s2)) {
//     ok( true );
//   } else {
//     console.log(s1);
//     console.log(s2);
//     ok( false );
//   }
// }