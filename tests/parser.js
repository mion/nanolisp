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
  });

  test( "parse", function () {
    eq( parse("1"), 1 );
    eq( parse("-42"), -42 );

    eq( parse("true"), true );
    eq( parse("false"), false );

    eq( parse("\"foo\""), string("foo") );
    // TODO: implement multiple word string parsing
    // eq( parse("\"hello world\""), string("hello world") );
    eq( parse("\"\""), string("") );

    eq( parse("bar"), symbol("bar") );

    eq( parse("()"), array([]) );
    eq( parse("(foo)"), array([ symbol("foo") ]) );
    eq( 
      parse("(foo -8 \"bar\" 5 true)"), 
      array([ symbol("foo"), number(-8), string("bar"), number(5), bool(true) ]) 
    );  
    eq( 
      parse("(-3 \"baz\" (foo (2 3) 4) baz ())"), 
      array([
        number(-3),
        string("baz"),
        array([
          symbol("foo"),
          array([
            number(2),
            number(3)
          ]),
          number(4)
        ]),
        symbol("baz"),
        array([])
      ])
    );
  });

})();