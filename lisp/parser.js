(function (exports) {
  'use strict';

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

  var atomize = function (token) {
    if (token === "true") {
      return true;
    }
    if (token === "false") {
      return false;
    }
    if (!_.isNaN(parseInt(token))) {
      return parseInt(token);
    }
    // TODO: literal strings
    // if ((token.length >= 2) && (token[0] === '"') && (token[token.length - 1] === '"')) {
    //   return token.slice(1, token.length - 1);
    // }
    
    return token;
  };

  var readFrom = function (tokens) {
    if (tokens.length === 0) {
      throw new SyntaxError("unexpected EOF while reading");
    }

    var token = tokens.shift();
    if ("(" === token) {
      var L = array([]);
      while (tokens[0] !== ")") {
        L.value.push(readFrom(tokens));
      }
      tokens.shift(); // remove ')'
      return L;
    } else if (")" === token) {
      throw new SyntaxError("unexpected )");
    } else {
      return atomize(token);
    }
  };

  var parse = function (str) {
    return readFrom(tokenize(str));
  };

  exports.atomize = atomize;
  exports.tokenize = tokenize;
  exports.parse = parse;
})(window);
