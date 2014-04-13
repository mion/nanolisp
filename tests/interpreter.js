(function () { 
  "use strict";

  QUnit.assert.evl = function(exp, options) {
    var env = options.env;
    var sexpExpected = null;

    if (_.has(options, "str")) { sexpExpected = string(options.str); }
    else if (_.has(options, "num")) { sexpExpected = number(options.num); }
    else if (_.has(options, "sym")) { sexpExpected = symbol(options.sym); }
    else if (_.has(options, "err")) { sexpExpected = error(options.err); }
    else if (_.has(options, "bool")) { sexpExpected = bool(options.bool); }
    else { 
      sexpExpected = parse(options); 
      if (arguments.length >= 3) {
        env = arguments[2];
      }
    }

    var sexp = evaluate(exp, env);
    var result = sexp.equal(sexpExpected);
    var msg = null;

    if (env) {
      msg = sprintf("%s (Env: %s) => %s", exp, env.toString(), sexpExpected.toString());
    } else { 
      msg = sprintf("%s => %s", exp, sexpExpected.toString());
    }

    QUnit.push(result, sexp, sexpExpected, msg);
  };  

  QUnit.assert.ref = function(env, name, options) {
    var sexp = env.get(symbol(name));
    var sexpExpected = null;
    if (_.has(options, "str")) { sexpExpected = string(options.str); }
    else if (_.has(options, "num")) { sexpExpected = number(options.num); }
    else if (_.has(options, "sym")) { sexpExpected = symbol(options.sym); }
    else if (_.has(options, "err")) { sexpExpected = error(options.err); }
    else if (_.has(options, "bool")) { sexpExpected = bool(options.bool); }
    else { sexpExpected = parse(options); }

    var result = sexp.equal(sexpExpected);
    var msg = sprintf("Env[:%s] => %s", name, sexpExpected.toString());

    QUnit.push(result, sexp, sexpExpected, msg);
  };

  var eq = deepEqual;

  var fx = {};

  module( "interpreter", {
    setup: function () {
      fx["root"] = new Env(
        [symbol("name"), symbol("male")],
        [string("pg"), bool(true)]
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

    t.evl( '(if male "boy" "girl")', '"boy"', fx.env );
  });

  test( "set form", function (t) {
    t.evl( '(set)', {err:"argument"} );
    t.evl( '(set foo)', {err:"argument"} );
    t.evl( '(set foo bar baz)', {err:"argument"} );
    t.evl( '(set 1 "hi")', {err:"type"} );
    t.evl( '(set foo bar)', {err:"reference"} );

    t.evl( '(set name "Gandalf")', {env: fx.env, err: "none"});
    t.evl( 'name', {env: fx.env, str: "Gandalf"} );
    t.evl( 'name', {env: fx.root, str: "pg"} );

    t.evl( '(set male false)', {env: fx.env, err: "none"} );
    t.ref( fx.env, "male", {err: "reference"});
    t.ref( fx.root, "male", {bool: false});
  });

  test( "def form", function (t) {
    t.evl( '(def)', {err:"argument"} );
    t.evl( '(def foo)', {err:"argument"} );
    t.evl( '(def foo bar baz)', {err:"argument"} );
    t.evl( '(def 1 "hi")', {err:"type"} );
    t.evl( '(def foo bar)', {err:"reference"} );

    t.evl( '(def name "Gandalf")', {env: fx.env, err: "none"});
    t.evl( 'name', {env: fx.env, str: "Gandalf"} );
    t.evl( 'name', {env: fx.root, str: "pg"} );

    t.evl( '(def male false)', {env: fx.env, err: "none"} );
    t.ref( fx.env, "male", {bool: false} );
    t.ref( fx.root, "male", {bool: true} );
  });

  test( "fn form", function (t) {
    t.evl( '(fn)', {err:"argument"} );
    t.evl( '(fn foo)', {err:"argument"} );
    t.evl( '(fn foo bar baz)', {err:"argument"} );
    t.evl( '(fn 1 "hi")', {err:"type"} );
    t.evl( '(fn (x y 5 z) (+ x y z))', {err:"type"} );

    var e = new Env();
    t.evl( '(def id (fn (x) x))', {env: e, err: "none"} );
    eq( e.get(symbol("id")).value(array([number(123)])), number(123) );
  });

})();