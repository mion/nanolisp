function print (msg) {
  console.log("[*] " + msg);
}

// Functions prefixed with "_" are all error throwing assertions
function _defined (x) {
  if (x == "undefined") {
    throw new Error("assertion failed: " + x + " is undefined");
  }
}

function _equal (x, y) {
  if (x !== y) {
    throw new Error("assertion failed: " + x + " !== " + y);
  }
}

function _type (x, type) {
  if (typeof x !== type) {
    throw new Error("assertion failed: type of " + x + " !== '" + type + "'");
  }
}

function _array (x) {
  if (!_.isArray(x)) {
    throw new Erro("assertion failed: " + x + "is not an Array");
  }
}
