const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* 
    Don't touch schmeas as it is very important 
    And wrong step can cause a lot of issues
    Overall databases are scary so pease be careful while using them
*/

/*
    {
      "email": "l@spyponderscom",
        "verfied": false,
         // if one is already present get rid of that one and instead add new one
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
    },
    "submittedForm": {
        type: Boolean,
        default: false
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
    },
    "forms": {
        type: Array,
    },
    "verifyCode": {
        type: String
    },
    "verified": {
        type: Boolean,
    },
    "expireDate": {
        type: String
    }
}, {timestamps: true})

const formMakerUsers = mongoose.model('formMakerUsers', formMakerSchema)

const formAuthTokensSchema = new Schema({
    "formName": {
        type: String,
        required: true
    },
    "formId": {
        type: String,
        required: true
    },
    "formAdminKey": {
        type: String,
        required: true
    },
    "userId": {
        type: String,
        required: true
    },
    "userEmail": {
        type: String,
        required: true
    },
    "token": {
        type: String,
        required: true
    },
    "code": {
        type: String,
        required: true
    },
}, {timestamps: true})

const formAuthTokens = mongoose.model('formAuth', formAuthTokensSchema)

module.exports = {
    users,
    forms,
    formMakerUsers,
    userSchema,
    formAuthTokens
}