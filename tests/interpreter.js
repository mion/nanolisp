(function () { 
  "use strict";

  var eq = deepEqual;
  var ieq = function (str, outcome, msg) {
    return eq( evaluate(str), outcome, msg );
  };
  var eeq = function (env, name, exp, msg) {
    var sym = symbol(name);
    return eq( env.find(sym).get(sym), exp, msg );
  };

  var mkenv = function (dict, outer) {
    var env = new Env(null, null, outer);
    env.dict = dict;

    return env;
  };

  module( "interpreter" );

  test( "constant literals", function () {
    var sexpResult1 = compute(string("hello"));
    ok( string("hello").equal(sexpResult1) );

    var sexpResult2 = compute(number(3));
    ok( number(3).equal(sexpResult2) );
  });

  test( "variable reference", function () {
    var root = new Env([symbol("three")], [number(3)]);
    var env = new Env([symbol("one"), symbol("two")], [number(1), number(2)], root);

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
    eq( evaluate('(quote)'), errorArgument() );
    eq( evaluate('(quote foo bar)'), errorArgument() );

    eq( evaluate("(quote foo)"), parse("foo") );
    eq( evaluate("(quote 1)"), parse("1") );

    eq( evaluate("(quote (1 2 3))"), parse("(1 2 3)") );
    eq( evaluate('(quote ("hello world" foo -25))'), parse('("hello world" foo -25)') );
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

    var env = new Env([symbol('name'), symbol('age')], [string("Gabriel"), number(23)]);

    eq( evaluate('(set name foo)', env), errorReference() );

    var r1 = evaluate('(set name "Gandalf")', env);
    ok( r1.isNone() );
    eeq( env, 'name', string("Gandalf") );

    var r2 = evaluate('(set age 999)', env);
    ok( r2.isNone() );
    eeq( env, 'age', number(999) );
    eeq( env, 'name', string("Gandalf") );
    eeq( env, 'name', string("Gandalf") );
  });

  test( "def form", function () {
    ieq( '(def)', errorArgument() );
    ieq( '(def foo)', errorArgument() );
    ieq( '(def 1 bar)', errorType() );
    // ieq( '(def foo bar)', errorReference() );
  });

})();