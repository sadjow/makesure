_ = require('underscore');

var validation = exports = module.exports = {};

validation.init = function(ctx) {
  this.ctx = ctx;
  this.validations = [];
  this.attrsValidations = [];
}

validation.that = function(attr) {
  var validation = function() {

  }
  this.attrsValidations.push()
}

validation.validates = function() {
  var attr, msg, validation, args = [];
  _.each(arguments, function(arg) {
    if(typeof arg == 'string' && !attr) {
      attr = arg;
    } else if (typeof arg == 'string' && !msg) {
      msg = arg;
    } else if(_.contains(['function', 'object'], typeof arg) && !validation) {
      validation = arg;
    } else {
      args.push(arg);
    }
  })
  this.validations.push({ attr: attr, msg: msg, validation: validation , args: _.flatten(args)});
  return this;
}

validation.validate = function() {
  var ctx, error = {}, done;
  _.each(arguments, function(arg){
    if (typeof arg == 'function') {
      done = arg;
    } else {
      ctx = arg;
    }
  })

  if (!ctx) ctx = this.ctx;

  _.each(this.validations, function(obj) {
    if (typeof obj.validation.validate == 'function') {
      obj.validation.validate(ctx[obj.attr], function(err) {
        if(err) {
          error['attrs'] = error['attrs'] || {}
          if (typeof err == 'object') {
            error['attrs'][obj.attr] = err;
          }
        }
      })
    } else {
      var args = [ctx[obj.attr]].concat(obj.args)
      if (! obj.validation.apply(null, args)) {
        error['attrs'] = error['attrs'] || {}
        error['attrs'][obj.attr] = error[obj.attr] || [];
        error['attrs'][obj.attr].push(obj.msg);
      }
    }
  });
  if (_.isEmpty(error)) {
    done(null); // valid
  } else {
    done(error); // not valid
  }
};