(function () {
  'use strict';

  module('util');

  test('Object.create', function () {
    var parent = {name: 'John', age: 25};
    var child = Object.create(parent);
    equal( child.name, 'John' );

    parent.name = 'Frank';
    equal( child.name, 'Frank' );

    child.name = 'Bob';
    notEqual( child.name, 'Frank' );
  });

  test('Prototypal inheritance', function () {
    var myMammal = {
      name : 'Herb the Mammal',
      get_name : function () {
        return this.name;
      },
      says : function () {
        return this.saying || '';
      }
    };

    var myCat = Object.create(myMammal);
    myCat.name = 'Henrietta';
    myCat.saying = 'meow';
    myCat.purr = function (n) {
      var i, s = '';
      for (i = 0; i < n; i+= 1) {
        if (s) {
          s += '-';
        }
        s += 'r';
      }
      return s;
    };
    myCat.get_name = function () {
      return this.says() + ' ' + this.name + ' ' + this.says();
    };

    equal( myCat.get_name(), "meow Henrietta meow" );
  });

  test('Functional inheritance', function () {
    // BOILERPLATE
    // var constructor = function (spec, my) {
    //   var that, other private instance variables; 
    //   my = my || {};
    //
    //   Add shared variables and functions to my 
    //
    //   that = a new object;
    //
    //   Add privileged methods to that
    //
    //   return that;
    // };

    var mammal = function (spec) {
      var that = {};

      that.get_name = function () {
        return spec.name;
      };

      that.says = function () {
        return spec.saying || '';
      };

      return that;
    };

    var myMammal = mammal({name: 'Herb'});

    var cat = function (spec) {
      spec.saying = spec.saying || 'meow';

      var that = mammal(spec);

      that.purr = function (n) {
        var i, s = '';
        for (i = 0; i < n; i += 1) {
          if (s) {
            s += '-';
          }
          s += 'r';
        }
        return s;
      };

      that.get_name = function () {
        return that.says() + ' ' + spec.name + ' ' + that.says();
      };

      return that;
    };

    var myCat = cat({name: 'Henrietta'});

    var coolcat = function (spec) {
      var that = cat(spec),
          super_get_name = that.superior('get_name');

      that.get_name = function (n) {
        return 'like ' + super_get_name() + ' baby';
      };

      return that;
    };

    var myCoolCat = coolcat({name: 'Bix'});

    equal( myCoolCat.get_name(), 'like meow Bix meow baby' );
  });

  test('Composition', function () {
    ok(true);
  });

})();