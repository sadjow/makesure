# makesure
[![Build Status](https://travis-ci.org/sadjow/makesure.svg?branch=master)](https://travis-ci.org/sadjow/makesure)

Make sure bellow !

##  Features

  * Simple DSL to define the validation schema.
  * Nested validations schemas.
  * Validation focused on attributes and general validations.
  * Validate the entire object, and return all the errors.
  * Use promises.
  * Support async validations.

##  Server-side install

```console
npm install --save makesure
```

## Client-side install (not tested yet)

```console
bower install makesure
```

## Simple example

```javascript
var validator = require('validator');
var makesure = require('makesure');
var length = validator.isLength;
var user = {
    name: 'ab'
}

var validateUser = makesure()
    .that('name').is(length, 3, 4)
    .orSay('Minimum length is 3 and max is 200')

    validateUser.validate(user).then(function(result){
        // in this case the result is not null, a error.
        // result error object
        //{
        //    attrs: {
        //        name: ['Minimum length is 3 and max is 200']
        //    }
        //}
    });
```

## Nested validation example

```javascript
var validator = require('validator');
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

var validAddress = makesure().that('street').isNot(empty)
                        .orSay("Can't be empty")

var validUser = makesure()
    .that('name').is(length, 3, 4)
    .orSay('Minimum length is 3 and max is 200')
    and().that('address').is(validAddress)

    validUser.validate(user).then(function(result){
        // result object = errors
        //{
        //    attrs: {
        //        address: {
        //            attrs: {
        //                street: ["Can't be empty"]
        //            }
        //        }
        //    }
        //}
    })
```

## General validation example

Sometimes we need to validate the time of the operation or if a configuration flag is enabled. That validation is general for that object/operation.

```javascript
var valid = makesure().that(function() {
        new Date().getDay() == 7;
    }).orSay("The operation can't be performed on Sunday.")

// result error
{
    messages: ["The operation can't be performed on Sunday."]
}
```