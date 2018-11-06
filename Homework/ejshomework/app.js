var express = require('express');
var app = express();
var ejs = require('ejs');
var bodyParser = require('body-parser');

const request = require('request');
const apiKey = '0a32236878b34859b69fc07d9cc13b35';

app.use(express.static('public'));
//required if using body-parser
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');  

app.get("/", function(req, res){
  request("https://newsapi.org/v1/articles?source=the-new-york-times&sortBy=top&apiKey=70a5906f19f844f291cff401c80bc123", function(error, response,body){
    if(! error && response.statusCode == 200) {
        var data = JSON.parse(body);
        res.render("results", {data: data});
      } 
  });
});

app.post('/', function (req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
	
	request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        res.render('index', {weather: weatherText, error: null});
      }
    }
  });
})

app.listen(3000, function(){
	console.log('app us running on port 3000')
});

