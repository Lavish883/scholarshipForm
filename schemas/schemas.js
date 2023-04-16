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
    },
    "userId": {
        type: String,
    }
}, {timestamps: true})


const users = mongoose.model('users', userSchema)

const formSchema = new Schema({
    "formOptions": {
        type: Object,
        required: true
    },
    "name": {
        type: String,
    },
    "formAdminKey": {
        type: String,
        required: true
    },
}, {timestamps: true})

const forms = mongoose.model('forms', formSchema)

const formMakerSchema = new Schema({
    "email": {
        type: String,
        required: true
    },
    "password": {
        type: String,
        required: true
    },
    "forms": {
        type: Array,
        required: true
    }
}, {timestamps: true})

const formMakerUsers = mongoose.model('formMakerUsers', formMakerSchema)

module.exports = {
    users,
    forms,
    formMakerUsers,
    userSchema
}

