var http = require('http');
var path = require('path');
var TwitterClient = require('node-twitter');
var dotenv = require('dotenv');

dotenv.load();

var express = require('express');

function initTwitterClient () {
    var twitterSearchClient = new TwitterClient.SearchClient(
        process.env.CONSUMER_KEY,
        process.env.CONSUMER_SECRET,
        process.env.TOKEN,
        process.env.TOKEN_SECRET
    );
    
    return twitterSearchClient;
}

var router = express();
var server = http.createServer(router);

router.use(express.static(path.resolve(__dirname, 'client')));

router.get('/twitter/search', function(req, res) {
  var twitterClient = initTwitterClient();
  
  if (!req.query.term) {
    return res.send("Must define a term for search");
  }
  
  twitterClient.search({
    'q': req.query.term,
    'count': 100,
    'geocode': "23.846695,90.403005,1000km"
  }, function(error, result) {
      if (error) {
          var errMessage = 'Error: ' + (error.code ? error.code + ' ' + error.message : error.message);
          console.log(errMessage);
          res.send(errMessage);
      }
   
      if (result) {
          console.log(result);
          res.json(result);
      }
  });
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
