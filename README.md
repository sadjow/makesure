# makesure

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]

```js
var makesure = require('makesure')

var empty = function(value) { return value.length > 0 }

var validateUser = makesure(function(){
  this.permit('name email') // optional
  this.attrs('name email').isNot(empty).orSay("can't be empty")
})

var userInput = { name: '', description: 'My description', admin: true }

// Validates a object, with an intrusive attribute.
validateUser(userInput, function(error, user){
  // error == {
  //   error: {
  //     attrs: {
  //       name: {
  //         messages: ["can't be empty"]
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

[Check out the documentation!](https://github.com/sadjow/makesure)

##  Features

  * DSL to define validations.
  * Nested validations.
  * Validation focused on attributes or general.
  * Validate the entire object and return all the errors.
  * You can use your own functions for validation. Or use a the set of functions like of the [validator](https://github.com/chriso/validator.js) package provides.

##  Installation

```console
npm install --save makesure
```

## Nested validation

You can use makesure validate nested function to validate a whole object and get all the errors at once.

```js
var validator = require('validator'); // Only to ilustrate this example
var makesure = require('makesure');
var length = validator.isLength;
var empty = function(value){
  return value.length == 0;
};
var user = {
  name: '',
  address: {
    street: ''
  }
}
var validateAddress = makesure(function(){
  this.attr('street').isNot(empty).orSay("Can't be empty")
})

var validateUser = makesure(function(){
  this.attr('name').is(length, 3, 200).orSay('Minimum length is 3 and max is 200')
  this.attr('address').validateWith(validateAddress)
})

validateUser(user, function(error, user){
  // Do the operation you want to...
  // error == {
  //   error: {
  //     attrs: {
  //       name: { messages: ["Minimum length is 3 and max is 200"] },
  //       address: {
  //         attrs: {
  //           street: { messages: ["Can't be empty"] }
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
  }).orSay("The operation can't be performed on Sunday.");
})

validateAction({}, function(error){
// error == {
//   error: {
//     messages: ["The operation can't be performed on Sunday."]
//   }
// }
})
```


## License

MIT

[npm-image]: https://img.shields.io/npm/v/makesure.svg?style=flat-square
[npm-url]: https://npmjs.org/package/makesure
[travis-image]: https://img.shields.io/travis/sadjow/makesure/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/sadjow/makesure
