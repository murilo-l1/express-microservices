require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();
const bodyParser = require('body-parser');
const url = require('url');


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

//using the body-parser, so I can retrieve the url from the form
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//variable to local store the used Urls
const localUrls = {};

//retrieving and validating the url passed to the form
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;   console.log('retrievedUrl', originalUrl);
  const hostName = url. parse(originalUrl).hostname;

  if(!hostName)
    res.json({error: 'Invalid url'});

  dns.lookup(hostName, (err, address, family) => {
    if(err){
      res.json({error: 'Invalid url'});
    }
    else{
      const shortUrlID = Object.keys(localUrls).length + 1; console.log('id: ', shortUrlID);
      localUrls[shortUrlID] = originalUrl;
      res.json({original_url: originalUrl, short_url: shortUrlID });
    }
  });

});

//after shorted the url we can redirect the user just by passing it as endpoint
app.get('/api/shorturl/:shorted', (req, res) => {
  const shortedUrlId = req.params['shorted'];
  const originalUrl = localUrls[shortedUrlId];

  if(originalUrl){
    res.redirect(originalUrl);
  }else{
    res.json({error: 'Invalid url'});
  }

});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
