function print (msg) {
  console.log("[*] " + msg);
}

// Functions prefixed with "_" are all error throwing assertions
function _ok (x) {
  if (!x) {
    throw new Error("assertion failed: " + x + " is not truthy");
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