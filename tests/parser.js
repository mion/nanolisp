(function () {
  'use strict';

  var eq = deepEqual;

  module( 'parser' );

  test( 'atomize', function () {
    eq( atomize('0'), 0 );
    eq( atomize('-1'), -1 );
    eq( atomize('+429'), 429 );

    eq( atomize('foo'), 'foo' );

    // TODO: literal strings
    // eq( atomize('"foo"'), 'foo' );
    // eq( atomize('"hello world"'), 'hello world' );
    // eq( atomize('"f"'), 'f' );
    // eq( atomize('""'), '' );

    eq( atomize("true"), true );
    eq( atomize("false"), false );
  });

  test( "tokens", function () {
    eq( tokenize('(foo (bar) 2)'), ['(', 'foo', '(', 'bar', ')', '2', ')'] );
    eq( tokenize(' (foo bar baz )'), ["(", "foo", "bar", "baz", ")"] );
    eq( tokenize('(+ 5 -1)'), ["(", "+", "5", "-1", ")"] );
  });

  test( "parse atoms", function () {
    eq( parse("1"), 1 );
    eq( parse("-42"), -42 );
    eq( parse("true"), true );
    eq( parse("false"), false );
    eq( parse("foo"), "foo" );
  });
    // TODO: implement multiple word string parsing
    // eq( parse("\"hello world\""), string("hello world") );
    // eq( parse("\"\""), string("") );

    // eq( parse("bar"), symbol("bar") );

  test('parse lists', function () {
    eq( parse('()'), [] );
    eq( parse('(foo)'), ['foo'] );
    eq( parse("(foo -8 bar 5 true)"), ['foo', -8, 'bar', 5, true] );
    eq( 
      parse("(+123 foo (bar (+ 2 3) -40) baz ())"),
      [123, 'foo', ['bar', ['+', 2, 3], -40], 'baz', []]
    );
    eq( 
      parse("(() () (()))"),
      [[], [], [[]]]
    );
  });

})();