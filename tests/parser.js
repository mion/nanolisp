"use strict";

module( "parser" );

test( "tokens", function () {
  deepEqual( tokenize('(foo (bar) 2)'), ['(', 'foo', '(', 'bar', ')', '2', ')'] );
  deepEqual( tokenize(' (foo bar baz )'), ["(", "foo", "bar", "baz", ")"] );
});

test( "atoms", function () {
  deepEqual( atom("0"), number(0) );
  deepEqual( atom("-1"), number(-1) );
  deepEqual( atom("+429"), number(429) );

  deepEqual( atom("foo"), symbol("foo") );

  deepEqual( atom("\"foo\""), string("foo") );
  deepEqual( atom("\"hello world\""), string("hello world") );
  deepEqual( atom("\"f\""), string("f") );
  deepEqual( atom("\"\""), string("") );

  deepEqual( atom("true"), bool(true) );
  deepEqual( atom("false"), bool(false) );
});

test( "parse", function () {
  deepEqual( parse("1"), number(1) );
  deepEqual( parse("-42"), number(-42) );

  deepEqual( parse("true"), bool(true) );
  deepEqual( parse("false"), bool(false) );

  deepEqual( parse("\"foo\""), string("foo") );
  deepEqual( parse("\"\""), string("") );

  deepEqual( parse("bar"), symbol("bar") );

  deepEqual( parse("()"), array([]) );
  deepEqual( parse("(foo)"), array([ symbol("foo") ]) );
  deepEqual( 
    parse("(foo -8 \"bar\" 5 true)"), 
    array([ symbol("foo"), number(-8), string("bar"), number(5), bool(true) ]) 
  );  
  deepEqual( 
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