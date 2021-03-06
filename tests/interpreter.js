(function () {
  'use strict';

  var eq,
      ceq,
      eeq,
      env;

  eq = deepEqual;

  ceq = function (exp, result, env) {
    eq( compute(exp, env), result );
  };

  eeq = function (str, result, env) {
    eq( evaluate(str, env), result );
  };

  module('interpreter', {
    setup: function () {      
      env = makeEnv({
        context: {
          foo: "bar"
        }
      });
    }
  });

  test('constant literal', function () {
    eq( compute(42), 42 );
    eq( compute(-123), -123 );
    eq( compute(false), false );
    eq( compute(true), true );
  });

  test('variable reference', function () {
    throws(
      function () {
        compute('foo');
      },
      ReferenceError
    ); 

    eq( compute('foo', env), 'bar' );
  });

  test('errors', function () {
    throws(
      function () {
        compute([1, 2]);
      },
      TypeError
    );
  });

  test('quote form', function () {
    eq( compute(['quote', 'foo']), 'foo');
    eq( compute(['quote', [123, 'bar']]), [123, 'bar']);
  });

  test('if form', function () {
    eq( compute(['if', true, 123, 456]), 123 );
    eq( compute(['if', false, 123, ['quote', 'yes']]), 'yes' );
    ceq( ['if', true, ['if', false, 123, 'foo'], undefined], 'bar', env );
  });

  test('set form', function () {
    throws(
      function () {
        compute( ['set', 'x', 123] );
      },
      ReferenceError
    );
    ceq( ['set', 'foo', 123], null, env );
    ceq( 'foo', 123, env );
  });

  test('def form', function () {
    ceq( ['def', 'foo', 123], null, env );
    ceq( 'foo', 123, env );
  });

  test('do form', function () {
    ceq( ['do', ['def', 'foo', 123], ['set', 'foo', 456], 'foo'], 456, env );
  });

  test('fn form, procedure call', function () {
    ceq( [['fn', ['x'], ['if', 'x', 123, 456]], true], 123 );
  });

  test('standard lib', function () {
    ceq( ['+', 1, 2, 3], 6 );
    ceq( ['*', 2, 3, 4], 2*3*4 );
    ceq( ['-', 2, 3], 2 - 3 );
    ceq( ['=', 2, 2, ['/', 4, 2]], true );
    ceq( ['>', 3, 2], true );
    ceq( ['<', -1, 0], true );
    eeq('(list? (quote (1 2 3)))', true);
    eeq('(>= 10 (random 0 10))', true);
    eeq('(not (list? 25))', true);
    eeq('(size (quote (1 2 3)))', 3);
    eeq('(first (quote (1 2 3)))', 1);
    eeq('(rest (quote (1 2 3)))', [2, 3]);
    eeq('(list 1 2 3)', [1, 2, 3]);
    eeq('(= (list 2 3) (rest (list 1 2 3)))', true);
    eeq('(push 1 (list 2 3))', [2, 3, 1]);
    eeq('(add 1 (list 2 3))', [1, 2, 3]);
    eeq('(symbol? (quote foo))', true);
  });

})();