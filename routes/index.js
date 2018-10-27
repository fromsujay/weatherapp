var express = require('express');
var router = express.Router();
var request = require('request');
var mongoose= require('mongoose');

var dataBase = [];

var options = { server: { socketOptions: {connectTimeoutMS: 5000 } }};

mongoose.connect('mongodb://Sujay:abc123@ds111299.mlab.com:11299/openweatherapp',
    options,
    function(err) {
     console.log(err);
    }
);

var citySchema = mongoose.Schema({
    name: String,
    picto: String,
    temps: String,
    max: Number,
    min: Number,
    lat: Number,
    lon: Number,
});

var cityModel = mongoose.model('cities', citySchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  cityModel.find(
    function (err, ville) {
      console.log(ville);
      res.render('index', { cityList: ville });
    }
  );

});

/* Add City */
router.post('/add-city', function(req, res, next) {

  request("https://api.openweathermap.org/data/2.5/weather?q="+req.body.city+"&units=metric&lang=fr&appid=6598e8e76e47ddd86b14ff324d146347", function(error, response, body) {
    body = JSON.parse(body);

    cityModel.find(function(err, ville) {

      var cityExist = false;
      for (var i = 0; i < ville.length; i++) {
        if (ville[i].name.toLowerCase() == req.body.city.toLowerCase()) {
          cityExist = true;
          res.render('index', {cityList: ville});
        }
      }

      if(cityExist == false) {
        var newCity = new cityModel ({
        name: body.name,
        picto: "http://openweathermap.org/img/w/"+body.weather[0].icon+".png",
        temps: body.weather[0].description,
        max: body.main.temp_max,
        min: body.main.temp_min,
        lat: body.coord.lat,
        lon: body.coord.lon,
      });

      newCity.save(
        function (error, city) {
          console.log(city);

          cityModel.find(
            function (err, ville) {
              console.log(ville);
              res.render('index', { cityList: ville });
            }
          );
        }
      );

      }

     });

    });
  });

/* POST suppression ville */
router.get('/delete-city', function(req, res, next) {

  cityModel.remove(
    { _id: req.query.k},
    function(error) {
      cityModel.find(
        function (err, ville) {
          console.log(ville);
          res.render('index', { cityList: ville });
         }
        );
       }
      );
  });



module.exports = router;
