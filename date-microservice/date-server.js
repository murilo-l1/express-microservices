const express = require('express');
const app = express();

// cors enabled so your API is remotely testable by FCC
const cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204


app.use(express.static('public'));


app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

//empty date case
app.get('/api/', (req, res) => {
  const date = new Date().toUTCString();
  const unix = Date.now();
  res.json({unix: unix, utc: date});
});

// case when a valid date/unix time is passed as endpoint
app.get('/api/:date', (req, res) => {
  let date;
  const requestedDate = req.params['date'];

  // if is a unix value treat as a number
  if(Number.isInteger(Number(requestedDate))){
    date = new Date(Number(requestedDate));
  }else{
    date = new Date(requestedDate);
  }

  if(isNaN(date.getTime())){
    res.json({error: "Invalid date"});
  }else {
    const unixTime = date.getTime();
    const formattedDate = date.toUTCString();
    res.json({unix: unixTime, utc: formattedDate});
  }

});


const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
