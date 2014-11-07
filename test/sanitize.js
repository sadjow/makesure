var makesure = require('..');
var should = require('should');
var validator = require('validator');
var removeDiacritics = require('diacritics').remove;

describe("makesure's sanitize API", function(){
  describe("sanitize()", function(){
    var sms = {
      phone: "(99) 999-999-999",
      message: "Olá, essa é sua mensagem." // portuguese mensagem test
    }

    it("sanitizes the accents and remove formatting", function(done){
      var validateSMS = makesure(function(){
        this.sanitize('phone', function(value) {
          return value.replace( /\D+/g, '');
        });

        this.sanitize('message', function(value) {
          return removeDiacritics(value); // remove accents
        });
      });

      validateSMS(sms, function(err, newSMS){
        should.not.exist(err);
        newSMS.phone.should.eql('99999999999')
        newSMS.message.should.eql('Ola, essa e sua mensagem.')
        done();
      });
    });
  });


  describe("sanitize() with sub object", function(){
    var sms = {
      phone: "(99) 999-999-999",
      message: "Olá, essa é sua mensagem." // portuguese mensagem test
    }

    var body = { sms: sms };

    it("sanitizes the accents and remove formatting", function(done){
      var validateSMS = makesure(function(){
        this.sanitize('phone', function(value) {
          return value.replace( /\D+/g, '');
        });

        this.sanitize('message', function(value) {
          return removeDiacritics(value); // remove accents
        });
      });

      var validateAction = makesure(function(){
        this.attr('sms').with(validateSMS);
      });

      validateAction(body, function(err, newSMS){
        should.not.exist(err);
        newSMS.sms.phone.should.eql('99999999999')
        newSMS.sms.message.should.eql('Ola, essa e sua mensagem.')
        done();
      });
    });
  });
});
