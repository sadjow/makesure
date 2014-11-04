var express = require('express');
var makesure = require('../..');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

var empty = function(value){
  return value.length == 0;
};

var router = express.Router();

makesure.register('empty', empty);

var validateProduct = makesure(function(){
  this.permit('name description value')
  this.attrs('name value').isNot('empty').isPresent()
  this.attr('description').is('length', 10, 200).ifPresent()
})

var validateCreate = makesure(function(){
  this.attr('product').is(validateProduct);
  this.isNot(function(){
    // This is not Sunday!
    return new Date().getDay() == 7;
  })
});

router.post('/', function(req, res){
  validateCreate(req.body, function(err, newBody){
    if(err) {
      res.status(422);
      res.send({ error: err });
    } else {
      res.status(201);
      res.send(newBody);
    }
  });
})

app.use('/products', router);

module.exports = app;
