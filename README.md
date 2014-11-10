# makesure

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]

```js
var makesure = require('makesure')

var validateUser = makesure(function(){
  this.permit('name email') // optional
  this.attrs('name email').isNot('empty').orSay("can't be empty")
})

// Validates a object, with an intrusive attribute.
validateUser({ name: '', description: 'My description', admin: true }, function(error, user){
  // error == {
  //   error: {
  //     attrs: {
  //       name: {
  //         messages: { "empty": "can't be empty" }
  //       }
  //     }
  //   }
  // }
  // user == {
  //   name: '',
  //   description: 'My description'
  // }
})
```

##  Features

  * Validations registry.
  * Async validations.
  * DSL to define validations.
  * Nested validations.
  * Validation focused on attributes or general.
  * Validate the entire object and return all the errors.
  * You can use your own functions for validation. Or use a the set of functions like of the [validator](https://github.com/chriso/validator.js) package provides.
  * validation identification
  * Built-in validations.

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

validateUser({ name: '', address: { street: '' } }, function(error, user){
  // Do the operation you want to do...
  // error == {
  //   error: {
  //     attrs: {
  //       name: {
  //         messages: { "length": "minimum length is 3 and max is 200" }
  //       },
  //       address: {
  //         attrs: {
  //           street: { messages: { "empty": "can't be empty" } }
  //         }
  //       }
  //     }
  //   }
  // }
})
```

## General validation

Sometimes, it's needed to validate the time of the operation or if a configuration flag is enabled. That validation is general for that object/operation.

```js
var validateAction = makesure(function(){
  this.validate(function(){
    return new Date().getDay() != 7;
  }).orSay("The operation can't be performed on Sunday.")
  .tag("sunday_restriction"); // if not set the tag default 'invalid' is used.
})

validateAction({}, function(error){
// error == {
//   error: {
//     messages: {
//       "The operation can't be performed on Sunday.": "sunday_restriction"
//     }
//   }
// }
})
```


## License

[MIT](https://github.com/sadjow/makesure/blob/master/LICENSE)

[npm-image]: https://img.shields.io/npm/v/makesure.svg?style=flat-square
[npm-url]: https://npmjs.org/package/makesure
[travis-image]: https://img.shields.io/travis/sadjow/makesure/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/sadjow/makesure
