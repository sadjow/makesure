# makesure
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/sadjow/makesure?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]

```js
var makesure = require('makesure')

var validateUser = makesure(function(){
  this.permit('name email') // optional
  this.attrs('name email').isNot('empty').orSay("can't be empty")
})

// Validates a object, with an intrusive attribute.
validateUser({ name: '', description: 'My description', admin: true }, function(err, user){
  // err == {
  //   'name': [{'EMPTY': "can't be empty"}]
  // }
  //
  // user == {
  //   name: '',
  //   description: 'My description'
  // }
})
```

##  Features

  * Registry.
  * Async;
  * DSL;
  * Nested;
  * Focus on attributes or general;
  * Validate the entire object and return all the errors;
  * You can use your own functions for validation, or use a the set of functions like of the [validator](https://github.com/chriso/validator.js) package provides.
  * tags;
  * Built-in validations;

## Roadmap

  * Validate a attribute based on value of another attribute.
	* Improve general validation to add general messages.
	* General messages based on attributes validation

##  Installation

```console
npm install --save makesure
```

or for client-side:

```console
bower install --save makesure
```

## Nested validation

You can use makesure validate nested function to validate a whole object and get all the errors at once.

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

## General validation

Sometimes, it's needed to validate the time of the operation or if a configuration flag is enabled. That validation is general for that object/operation.

```js
var validateAction = makesure(function(){
  this.validate(function(cb){
    cb(null, new Date().getDay() != 7);
  }).orSay("The operation can't be performed on Sunday.")
  .tag("sunday_restriction"); // if not set the tag default 'invalid' is used.
})

validateAction({}, function(err){
  // err = {
  //   'base': [ {code: 'SUNDAY_RESTRICTION', message: "The operation can't be performed on Sunday."} ]
  // }
})
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
