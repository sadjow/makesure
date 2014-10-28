var express = require('express');
var makesure = require('../..');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

var empty = function(value){
  return value.length == 0;
};

var router = express.Router();

var aValidProduct = makesure()
  .that('name').isNot(empty).and()
  .that('description').isNot(empty).and()
  .that('value').isNot(empty);

var aValidCreate = makesure()
  .that('product').isNot(empty).and()
  .that('product').is(aValidProduct);

router.post('/', function(req, res){
  aValidCreate.validate(req.body)
  .then(function(error) {
    if(error) {
      res.status(422);
      res.send({ error: error });
    } else {
      res.status(201);
      res.send({})
    }
  })
})

app.use('/products', router);

module.exports = app;