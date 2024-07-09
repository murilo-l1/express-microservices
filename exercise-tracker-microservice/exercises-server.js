const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config({path: './sample.env'});

//importing models created with mongoose
const {User, Log, Exercise} = require("./models");

//initializing connection to cluster
mongoose.connect(process.env['MONGO_URI'])
    .then(() => console.log('Initialized connection to db'))
    .catch((err) => console.log('Failed to connect to database: ', err))

app.use(bodyParser.urlencoded({extended: false}));

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// creating a new user and saving into bd
app.post('/api/users', async (req, res) => {
  const originalUsername = req.body['username'];
  const userCreated = new User({
    username: originalUsername
  });
  try{
    await userCreated.save();
    res.json(userCreated);
  }
  catch(err){
    res.status(500).json({error: 'Failed to create user'});
  }
});

// when making a request to endpoint of users we can retrieve an array of all added users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-__v'); // Exclude the __v field, 'stringify' problems
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

app.post('/api/users/:_id/exercises', async (req, res) => {
    const userId = req.params['_id'];
    let {description, duration, date} = req.body;

    if(!description || !duration)
      return res.json({error: 'description and duration required!'});

    if(!date)
        date = new Date();

    let tempUser;
    try {
      tempUser = await User.findById(userId).select('-__v');
      console.log(tempUser);
      if(!tempUser)
        return res.json({error: 'User not found'})

      const newExercise = new Exercise({
        _id: tempUser._id,
        username: tempUser['username'],
        description: description,
        duration: duration,
        date: date.toDateString()
      });

      await newExercise.save();
      res.json(newExercise);
    }
    catch (e){
        res.status(500).json({error: 'Operation failed'})
    }
});



const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
