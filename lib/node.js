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

node.that = function() {
  if (typeof arg == 'string') {
    this.attr = arg;
  } else if(typeof arg == 'function') {
    this.validation = arg;
  }
  if(arguments.length == 0 || typeof arguments[0] == 'undefined'){
    throw("It's need to define least one argument to that()")
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
  this.next = node.validate;

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

node.selfValidate = function(obj) {
  var d = q.defer();
  var error = {};
  var attr = this.attr;

  if(typeof this.validation.selfValidate == 'function') {
    this.validation.validate(obj[this.attr]).then(function(result) {
      if (result == null) {
        d.resolve(null);
      } else {
        error['attrs'] = error['attrs'] || {};
        error['attrs'][attr] = result;
        d.resolve(error);
      }
    });
  } else {
    var result = this.validation.apply(null, this.computedValidationArgs(obj));

    result = this.negative ? !result : result;

    if(result) {
      d.resolve(null); // no error
    } else {
      if(typeof attr == 'undefined' || attr == null) {
        error['messages'] = error['messages'] || [];
        error['messages'].push(this.message);
      } else {
        error['attrs'] = error['attrs'] || {};
        error['attrs'][attr] = error[attr] || [];
        error['attrs'][attr].push(this.message);
      }
      d.resolve(error);
    }
  }
  return d.promise;
}

node.validate = function(obj) {
  var d = new q.defer();
  var current = this.first;
  var error = null;
  var promisses = [];

  while(current) {
    promisses.push(current.selfValidate(obj));
    current = current.next;
  }

  q.all(promisses)
    .then(function(results){
      for (var i = 0; i < results.length; i++) {
        var r = results[i];
        if (r) {
          if(error == null) error = {};
          error = mixin(error, r);
        }
      }
      d.resolve(error);
    })

  return d.promise;
}
