"use strict";

function Sexp (type, value) {
  this.type = type;
  this.value = value;
}

Sexp.prototype.is = function(type) {
  return this.type === type;
};

Sexp.prototype.equal = function(sexp) {
  assertDefined(sexp);

  if (!this.is(sexp.type)) {
    return false;
  } else {
    if (this.is("String") || this.is("Number") || this.is("Symbol")) {
      return this.value === sexp.value; 
    }
    if (this.is("Array")) {
      if (this.value.length != sexp.value.length) { return false; }

      for (var i = 0; i < this.value.length; i++) {
        var myValue = this.value[i];
        var hisValue = sexp.value[i];

        assertInstanceOf(myValue, Sexp);
        assertInstanceOf(hisValue, Sexp);

        if (!myValue.equal(hisValue)) { return false; }
      };

      return true;
    }
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