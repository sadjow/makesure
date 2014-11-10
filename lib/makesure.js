var merge = require('merge');
var proto = require('./manager');
var registry = require('./registry');
var validator = require('validator');

exports = module.exports = makesure;

function makesure(fn) {
  if(typeof fn == 'undefined') throw('You should pass a function to makesure()');
  var manager = merge(true, proto);
  manager.init();
  fn.apply(manager);

  var validate = function() {
    manager.execute.apply(manager, arguments);
  };
  validate.__proto__ = manager;

  return validate;
}

makesure.register = registry.register;
makesure.registerSync = registry.registerSync;
makesure.registry = registry.registry;

makesure.verbose = false;

makesure.registerSync('equals', validator.equals);
makesure.registerSync('contains', validator.contains);
makesure.registerSync('matches', validator.matches);
makesure.registerSync('email', validator.isEmail);
makesure.registerSync('url', validator.isURL);
makesure.registerSync('fqdn', validator.isFQDN);
makesure.registerSync('ip', validator.isIP);
makesure.registerSync('alpha', validator.isAlpha);
makesure.registerSync('numeric', validator.isNumeric);
makesure.registerSync('alphanumeric', validator.isAlphanumeric);
makesure.registerSync('base64', validator.isBase64);
makesure.registerSync('hexadecimal', validator.isHexadecimal);
makesure.registerSync('hex_color', validator.isHexColor);
makesure.registerSync('lowercase', validator.isLowercase);
makesure.registerSync('uppercase', validator.isUppercase);
makesure.registerSync('int', validator.isInt);
makesure.registerSync('float', validator.isFloat);
makesure.registerSync('divisible_by', validator.isDivisibleBy);
makesure.registerSync('null', validator.isNull);
makesure.registerSync('empty', validator.isNull);
makesure.registerSync('length', validator.isLength);
makesure.registerSync('byte_length', validator.isByteLength);
makesure.registerSync('uuid', validator.isUUID);
makesure.registerSync('date', validator.isDate);
makesure.registerSync('after', validator.isAfter);
makesure.registerSync('before', validator.isBefore);
makesure.registerSync('in', validator.isIn);
makesure.registerSync('credit_card', validator.isCreditCard);
makesure.registerSync('isbn', validator.isISBN);
makesure.registerSync('json', validator.isJSON);
makesure.registerSync('multibyte', validator.isMultibyte);
makesure.registerSync('ascii', validator.isAscii);
makesure.registerSync('full_width', validator.isFullWidth);
makesure.registerSync('half_width', validator.isHalfWidth);
makesure.registerSync('variable_width', validator.isVariableWidth);
makesure.registerSync('surrogate_pair', validator.isSurrogatePair);
makesure.registerSync('mongo_id', validator.isMongoId);

