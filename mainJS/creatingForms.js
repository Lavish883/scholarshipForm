// Handles basiclly part 3, creates new form
const schemas = require('../schemas/schemas');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrpyt = require('bcrypt');

async function verifyUser(email, password){
    var user = await schemas.formMakerUsers.findOne({'email': email});

    if (!user) return {'send': 'User does not exist', 'status': 400 };

    if (!bcrpyt.compareSync(password, user.password)) return {'send': 'Password is incorrect', 'status': 403 };
    return user;
}

async function makeNewForm(req, res){
    // get user from the database and check password or does it exist or not
    var verfiedUser = await verifyUser(req.body.email, req.body.password);
    if (verfiedUser.email == undefined) return res.status(verfiedUser.status).send(verfiedUser.send);

    var userAlreadyMadeForms = verfiedUser.forms; 
    // make new adminKeyForForm, and formId
    const adminKeyForForm = crypto.randomBytes(16).toString('hex');
    var formId = crypto.randomBytes(5).toString('hex');

    // check if the user has already made 30 forms
    if (userAlreadyMadeForms.length >= 30) return res.status(400).send('You have already made 30 forms, please delete one before making a new one');

    // check if the formId already exists or not for that user
    while (userAlreadyMadeForms.indexOf(formId) != -1) {
        formId = crypto.randomBytes(5).toString('hex');
    }

    // make new form
    const newForm = {
        formId: formId,
        adminKeyForForm: adminKeyForForm,
        formName: req.body.formName,
        form: {},
        formSettings: {
            "theme": {
                
            }
        }
    }
    // make a new collection for the form
    // make a new schma

    const newCollection = mongoose.model(formId + '-' + adminKeyForForm.slice(10), schemas.userSchema, formId + '-' + adminKeyForForm.slice(10));
    newCollection.createCollection();
    
    // save the user 
    verfiedUser.forms.push(newForm);
    await verfiedUser.save();
    return res.status(200).send(verfiedUser.forms);
}
// handles the user making for the new user
async function makeNewFormMakerUser(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    // check if the email is already in the database
    var doesItExist = await schemas.formMakerUsers.findOne({ 'email': email });
    
    if (doesItExist) return res.status(400).send('User already exists!!');

    // hash the password
    const hashedPassword = bcrpyt.hashSync(password, 10);
    // save the user to the database
    const newUser = new schemas.formMakerUsers({
        email: email,
        password: hashedPassword,
        forms: [],
    });

    await newUser.save();
    return res.status(200).send('User created');
}

async function giveUserFormDeatils(req, res){
    // get user from the database and check password or does it exist or not
    var verfiedUser = await verifyUser(req.body.email, req.body.password);
    if (verfiedUser.email == undefined) return res.status(verfiedUser.status).send(verfiedUser.send);

    var userAlreadyMadeForms = verfiedUser.forms; 

    return res.json(userAlreadyMadeForms);
}

async function deleteForm(req, res) {
    // get user from the database and check password or does it exist or not
    var verfiedUser = await verifyUser(req.body.email, req.body.password);
    if (verfiedUser.email == undefined) return res.status(verfiedUser.status).send(verfiedUser.send);

    var userAlreadyMadeForms = verfiedUser.forms;
    for (var i = userAlreadyMadeForms.length - 1; i >= 0; i--) {
        if (userAlreadyMadeForms[i].formId == req.body.formId) {
            userAlreadyMadeForms.splice(i, 1);
            await verfiedUser.save();
            return res.status(200).send(userAlreadyMadeForms);
        }
    }

    return res.status(400).send('Form does not exist');
}

async function formMakerLogin(req, res) {
    return res.render('formMakerLogin');
}

module.exports = {
    makeNewForm,
    makeNewFormMakerUser,
    deleteForm,
    giveUserFormDeatils,
    formMakerLogin
}