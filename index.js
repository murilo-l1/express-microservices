const express = require('express');
const app = express();

let date;
let unix;
// cors enabled so your API is remotely testable by FCC
const cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204


app.use(express.static('public'));


app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

//empty date case
app.get('/api/', (req, res) => {
  date = new Date().toUTCString();
  unix = Date.now();
  res.json({unix: unix, utc: date});
});

app.get('/api/:date', (req, res) => {

});



const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
