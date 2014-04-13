(function () { 
  "use strict";

  QUnit.assert.evl = function(exp, options) {
    var sexp = evaluate(exp, options.env);
    var sexpExpected = null;
    if (options.str) { sexpExpected = string(options.str); }
    if (options.num) { sexpExpected = number(options.num); }
    if (options.sym) { sexpExpected = symbol(options.sym); }
    if (options.err) { sexpExpected = error(options.err); }
    if (options.bool) { sexpExpected = bool(options.bool); }

    var result = sexp.equal(sexpExpected);
    var msg = null;

    if (options.env) {
      msg = sprintf("evalute('%s', %s) equal to %s", exp, options.env.toString(), sexpExpected.toString());
    } else { 
      msg = sprintf("evalute('%s') equal to %s", exp, sexpExpected.toString());
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

  module( "interpreter", {
    setup: function () {
      fx["root"] = new Env(
        [symbol("male")],
        [bool(true)]
      );
      fx["env"] = new Env(
        [symbol("name"), symbol("age")], 
        [string("mion"), number(23)],
        fx["root"]
      );
    },
    teardown: function () {
      delete fx["env"]; 
      delete fx["root"]; 
    }
  });

  test( "constant literals", function (t) {
    t.evl( '"hello"', {str: "hello"} );
    t.evl( '3', {num: 3} );
    t.evl( '-2', {num: -2} );
  });

  test( "variable reference", function (t) {
    t.evl('foo', {err: "reference"});
    t.evl('name', {env: fx.env, str: "mion"});
    t.evl('male', {env: fx.env, bool: true});
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