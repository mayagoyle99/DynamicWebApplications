var express = require('express');
var app = express();
var ejs = require('ejs');
var bodyParser = require('body-parser');
var fs = require('fs');

const request = require('request');
const apiKey = '0a32236878b34859b69fc07d9cc13b35';

app.use(express.static('public'));

//required if using body-parser
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.get('/', function(req, res){
        res.render('login', {error: null});
});

app.get('/index', function(req, res) {
   res.render('index', {article: null, error: null})
})

app.post('/', function (req, res) {
  let time_period = req.body.time_period;
  let url = `http://api.nytimes.com/svc/mostpopular/v2/mostviewed/Arts/${time_period}.json?api-key=${apiKey}`;
	
	request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      let articles = JSON.parse(body)
      if (articles.errors) {
        res.render('index', {article: null, error: `${articles.errors[0]}. Period is either 1, 7 or 30`})
      } else {
        let popularArticle = articles.results[0]
        let articleText = `Most popular Art article in ${time_period} day period is:  ${popularArticle.title}. Abstract: ${popularArticle.abstract}. \n Find it at: ${popularArticle.url}`
        res.render('index', {article: articleText, error: null})
      }
    }
  });
})


app.post('/login', function (req, res) {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  let user = {
    "username": username,
    "email": email,
    "password": password
  };

  let userJson = JSON.stringify(user);
  let users;
  fs.readFile('users.json', function (err, data) {
    if (err) {
      users = [];
    } else {
      users = JSON.parse(data);
    }
    users.push(userJson);

    fs.writeFile('users.json', JSON.stringify(users), function(err) {
      if (err) {
        console.log(err);
      }
      res.redirect('/index');
    });
  })
})


// let UserObject = {
//   'maya': {
//     'password': '123password',
//     'email': 'mayaemail@gmail.com'
//   }
// };

app.listen(3000, function(){
	console.log('app us running on port 3000')
});







