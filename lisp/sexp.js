"use strict";

function Sexp (type, value) {
  this.type = type;
  this.value = value;
}

Sexp.prototype.is = function(type) {
  return this.type === type;
};

Sexp.prototype.isNumber = function() { return this.is("Number"); };
Sexp.prototype.isString = function() { return this.is("String"); };
Sexp.prototype.isSymbol = function() { return this.is("Symbol"); };
Sexp.prototype.isArray = function() { return this.is("Array"); };
Sexp.prototype.isError = function() { return this.is("Error"); };

Sexp.prototype.equal = function(sexp) {
  assertDefined(sexp);

  if (!this.is(sexp.type)) {
    return false;
  } else {
    if (this.isArray()) {
      if (this.value.length != sexp.value.length) { return false; }

      for (var i = 0; i < this.value.length; i++) {
        var myValue = this.value[i];
        var hisValue = sexp.value[i];

        assertInstanceOf(myValue, Sexp);
        assertInstanceOf(hisValue, Sexp);

        if (!myValue.equal(hisValue)) { return false; }
      };

      return true;
    } else {
      return this.value === sexp.value; 
    }
  }
};

Sexp.prototype.first = function() {
  if (this.isArray()) {
    return this.value[0];
  } else {
    return errorType();
  }
};

Sexp.prototype.rest = function() {
  if (this.isArray()) {
    return array( this.value.slice(1, this.value.length) );
  } else {
    return errorType();
  }
};

function string (value) {
  return new Sexp("String", value);
}

function number (value) {
  return new Sexp("Number", value);
}

function array (value) {
  return new Sexp("Array", value);
}

function symbol (value) {
  return new Sexp("Symbol", value);
}

function error (value) {
  return new Sexp("Error", value);
}

function errorUnknownSymbol () {
  return error("unknown symbol");
}

function errorType () {
  return error("type");
}