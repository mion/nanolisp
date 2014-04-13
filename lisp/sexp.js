"use strict";

var Sexp = function (type, value) {
  this.type = type;
  this.value = value;
};

Sexp.prototype.toString = function() {
  return sprintf("<type: %s, value: %s>", this.type, this.value.toString());
};

Sexp.prototype.is = function(type) {
  return this.type === type;
};

Sexp.prototype.isNumber = function() { return this.is("Number"); };
Sexp.prototype.isString = function() { return this.is("String"); };
Sexp.prototype.isSymbol = function() { return this.is("Symbol"); };
Sexp.prototype.isArray = function() { return this.is("Array"); };
Sexp.prototype.isBool = function() { return this.is("Bool"); };
Sexp.prototype.isLambda = function() { return this.is("Lambda"); };
Sexp.prototype.isError = function() { return this.is("Error"); };

Sexp.prototype.ok = function() {
  if (this.isError()) {
    return this.value === "none";
  } else return true;
};

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

Sexp.prototype.at = function(index) {
  if (this.isArray()) {
    return this.value[index];
  } else {
    return errorType();
  }
};

Sexp.prototype.first = function() {
  return this.at(0);
};

Sexp.prototype.rest = function() {
  if (this.isArray()) {
    return array( this.value.slice(1, this.value.length) );
  } else {
    return errorType();
  }
};

var string = function (value) {
  return new Sexp("String", value);
};

var number = function (value) {
  return new Sexp("Number", value);
};

var array = function (value) {
  return new Sexp("Array", value);
};

var symbol = function (value) {
  return new Sexp("Symbol", value);
};

var bool = function (value) {
  assert( value === true || value === false );
  return new Sexp("Bool", value);
};

var lambda = function (value) {
  return new Sexp("Lambda", value);
};

var error = function (value) {
  return new Sexp("Error", value);
};

var errorNone = function () {
  return error("none");
};

// a symbol was not found in a certain Env
var errorReference = function () {
  return error("reference");
};

// a list function called on an atom (and vice-versa)
var errorType = function () {
  return error("type");
};

// wrong number of arguments
var errorArgument = function () {
  return error("argument");
};