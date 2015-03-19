// Require our dependencies
var express = require('express'),
  http = require('http');
// Create an express instance and set a port variable
var app = express();
var port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
  res.render('./index.html');
});

app.listen(port);
