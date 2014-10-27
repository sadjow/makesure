# makesure
[![Build Status](https://travis-ci.org/sadjow/makesure.svg?branch=master)](https://travis-ci.org/sadjow/makesure)

Make sure bellow ! (But, this API is still under development, the next minor release could break something)

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

var aValidUser = makesure()
    .that('name').is(length, 3, 200)
    .orSay('Minimum length is 3 and max is 200')

    aValidUser.validate(user).then(function(result){
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

var aValidAddress = makesure().that('street').isNot(empty)
                        .orSay("Can't be empty")

var aValidUser = makesure()
    .that('name').is(length, 3, 200)
    .orSay('Minimum length is 3 and max is 200')
    and().that('address').is(aValidAddress)

    aValidUser.validate(user).then(function(result){
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
var aValidOperation = makesure().that(function() {
        new Date().getDay() == 7;
    }).orSay("The operation can't be performed on Sunday.")

// result error
{
    messages: ["The operation can't be performed on Sunday."]
}
```