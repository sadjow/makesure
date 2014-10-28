(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./lib/makesure')
},{"./lib/makesure":3}],2:[function(require,module,exports){
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
          error['attrs'] = error['attrs'] || {};
          error['attrs'][attr] = result;
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
          error['messages'] = error['messages'] || [];
          error['messages'].push(this.message);
        } else {
          error['attrs'] = error['attrs'] || {};
          error['attrs'][attr] = error[attr] || [];
          error['attrs'][attr].push(this.message);
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

},{"merge":4}],3:[function(require,module,exports){
var proto = require('./makesure-node');
var merge = require('merge');

exports = module.exports = makesure;

function makesure() {
  var validationNode = {}
  merge(validationNode, proto);

  validationNode.init();

  return validationNode;
}
},{"./makesure-node":2,"merge":4}],4:[function(require,module,exports){
/*!
 * @name JavaScript/NodeJS Merge v1.2.0
 * @author yeikos
 * @repository https://github.com/yeikos/js.merge

 * Copyright 2014 yeikos - MIT license
 * https://raw.github.com/yeikos/js.merge/master/LICENSE
 */

;(function(isNode) {

	/**
	 * Merge one or more objects 
	 * @param bool? clone
	 * @param mixed,... arguments
	 * @return object
	 */

	var Public = function(clone) {

		return merge(clone === true, false, arguments);

	}, publicName = 'merge';

	/**
	 * Merge two or more objects recursively 
	 * @param bool? clone
	 * @param mixed,... arguments
	 * @return object
	 */

	Public.recursive = function(clone) {

		return merge(clone === true, true, arguments);

	};

	/**
	 * Clone the input removing any reference
	 * @param mixed input
	 * @return mixed
	 */

	Public.clone = function(input) {

		var output = input,
			type = typeOf(input),
			index, size;

		if (type === 'array') {

			output = [];
			size = input.length;

			for (index=0;index<size;++index)

				output[index] = Public.clone(input[index]);

		} else if (type === 'object') {

			output = {};

			for (index in input)

				output[index] = Public.clone(input[index]);

		}

		return output;

	};

	/**
	 * Merge two objects recursively
	 * @param mixed input
	 * @param mixed extend
	 * @return mixed
	 */

	function merge_recursive(base, extend) {

		if (typeOf(base) !== 'object')

			return extend;

		for (var key in extend) {

			if (typeOf(base[key]) === 'object' && typeOf(extend[key]) === 'object') {

				base[key] = merge_recursive(base[key], extend[key]);

			} else {

				base[key] = extend[key];

			}

		}

		return base;

	}

	/**
	 * Merge two or more objects
	 * @param bool clone
	 * @param bool recursive
	 * @param array argv
	 * @return object
	 */

	function merge(clone, recursive, argv) {

		var result = argv[0],
			size = argv.length;

		if (clone || typeOf(result) !== 'object')

			result = {};

		for (var index=0;index<size;++index) {

			var item = argv[index],

				type = typeOf(item);

			if (type !== 'object') continue;

			for (var key in item) {

				var sitem = clone ? Public.clone(item[key]) : item[key];

				if (recursive) {

					result[key] = merge_recursive(result[key], sitem);

				} else {

					result[key] = sitem;

				}

			}

		}

		return result;

	}

	/**
	 * Get type of variable
	 * @param mixed input
	 * @return string
	 *
	 * @see http://jsperf.com/typeofvar
	 */

	function typeOf(input) {

		return ({}).toString.call(input).slice(8, -1).toLowerCase();

	}

	if (isNode) {

		module.exports = Public;

	} else {

		window[publicName] = Public;

	}

})(typeof module === 'object' && module && typeof module.exports === 'object' && module.exports);
},{}]},{},[1]);
