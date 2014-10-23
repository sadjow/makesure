function validation(argument) {
  // body...
}


function requestValidator(ctx) {
  this.validate(ctx.query, queryValidator);

  function queryValidator (ctx) {
    this.validate(ctx.name).notEmpty()
    this.validate(ctx.name)
  }
}