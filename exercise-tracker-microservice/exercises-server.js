const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config({ path: './sample.env' });

// Importing models created with mongoose
const { User, Log, Exercise } = require("./models");

// Initializing connection to cluster
mongoose.connect(process.env['MONGO_URI'])
    .then(() => console.log('Initialized connection to db'))
    .catch((err) => console.log('Failed to connect to database: ', err));

// URL encoded to use .body and .params on req calls
app.use(bodyParser.urlencoded({ extended: false }));

// Basic HTML, CSS, and CORS config
app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

// Creating a new user and saving into db
app.post('/api/users', async (req, res) => {
    const originalUsername = req.body['username'];
    const userCreated = new User(
        { username: originalUsername });

    try {
        await userCreated.save();
        res.json(userCreated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Retrieving an array of all added users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().select('-__v');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
});

// Adding a new exercise for a user
app.post('/api/users/:_id/exercises', async (req, res) => {
    const userId = req.params['_id'];
    const { description, duration } = req.body;
    let { date } = req.body;

    if (!description || !duration)
        return res.status(400).json({ error: 'Description and duration are required!' });

    if (!date) {
        date = new Date();
    } else {
        date = new Date(date);
        if (isNaN(date.getTime())) {
            return res.status(400).json({ error: 'Invalid date format. Please use yyyy-mm-dd.' });
        }
    }

    try {
        const tempUser = await User.findById(userId).select('-__v');
        if (!tempUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const exerciseCreated = new Exercise({
            userId: tempUser._id,
            username: tempUser.username,
            description,
            duration,
            date
        });

        await exerciseCreated.save();
        res.json({
            username: tempUser['username'],
            description: exerciseCreated['description'],
            duration: exerciseCreated['duration'],
            date: exerciseCreated['date'].toDateString(), // Ensure date is in the correct format
            _id: tempUser['_id']
        });
    } catch (e) {
        console.log("Error saving new exercise: ", e);
        res.status(500).json({ error: 'Failed to add new exercise' });
    }
});

// Retrieving the full exercise log of any user
app.get('/api/users/:_id/logs', async (req, res) => {
    const userId = req.params._id;
    //query parameters
    const {from, to, limit} = req.query;

    try {
        const tempUser = await User.findById(userId).select('-__v');
        if (!tempUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { username } = tempUser;

        // creating an object to correct associate the query params with a filter
        let filter = {userId};
        if(from || to){
            filter.date = {};
            if(from){
                filter.date.$gte = new Date(from);
            }
            if(to){
                filter.date.$lte = new Date(to);
            }
        }

        let exercisesQuery = Exercise.find(filter).select('-__v -userId');
        if(limit){
            exercisesQuery = exercisesQuery.limit(parseInt(limit));
        }
        const userExercises = await exercisesQuery;
        const count = userExercises.length;

        //mapping changes to transform date on specified format
        const log = userExercises.map(exercise => ({
            description: exercise.description,
            duration: exercise.duration,
            date: exercise.date.toDateString()
        }));

        const createdLog = new Log({
            username,
            count,
            log
        });
        console.log('createdLog: ', createdLog);
        await createdLog.save();

        res.json({
            username,
            count,
            log
        });
    } catch (e) {
        console.log('Failed to create log: ', e);
        res.status(500).json({ error: 'Failed to create log' });
    }
});

const listener = app.listen(process.env.PORT, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});