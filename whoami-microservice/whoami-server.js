require('dotenv').config('./sgiample.env');
const express = require('express');
const app = express();

// cors enabled for fcc tests
const cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// extract user info from the request header as the challenge expects
app.get('/api/whoami', (req, res) => {
  const headers = req.headers;
  const ipAddress = req.ip;
  const language = headers["accept-language"];
  const software = headers["user-agent"];
  res.send({ipaddress: ipAddress, language: language, software: software});
});


app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});


// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
