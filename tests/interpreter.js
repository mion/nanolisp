(function () { 
  "use strict";

  var eq = deepEqual;
  var ieq = function (str, outcome, msg) {
    return eq( interpret(str), outcome, msg );
  };

  module( "interpreter" );

  test( "constant literals", function () {
    var sexpResult1 = compute(string("hello"));
    ok( string("hello").equal(sexpResult1) );

    var sexpResult2 = compute(number(3));
    ok( number(3).equal(sexpResult2) );
  });

  test( "variable reference", function () {
    var root = new Env(["three"], [number(3)]);
    var env = new Env(["one", "two"], [number(1), number(2)], root);

    eq( compute(symbol("one"), env), number(1) );
    eq( compute(symbol("two"), env), number(2) );
    eq( compute(symbol("apple"), env), errorReference() );
    eq( compute(symbol("three"), env), number(3) );
  });

  test( "errors", function () { 
    var s1 = array([number(1), number(2)]);

    eq( compute(s1), errorType() , "first element must be a symbol");
  });

  test( "quote form", function () {
    eq( interpret('(quote)'), errorArgument() );
    eq( interpret('(quote foo bar)'), errorArgument() );

    eq( interpret("(quote foo)"), parse("foo") );
    eq( interpret("(quote 1)"), parse("1") );

    eq( interpret("(quote (1 2 3))"), parse("(1 2 3)") );
    eq( interpret('(quote ("hello world" foo -25))'), parse('("hello world" foo -25)') );
  });

  test( "if form", function () {
    ieq( '(if)', errorArgument() );
    ieq( '(if true "hi")', errorArgument(), "if takes 4 arguments" );
    ieq( '(if 1 "y" "n")', errorType(), "if condition must be true/false" );

    ieq( '(if true "yes" "no")', parse('"yes"') );
    ieq( '(if false "yes" 123)', parse('123') );

    ieq( '(if true foo 123)', errorReference() );
    ieq( '(if false foo 123)', parse('123') );
  });

  test( "set form", function () {
    ieq( '(set)', errorArgument() );
    ieq( '(set foo)', errorArgument() );
    ieq( '(set 1 "hi")', errorType() );
    ieq( '(set foo bar)', errorReference() );

    var env = new Env(['name', 'age'], ["Gabriel", 23]),
        s1 = parse('(set name "Gandalf")'),
        s2 = parse('(set age 999)');

    var r1 = compute(s1, env);
    ok( r1.isNone() );
    eq( env.find('name').get('name'), string("Gandalf") );

    var r2 = compute(s2, env);
    ok( r2.isNone() );
    eq( env.find('age').get('age'), number(999) );
    eq( env.find('name').get('name'), string("Gandalf") );
  });

})();