const mongoose = require('mongoose')

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    email: {
        type: String,
        default: '',
    },
    password: {
        type: String,
        default: ''
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

//Export the model
module.exports = mongoose.model('User', userSchema);