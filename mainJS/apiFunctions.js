// Description: This file contains all the functions that will be used for api routes
// Api is for people who want to use the form maker to make forms for their own website

const schemas = require('../schemas/schemas');

async function checkAPI_KEY(req, res, next) {
    const apiKey = req.body.apiKey;
    if (apiKey != process.env.API_KEY) return res.status(403).send('Not authorized');
    next();
}

// allows to add an user to the form maker, using what the api user provides as the email and password
async function addUsertoFormMaker(req, res){
    const email = req.body.email;
    const password = req.body.password;

    if (email == undefined || password == undefined) return res.status(400).send('Email or password cannot be empty');
    if (email == '' || password == '') return res.status(400).send('Email or password cannot be empty');

    // check if the email is already in the database
    var doesItExist = await schemas.formMakerUsers.findOne({
        'email': { $eq: email }
    });

    // if it is already in the database, return an error
    if (doesItExist != null) return res.status(400).send('Account has already been made');

    // make a new user 
    const newUser = new schemas.formMakerUsers({
        email: email,
        password: password,
        forms: [],
    });

    newUser.save();
    return res.status(200).send('Account made');
}

async function accessUserForms(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    if (email == undefined || password == undefined) return res.status(400).send('Email or password cannot be empty');
    if (email == '' || password == '') return res.status(400).send('Email or password cannot be empty');

    // check if the email is already in the database
    var doesItExist = await schemas.formMakerUsers.findOne({
        'email': { $eq: email }
    });

    // if it is already in the database, return an error
    if (doesItExist == null) return res.status(400).send('Account does not exist');

    // check if the password is correct
    if (doesItExist.password != password) return res.status(400).send('Email or password is incorrect');

    // return the forms
    return res.status(200).send(doesItExist.forms);
}

module.exports = {
    addUsertoFormMaker,
    accessUserForms,
    checkAPI_KEY
}