_ = require('underscore');

var validation = exports = module.exports = {};

validation.init = function(ctx) {
  this.ctx = ctx;
  this.validations = [];
}

validation.validates = function(attr, msg, validation, args) {
  this.validations.push({ attr: attr, msg: msg, validation: validation , args: args});
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

  console.log('Context', ctx)

  _.each(this.validations, function(obj) {
    if (typeof obj.validation.validate == 'function') {
      obj.validation.validate(ctx[obj.attr], function(err) {
        if(err) {
          error[obj.attr] = error[obj.attr] || [];
          error[obj.attr].push(err);
        }
      })
    } else {
      var args = [ctx[obj.attr]].concat(obj.args)
      if (! obj.validation.apply(null, args)) {
        error[obj.attr] = error[obj.attr] || [];
        error[obj.attr].push(obj.msg);
      }
    }
  });
  if (_.isEmpty(error)) {
    done(null); // valid
  } else {
    done(error); // not valid
  }
};