const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* Don't touch scheams as it is very important 
    And wrong step can cause a lot of issues
    Overall databses are scary so pease be careful while using them
*/

/*
    {
      "email": "l@spyponderscom",
        "verfied": false,
         // if one alreday prenst get rid of that one and instead add new one
        "verifyLink": ""
        }
*/ 
const userSchema = new Schema({
    "email": {
        type: String,
        required: true
    },
    "verfied": {
        type: Boolean,
        required: true
    }, 
    "verifyLink": {
        type: String,
        required: true
    }, 
    "form": {
        type: Object,
        required: true
    }

}, {timestamps: true})


const users = mongoose.model('users', userSchema)

module.exports = {
    users
}

