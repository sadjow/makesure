# makesure
[![Build Status](https://travis-ci.org/sadjow/makesure.svg?branch=master)](https://travis-ci.org/sadjow/makesure)

```js
var makesure = require('makesure')

var empty = function(value) {
  return value.length > 0
}

var aValidUser = makesure()
  .that('name').isNot(empty)
  .orSay("can't be empty")

aValidUser.validate({ name: '' }, function(error){
  // error == {
  //   attrs: {
  //     name: ["can't be empty"]
  //   }
  // }
})
```

[Check out the documentation!](https://github.com/sadjow/makesure)

##  Features

  * DSL to define validations.
  * Nested validations.
  * Validation focused on attributes or general.
  * Validate the entire object and return all the errors.

##  Installation

```console
npm install --save makesure
```

## Nested validation

You can use makesure's nested nodes to validate a whole object, and get all the errors at once.

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

var aValidAddress = makesure()
  .that('street').isNot(empty).orSay("Can't be empty")

var aValidUser = makesure()
  .that('name').is(length, 3, 200)
  .orSay('Minimum length is 3 and max is 200').and()
  .that('address').is(aValidAddress)

aValidUser.validate(user, function(error){
  // error == {
  //   attrs: {
  //     name: ["Minimum length is 3 and max is 200"]
  //     address: {
  //       attrs: {
  //         street: ["Can't be empty"]
  //       }
  //     }
  //   }
  // }
})
```

## General validation

Sometimes, it's needed to validate the time of the operation or if a configuration flag is enabled. That validation is general for that object/operation, and the .

```js
var aValidOperation = makesure()
  .that(function() {
    new Date().getDay() != 7;
  }).orSay("The operation can't be performed on Sunday.")

aValidOperation.validate(function(error){
// error == {
//   messages: ["The operation can't be performed on Sunday."]
// }
})
```

## License

MIT
