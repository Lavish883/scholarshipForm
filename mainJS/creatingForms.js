// Handles basiclly part 3, creates new form
const schemas = require('../schemas/schemas');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mailFunctions = require('./mailFunctions');

const bcrpyt = require('bcrypt');

async function verifyUser(email, password) {
    var user = await schemas.formMakerUsers.findOne({ 
        'email': { $eq: email } 
    });

    if (!user) return { 'send': 'User does not exist', 'status': 400 };

    if (!bcrpyt.compareSync(password, user.password)) return { 'send': 'Password is incorrect', 'status': 403 };
    return user;
}

async function makeNewForm(req, res) {
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
                "formNameColor": "#000000",
                "formIntroductionColor": "#000000",
                "answerColor": "#000000",
                "questionBackgroundColor": "#ffffff",
                "formBackgroundColor": "#f5f5f5",
                "backgroundColor": "#292929",
                "formEndTextColor": "#ffffff"
            },
            "logoOnPdfImage": "",
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

    if (email == undefined || password == undefined) return res.status(400).send('Email or password cannot be empty');
    if (email == '' || password == '') return res.status(400).send('Email or password cannot be empty');

    // find the user with that email, update the password
    var user = await schemas.formMakerUsers.findOne({ 
        'email': { $eq: email }
    });

    // hash the password
    const hashedPassword = bcrpyt.hashSync(password, 10);
    // save the user to the database
    user.password = hashedPassword;

    await user.save();
    return res.status(200).send('Your account has been made, please login');
}

async function giveUserFormDeatils(req, res) {
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

async function serveLogoImage(req, res) {
    // find the user with that form 
    var formUser = await schemas.formMakerUsers.findOne({ 'forms.formId': req.params.formId, 'forms.formName': unescape(req.params.formName) });
    if (!formUser) return res.status(400).send('Form does not exist');

    // get the form from the user
    var form;
    for (var eachForm of formUser.forms) {
        if (eachForm.formId == req.params.formId) {
            form = eachForm;
        }
    }
    // now see if the logoOnPdfImage is empty or not
    if (form.formSettings.logoOnPdfImage == '' || form.formSettings.logoOnPdfImage == undefined) return res.send('');

    // now serve the image
    res.set('Content-Type', 'image/png');
    //console.log(form.formSettings.logoOnPdfImage);
    var imageBuffer = Buffer.from(form.formSettings.logoOnPdfImage.replace('data:image/png;base64,', ''), 'base64');

    return res.send(imageBuffer)
}

async function saveLogoImage(req, res) {
    // find the user with that form
    var formUser = await schemas.formMakerUsers.findOne({
        'forms.formId': { $eq: req.body.formId },
        'forms.formName': { $eq: unescape(req.body.formName) }
    });
    if (!formUser) return res.status(400).send('Form does not exist');

    // get the form from the user
    var form;
    for (var eachForm of formUser.forms) {
        if (eachForm.formId == req.body.formId) {
            form = eachForm;
        }
    }

    // now save the image
    form.formSettings.logoOnPdfImage = req.body.image;
    formUser.markModified('forms');
    await formUser.save();
    return res.status(200).send('Image saved');
}

async function confirmEmailWithCode(req, res) {
    if (req.body.email == undefined || req.body.email == '') return res.status(400).send('Email cannot be empty');
    if (req.body.code == undefined || req.body.code == '') return res.status(400).send('Code cannot be empty');

    // find the user with that email
    var user = await schemas.formMakerUsers.findOne({
        'email': { $eq: req.body.email }
    });
    if (!user) return res.status(400).send('That is weird, user with that email does not exist. Refresh the page and try again');

    // check if the code is correct
    if (user.verifyCode != req.body.code) return res.status(400).send('Code is incorrect');

    // check if the code has expired
    if (new Date() > user.expireDate) return res.status(400).send('Code has expired, please refresh the page and try to sign up again');

    // update the user
    user.verified = true;
    await user.save();

    return res.status(200).send('Email confirmed');
}

async function sendCodeEmail(req, res) {
    const email = req.body.email;
    if (email == undefined || email == '') return res.status(400).send('Email cannot be empty');

    // check if the email is already in the database
    var doesItExist = await schemas.formMakerUsers.findOne({
        'email': { $eq: email }
    });

    // if verified let the user know
    if (doesItExist != null && doesItExist.verified) return res.status(400).send('Account has already been made');

    var code = crypto.randomBytes(8).toString('hex');
    var expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 1);
    if (doesItExist == undefined || doesItExist == null) {
        // make a new user and send the email
        const newUser = new schemas.formMakerUsers({
            email: email,
            password: '',
            forms: [],
            verifyCode: code,
            verified: false,
            expireDate: expireDate
        });
        newUser.save();
    } else {
        // update the user and send the email
        doesItExist.verifyCode = code;
        doesItExist.expireDate = expireDate;
        await doesItExist.save();
    }

    mailFunctions.mailLink(email, 'Confirm your email \n' + 'Your code is: ' + code, [], 'Confirm your email');
    return res.status(200).send('Email sent');
}

async function passwordReset(req, res) {
    // the way we structured sign up, all we can do is set verified to false and then they can use sign up to change the password
    // find the user with that email
    if (req.body.email == undefined || req.body.email == '') return res.status(400).send('Email cannot be empty');
    var user = await schemas.formMakerUsers.findOne({
        'email': { $eq: req.body.email }
    });

    user.verified = false;
    await user.save();
    return res.status(200).send('Done');
}

module.exports = {
    makeNewForm,
    makeNewFormMakerUser,
    deleteForm,
    giveUserFormDeatils,
    formMakerLogin,
    serveLogoImage,
    saveLogoImage,
    sendCodeEmail,
    confirmEmailWithCode,
    passwordReset
}