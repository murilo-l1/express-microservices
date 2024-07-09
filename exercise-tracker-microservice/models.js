const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {type: String, required: true}
});

const User = mongoose.model('User', userSchema);

const exerciseSchema = new Schema({
    _id: {type: Number, required: true},
    username: {type: String, required: true},
    description: {type: String, required: true},
    duration: {type: Number, required: true},
    date: {type: Date},
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

const logSchema = new Schema({
    username: {type: String},
    count: {type: Number},
    log: [{
        description: {type: String},
        duration: {type: Number},
        date: {type: Date}
    }]
});

const Log = mongoose.model('Log', logSchema);

module.exports = {User, Exercise, Log};