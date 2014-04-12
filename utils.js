function print (msg) {
  console.log("[*] " + msg);
}

function assertDefined (x) {
  if (x == "undefined") {
    throw new Error("assertion failed: " + x + " is undefined");
  }
}

function assertEqual (x, y) {
  if (x !== y) {
    throw new Error("assertion failed: " + x + " !== " + y);
  }
}

function assertInstanceOf (x, proto) {
  if ( !(x instanceof proto) ) {
    throw new Error("assertion failed: " + x + " is not an instance of '" + proto + "'");
  }
}

function assertArray (x) {
  assertDefined(x);
  
  if (!_.isArray(x)) {
    throw new Erro("assertion failed: " + x + "is not an Array");
  }
}

///////// POLYFILLS

// attach the .compare method to Array's prototype to call it on any array
Array.prototype.compare = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].compare(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}