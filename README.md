# makesure

Make sure bellow !

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

    validateUser(user).then(function(){
        // ... ok
    }).catch(function(errors){
        // ... not valid
    })

// error object
{
    attrs: {
        name: ['Minimum length is 3 and max is 200']
    }
}
```

## Nested validation example

```javascript
var validator = require('validator');
var makesure = require('makesure');
var length = validator.isLength;
var _ =  require('underscore');

var user = {
    name: 'Wolverine',
    address: {
        street: ''
    }
}

var validAddress = makesure().that('street').isNot(_.empty)
                        .orSay("Can't be empty")

var validUser = makesure()
    .that('name').is(length, 3, 4)
    .orSay('Minimum length is 3 and max is 200')
    and().that('address').is(validAddress)

    validUser(user).then(function(){
        // ... ok
    }).catch(function(errors){
        // invalid
    })

// error object
{
    attrs: {
        address: {
            attrs: {
                street: ["Can't be empty"]
            }
        }
    }
}
```

## General validation example

Sometimes we need to validate the time of the operation of if a configuration flag is enabled. That validation is general for that object/operation.

```javascript
var valid = makesure().that(function() {
        new Date().getDay() != 7;
    }).orSay("The operation can't be performed on sunday.")

// result error
{
    messages: ["The operation can't be performed on sunday."]
}
```