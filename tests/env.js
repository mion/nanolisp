(function () {
  'use strict';

  var eq = deepEqual;

  var parent,
      child;

  module('env', {
    setup: function () {
      parent = makeEnv({
        context: {
          name: 'Joao',
          home: 'Rio'
        }
      });

      child = makeEnv({
        context: {
          name: 'Maria'
        },
        outer: parent
      });
    }
  });

  test('init', function () {
    var env = makeEnv(['foo', 'x', 'male'], ['bar', 123, true]);

    eq( env.get('foo'), 'bar' );
    eq( env.get('x'), 123 );
    eq( env.get('male'), true );
  });

  test('get', function () {
    eq( child.get('name'), 'Maria' );
    eq( child.get('home'), 'Rio' );
    eq( parent.get('name'), 'Joao' );
    eq( parent.get('home'), 'Rio' );
  });

  test('set', function () {
    child.set('home', 'Sao Paulo');

    eq( child.get('home'), 'Sao Paulo' );
    eq( parent.get('home'), 'Rio' );
  });

  test('find', function () {
    eq( child.find('home'), parent );
  });

})();