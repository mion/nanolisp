(function () { 
  "use strict";

  QUnit.assert.evl = function(options) {
    var sexp = evaluate(options.exp, options.env);
    var sexpExpected = null;
    if (options.str) { sexpExpected = string(options.str); }
    if (options.num) { sexpExpected = number(options.num); }
    if (options.sym) { sexpExpected = symbol(options.sym); }
    if (options.err) { sexpExpected = error(options.err); }
    if (options.bool) { sexpExpected = bool(options.bool); }

    var result = sexp.equal(sexpExpected);
    var msg = null;

    if (options.env) {
      msg = sprintf("evalute('%s', %s) equal to %s", options.exp, options.env.toString(), sexpExpected.toString());
    } else { 
      msg = sprintf("evalute('%s') equal to %s", options.exp, sexpExpected.toString());
    }

    QUnit.push(result, sexp, sexpExpected, msg);
  };

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

  var fx = {};
  // t.str1 = string("hello");
  // t.str2 = string("hi");
  // t.str3 = string("bye");

  // t.sym1 = symbol("foo");
  // t.sym2 = symbol("bar");
  // t.sym3 = symbol("baz");

  // t.num1 = number(1);
  // t.num2 = number(2);
  // t.num3 = number(3);

  module( "interpreter", {
    setup: function () {
      fx["env"] = new Env(
        [symbol("name"), symbol("age"), symbol("male")], 
        [string("mion"), number(23), bool(true)]
      );
    },
    teardown: function () {
      delete fx["env"]; 
    }
  });

  test( "constant literals", function (assert) {
    assert.evl({exp: '"hello"', str: "hello"});
    assert.evl({exp: '3', num: 3 });
    assert.evl({exp: '-2', num: -2 });
    assert.evl({exp: 'foo', err: "reference" });
    assert.evl({exp: 'name', env: fx.env, str: "mion" });
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