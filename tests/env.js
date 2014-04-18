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