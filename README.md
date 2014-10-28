# makesure
[![Build Status](https://travis-ci.org/sadjow/makesure.svg?branch=master)](https://travis-ci.org/sadjow/makesure)

[Check out the documentation!](https://github.com/sadjow/makesure)

Make sure bellow !

##  Features

  * DSL to define validations.
  * Nested validations.
  * Validation focused on attributes or general.
  * Validate the entire object and return all the errors.
  * Use promises.
  * Async validation.

##  Server-side install

```console
npm install --save makesure
```

## Client-side install (not tested yet)

```console
bower install --save makesure
```

## Simple example

```javascript
var makesure = require('makesure');

var user = {
    name: ''
}

var empty = function(value) {
    return value.length > 0
}

var aValidUser = makesure()
    .that('name').isNot(empty)
    .orSay("can't be empty")

    aValidUser.validate(user).then(function(error){
        // error object
        // {
        //     attrs: {
        //         name: ["can't be empty"]
        //     }
        // }
    });
```

## Nested validation example

You can use nested validation objects to validate a whole object.

```javascript
var validator = require('validator'); // Only to ilustrate this example
var makesure = require('makesure');
var length = validator.isLength;
var empty = function(value){
  return value.length == 0;
};
var user = {
    name: 'Wolverine',
    address: {
        street: ''
    }
}

var aValidAddress = makesure().that('street').isNot(empty)
                        .orSay("Can't be empty")

var aValidUser = makesure()
    .that('name').is(length, 3, 200)
    .orSay('Minimum length is 3 and max is 200')
    and().that('address').is(aValidAddress)

    aValidUser.validate(user).then(function(error){
        // error object
        // {
        //     attrs: {
        //         address: {
        //             attrs: {
        //                 street: ["Can't be empty"]
        //             }
        //         }
        //     }
        // }
    })
```

## General validation example

Sometimes, it's needed to validate the time of the operation or if a configuration flag is enabled. That validation is general for that object/operation, and the .

```javascript
var aValidOperation = makesure().that(function() {
        new Date().getDay() != 7;
    }).orSay("The operation can't be performed on Sunday.")

aValidOperation.validate().then(function(error){
// result error
// {
//     messages: ["The operation can't be performed on Sunday."]
// }
})
```

## License

MIT
