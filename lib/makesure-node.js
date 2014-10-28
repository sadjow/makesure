var merge = require('merge');

var node = module.exports = {};

node.init = function (prev) {
  this.prev = prev || null;
  this.next = null;
  this.attr = null;
  this.message = 'invalid';
  this.validationArgs = [];
  this.negative = false;
  this.required = true;
  this.count = 0;

  if(this.prev == null) {
    this.first = this;
  } else {
    this.first = this.prev.first;
  }
  this.first.count++;
}

node.that = function() {
  if(arguments.length == 0 || typeof arguments[0] == 'undefined'){
    throw("It's needed to define at least one argument to that()")
  } else {
    var firstArg = arguments[0];
    if (typeof firstArg == 'string') {
      this.attr = firstArg;
    } else if(typeof firstArg == 'function') {
      this.validation = firstArg;
    }
    for(var i = 1; i< arguments.length; i++) {
      this.validationArgs.push(arguments[i])
    }
  }
  return this;
}

node.is = function() {
  if(arguments.length == 0 || typeof arguments[0] == 'undefined'){
    throw("It's needed to define at least one argument to is()")
  } else {
    this.validation = arguments[0];
    for(var i = 1; i< arguments.length; i++) {
      this.validationArgs.push(arguments[i])
    }
  }
  return this;
}

node.isNot = function(){
  if(arguments.length == 0 || typeof arguments[0] == 'undefined'){
    throw("It's needed to define at least one argument to isNot()")
  } else {
    this.negative = true;
    this.is.apply(this, arguments);
  }
  return this;
}

node.orSay = function(message) {
  if(arguments.length == 0 || typeof arguments[0] == 'undefined'){
    throw("It's needed to define at least one argument to orSay()")
  } else {
    this.message = message;
  }
  return this;
}

node.and = function(){
  this.next = {};

  merge(this.next, node);
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

node.selfValidate = function(obj, cb) {
  var error = {};
  var attr = this.attr;

  if(attr && this.required && typeof obj[attr] == 'undefined') {
    error.attrs = error.attrs || {};
    error.attrs[attr] = error.attrs[attr] || [];
    error.attrs[attr].push('required');
    cb(error)
  } else {
    if(typeof this.validation.selfValidate == 'function') {
      this.validation.validate(obj[this.attr], function(result) {
        if (result == null) {
          cb(null);
        } else {
          error.attrs = error.attrs || {};
          error.attrs[attr] = result;
          cb(error);
        }
      });
    } else {
      var result = this.validation.apply(null, this.computedValidationArgs(obj));

      result = this.negative ? !result : result;

      if(result) {
        cb(null) // no error
      } else {
        if(typeof attr == 'undefined' || attr == null) {
          error.messages = error.messages || [];
          error.messages.push(this.message);
        } else {
          error.attrs = error.attrs || {};
          error.attrs[attr] = error[attr] || [];
          error.attrs[attr].push(this.message);
        }
        cb(error);
      }
    }
  }
}

node.validate = function() {
  var obj, cb;
  if(arguments.length == 0 || typeof arguments[0] == 'undefined'){
    throw("It's needed to define at least one argument to validate()")
  } else {
    var lastArg = arguments[arguments.length-1];

    if (typeof lastArg != 'function') {
      throw("It's needed to define a callback to validate()")
    }

    cb = lastArg;

    if(arguments.length > 1) {
      obj = arguments[0];
    }
  }
  var current = this.first;
  var error = null;
  var promisses = [];
  var results = [];

  var finalize = function(){
    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      if (r) {
        if(error == null) error = {};
        error = merge.recursive(true, error, r);
      }
    }
    cb(error);
  }

  var eachCb = function(err) {
    results.push(err);
    if(results.length == current.first.count) {
      finalize();
    }
  }

  while(current) {
    promisses.push(current.selfValidate(obj, eachCb));
    current = current.next;
  }
}
