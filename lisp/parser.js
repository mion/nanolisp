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

var atom = function (token) {
  if (token === "true") {
    return bool(true);
  }
  if (token === "false") {
    return bool(false);
  }
  if (!_.isNaN(parseInt(token))) {
    return number(parseInt(token));
  }
  if ((token.length >= 2) && (token[0] === '"') && (token[token.length - 1] === '"')) {
    return string(token.slice(1, token.length - 1));
  }

  // TODO: things like "-" can become symbols
  return symbol(token);
};

var parse = function (str) {
  return error();
};