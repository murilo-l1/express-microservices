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

// url encoded to use .body and .params on req calls
app.use(bodyParser.urlencoded({extended: false}));

//basic html, css and cors config
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// creating a new user and saving into bd
app.post('/api/users', async (req, res) => {
  const originalUsername = req.body['username'];
  const userCreated = new User(
      {
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

// when posting a new exercise we return an exercise object to the user
app.post('/api/users/:_id/exercises', async (req, res) => {
    const userId = req.params['_id'];
    const {description, duration} = req.body;
    let {date} = req.body;

    if(!description || !duration)
      return res.json({error: 'description and duration required!'});

    // if date inst provided, use the current
    if(!date){
        date = new Date();
    }else{
       date = new Date(date);
    }

    try {
      const tempUser = await User.findById(userId).select('-__v'); console.log(tempUser);

      if(!tempUser)
        return res.json({error: 'User not found'})

      const exerciseCreated = new Exercise(
    {
        _id: tempUser['_id'],
        username: tempUser['username'],
        description,
        duration,
        date: date
      });
      console.log('Exercise: ', exerciseCreated);

      await exerciseCreated.save();
      res.json({
          _id: exerciseCreated['_id'],
          username: exerciseCreated['username'],
          description: exerciseCreated['description'],
          duration: exerciseCreated['duration'],
          date: exerciseCreated['date'].toDateString()
      });
    }
    catch (e){
        console.log("Error saving user: ", e);
        res.status(500).json({error: 'Failed to add new exercise'});
    }
});

app.get('api/users/:_id/log', async (req, res) => {
    const userId = req.params['_id'];

    try{
        const tempUser = await User.findById(userId).select('-__v0');
        if(!tempUser){
            return res.status(500).json({error: 'User not found'});
        }
        const username = tempUser['username'];
        const exerciseCount = await Exercise.countDocuments({_id: userId});
        console.log(`${exerciseCount} exercises added by ${username}`);
        if(!exerciseCount){
            return res.status(500).json({error: 'Failed to retrieve count'})
        }

    }catch (e){
        console.log('Error creating the log: ', e);
        res.status(500).json({error: 'Failed to create log'});
    }

});


const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
