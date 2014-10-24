var mixin = require('utils-merge');
var Promise = require('mpromise');

var node = module.exports = {};

node.init = function (prev) {
  this.prev = prev;
  this.next = null;
  this.attr = null;
  this.message = 'invalid';
  this.validationArgs = [];
  this.negative = false;
  if(!prev) {
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
    this.validationArgs = Array(arguments).slice(1, arguments.length);
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
  this.next = node.validate;

  mixin(this.next, node);

  this.next.init(this);

  return this.next;
}

node.end = function() {
  return this.first;
}

node.computedValidationArgs = function() {
  var args = [];
  if (this.attr) {
    args.push(this.attr);
  }
  if(this.validationArgs) {
    args.concat(this.validationArgs);
  }
  return args;
}

node.validate = function(obj, done) {
  var p = new Promise;
  var first = this.first;
  var current = this.first;
  var error;

  console.log("iniciando")
  while(true) {
    console.log('teste');
  }
  while(current) {
    console.log("iniciando");
    applyArgs = typeof current.validate == 'function' ? [obj[current.attr]] : current.computedValidationArgs;

    if(current.validation.apply(null, applyArgs) && !this.negative) {
      error = error || {};
      error['attrs'] = error['attrs'] || {}
      error['attrs'][current.attr] = error[current.attr] || [];
      error['attrs'][current.attr].push(current.message);
    }
    current = current.next;
  }
  if (error) {
    p.reject(error);
  } else {
    p.resolve();
  }
  return p;
}