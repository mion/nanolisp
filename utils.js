var print = function (msg) {
  console.log("[*] " + msg);
};

var assert = function (exp) {
  if (!exp) {
    throw new Error("assertion failed");
  }
};

if (typeof Object.create !== 'function') {
  Object.create = function (o) {
    var F = function () {};
    F.prototype = o;
    return new F();
  };
}

Function.prototype.method = function (name, func) {
  if (!this.prototype[name]) {
    this.prototype[name] = func;
  } else {
    throw new Error(sprintf("augmentation conflict on method '%s'", name));
  }
};

Object.method('superior', function (name) {
  var that = this,
      method = that[name];
  return function () {
    return method.apply(that, arguments);
  };
});

Number.method('integer', function () {
  return Math[this < 0 ? 'ceiling' : 'floor'](this);
});

Array.method('compare', function (array) {
  // if the other array is a falsy value, return
  if (!array) return false;

  // compare lengths - can save a lot of time
  if (this.length != array.length) return false;

  for (var i = 0, l=this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].compare(array[i])) { 
        return false; 
      }
    } else if (this[i] != array[i]) {
        // Warning - two different object instances will never be equal: {x:20} != {x:20}
        return false;
    }
  }

  return true;
});