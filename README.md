# makesure
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/sadjow/makesure?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]

```js
var makesure = require('makesure')

var validateAddress = makesure(function(){
  this.attr('street').isNot('empty')
  .orSay("can't be empty")
})

var validateUser = makesure(function(){
  this.attr('name').is('length', 3, 200)
  .orSay('minimum length is 3 and max is 200')
  this.attr('address').with(validateAddress) // nested
})

validateUser({ name: '', address: { street: '' } }, function(err, user){
  // err == {
  //   'name': [{code: "LENGTH", message: "minimum length is 3 and max is 200"}],
  //   'address.street': [{ code: "EMPTY", message: "can't be empty"}]
  // }
})
```

##  Features

  * Validation functions registry.
  * Async validations;
  * Nested validations;
  * Validations focused on attributes or general;
  * Validate the entire object and return all the errors;
  * Define custom validations or use existing functions like the functions of package [validator](https://github.com/chriso/validator.js) package provides.
  * Validation errors CODEs;
  * Built-in validations (from validator package);

##  Installation

```console
npm install --save makesure
```

or for client-side:

```console
bower install --save makesure
```

## Built-in validations

This project is using the [validator](https://github.com/chriso/validator.js) package as the built-in validations functions.

```js
var validator = require('validator');

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
```

## License

[MIT](https://github.com/sadjow/makesure/blob/master/LICENSE)

[npm-image]: https://img.shields.io/npm/v/makesure.svg?style=flat-square
[npm-url]: https://npmjs.org/package/makesure
[travis-image]: https://img.shields.io/travis/sadjow/makesure/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/sadjow/makesure
