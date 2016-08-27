var express    = require('express'),
    bodyParser = require('body-parser'),
    port       = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.listen(port, function(){
  console.log('listening on localhost:' + port);
});