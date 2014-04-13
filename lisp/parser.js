"use strict";

var tokenize = function (str) {
  var lp = /\(/g;
  var rp = /\)/g;
  return str.replace(lp, ' ( ')
            .replace(rp, ' ) ')
            .split(' ')
            .filter(function (el) {
              return el !== "";
            });
};

var parse = function (str) {
  return error();
};