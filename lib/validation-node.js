var mixin = require('utils-merge');
var q = require('q');

var node = module.exports = {};

node.init = function (prev) {
  this.prev = prev;
  this.next = null;
  this.attr = null;
  this.message = 'invalid';
  this.validationArgs = [];
  this.negative = false;

  if(typeof prev == 'undefined') {
    this.first = this;
  } else {
    this.first = prev.first;
  }
}

node.that = function(arg) {
  if (typeof arg == 'string') {
    this.attr = arg;
  } else if(typeof arg == 'function') {
    this.validation = arg;
  }
  return this;
}

node.is = function() {
  if(arguments.length == 0){
    throw("It's need to define least one argument to is()")
  } else {
    this.validation = arguments[0];
    for(var i = 1; i< arguments.length; i++) {
      this.validationArgs.push(arguments[i])
    }
  }
  return this;
}

node.isNot = function(){
  this.negative = true;
  this.is.apply(this, arguments);
  return this;
}

node.orSay = function(message) {
  this.message = message;
  return this;
}

node.and = function(){
  this.next = node.run;

  mixin(this.next, node);
  this.next.init(this);

  return this.next;
}

node.end = function() {
  return this.first;
}

node.computedValidationArgs = function(obj) {
  var args = [];
  if (this.attr) {
    args.push(obj[this.attr]);
  }
  if(this.validationArgs) {
    args = args.concat(this.validationArgs);
  }
  return args;
}

node.validate = function(obj) {
  var d = q.defer();
  var result = this.validation.apply(null, this.computedValidationArgs(obj))
  if(result) {
    d.resolve(null); // no error
  } else {
    var error = {}
    error[this.attr] = this.message;
    d.resolve(error);
  }
  return d.promise;
}

node.run = function(obj) {
  var d = new q.defer();
  var current = this.first;
  var error = null;
  var promisses = [];

  while(current) {
    promisses.push(current.validate(obj));
    current = current.next;
  }

  q.all(promisses)
    .then(function(results){
      console.log(results);
      for (var i = 0; i < results.length; i++) {
        var r = results[i];
        if (r) {
          if(error == null) {
            error = {}
          }
          error['attrs'] = error['attrs'] || {}
          error = mixin(error['attrs'], r);
        }
      }
      d.resolve(error);
    })

  return d.promise;
}