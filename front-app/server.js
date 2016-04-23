var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use('/', express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/starsInfo.json', function(req, res) {
  fs.readFile('starsInfo.json', function(err, data) {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

app.post('/starsInfo.json', function(req, res) {
  fs.readFile('starsInfo.json', function(err, data) {
    var starsInfo = JSON.parse(data);
    comments.push(req.body);
    fs.writeFile('starsInfo.json', JSON.stringify(starsInfo, null, 4), function(err) {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(starsInfo);
    });
  });
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
