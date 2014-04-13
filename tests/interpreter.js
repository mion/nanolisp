(function () { 
  "use strict";

  QUnit.assert.evl = function(exp, options) {
    var sexp = evaluate(exp, options.env);
    var sexpExpected = null;
    if (options.str) { sexpExpected = string(options.str); }
    else if (options.num) { sexpExpected = number(options.num); }
    else if (options.sym) { sexpExpected = symbol(options.sym); }
    else if (options.err) { sexpExpected = error(options.err); }
    else if (options.bool) { sexpExpected = bool(options.bool); }
    else { sexpExpected = parse(options); }

    var result = sexp.equal(sexpExpected);
    var msg = null;

    if (options.env) {
      msg = sprintf("%s (Env: %s) => %s", exp, options.env.toString(), sexpExpected.toString());
    } else { 
      msg = sprintf("%s => %s", exp, sexpExpected.toString());
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
    t.evl( 'foo', {err: "reference"} );
    t.evl( 'name', {env: fx.env, str: "mion"} );
    t.evl( 'male', {env: fx.env, bool: true} );
  });

  test( "errors", function (t) { 
    t.evl( '(1 2)', {err: "type"} );
  });

  test( "quote form", function (t) {
    t.evl( '(quote)', {err: "argument"} );
    t.evl( '(quote foo bar)', {err: "argument"} );

    t.evl( '(quote foo)', {sym: "foo"} );
    t.evl( '(quote 1)', {num: 1} );
    t.evl( '(quote -429)', {num: -429} );

    t.evl( '(quote (1 2 3))', '(1 2 3)' );

    t.evl( '(quote ("hello" foo -25))', '("hello" foo -25)' );
  });

  test( "if form", function (t) {
    t.evl( '(if)', {err: "argument"} );
    t.evl( '(if true "hi")', {err: "argument"} );
    t.evl( '(if 1 "y" "n")', {err: "type"} );

    t.evl( '(if true "yes" "no")', {str: 'yes'} );
    t.evl( '(if false "yes" 123)', {num: 123} );

    t.evl( '(if true foo 123)', {err: "reference"} );
    t.evl( '(if false foo 123)', {num: 123} );
  });

  test( "set form", function (t) {
    t.evl( '(set)', {err:"argument"} );
    t.evl( '(set foo)', {err:"argument"} );
    t.evl( '(set 1 "hi")', {err:"type"} );
    t.evl( '(set foo bar)', {err:"reference"} );

    t.evl( '(set name "Gandalf")', {env: fx.env, err: "none"});

    // var r1 = evaluate('(set name "Gandalf")', env);
    // ok( r1.isNone() );
    // eeq( env, 'name', string("Gandalf") );

    // var r2 = evaluate('(set age 999)', env);
    // ok( r2.isNone() );
    // eeq( env, 'age', number(999) );
    // eeq( env, 'name', string("Gandalf") );
    // eeq( env, 'name', string("Gandalf") );
  });

  test( "def form", function () {
    ok(true);
    // ieq( '(def)', errorArgument() );
    // ieq( '(def foo)', errorArgument() );
    // ieq( '(def 1 bar)', {err:"type"} );
    // ieq( '(def foo bar)', {err:"reference"} );
  });

})();