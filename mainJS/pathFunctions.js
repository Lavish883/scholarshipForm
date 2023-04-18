const crypto = require('crypto');
const mongoose = require('mongoose');
const mailFunctions = require('../mainJS/mailFunctions.js');
const schemas = require('../schemas/schemas'); // schemas

//const formOptions = require('../mainJS/formOptions.js');
const makeFormHTML = require('../mainJS/makeFormHTML.js');

const makePDF = require('../mainJS/makePDF.js');

// if userId is given it will return one user, if not it will return all users
async function accessCollectionOfUsers(collectionName, userId = null) {
    var allItems;
    const newCollection = mongoose.model(collectionName, schemas.userSchema, collectionName);
    if (userId == null) {
        allItems = await newCollection.find({});
    } else {
        allItems = await newCollection.findOne({ 'userId': userId });
    }

    return allItems;
}

function findForm(formUser, formId) {
    var actualForm;
    for (var form of formUser.forms) {
        if (form.formId == formId) {
            actualForm = form;
            break;
        }
    }
    return actualForm;
}

async function signUp(req, res) {
    var formUser = await schemas.formMakerUsers.findOne({ 'forms.formId': req.params.formId, 'forms.formName': req.params.formName });
    if (formUser == null || formUser == undefined) return res.status(404).send('Form not found');
    var formOptions = findForm(formUser, req.params.formId);
    // another check to verify it is allowed
    if (formOptions.adminKeyForForm.slice(-5) != req.params.adminKey) return res.status(403).send('Not authorized');

    return res.render('signUp')
}

// sees if its a valid spyponders email
function testIfValidEmail(email) {
    let regex = /\@spyponders\.com/;

    return regex.test(email);
}

// genreate email verifaction link
async function generateVerficationLink(req, res) {
    // see if the form is valid or not
    var formUser = await schemas.formMakerUsers.findOne({ 'forms.formId': req.body.formId, 'forms.formName': unescape(req.body.formName) });
    if (formUser == null || formUser == undefined) return res.status(404).send('Form not found');

    var formOptions = findForm(formUser, req.body.formId);
    // another check to verify it is allowed
    if (formOptions.adminKeyForForm.slice(-5) != req.body.adminKey) return res.status(403).send('Not authorized');

    // get all the users who are signed up for this form
    const collectionName = req.body.formId + '-' + formOptions.adminKeyForForm.slice(10);
    const newCollection = mongoose.model(collectionName, schemas.userSchema, collectionName);

    var user = await newCollection.findOne({ 'email': req.body.email });
    var token = crypto.randomBytes(16).toString('hex');
    var email = req.body.email;
    // does any other user have the same token
    var doesItExist = await schemas.users.findOne({ 'verifyLink': token });

    // do this if user doesnt exist for that form 
    if (user == null || user == undefined) {
        // if (!testIfValidEmail(email)) return res.status(400).send('not valid email');
        while (doesItExist != null) {
            token = crypto.randomBytes(16).toString('hex');
            doesItExist = await schemas.users.findOne({ 'verifyLink': token });
        }

        user = new schemas.users({
            "email": email,
            "verfied": false,
            "verifyLink": token,
            form: { 'image': '' }
        });
        // add the form to the database
        newCollection.insertMany(user);

    } else if (user.verfied == false) {  // update verify link if not verfied
        user.verifyLink = token;
    } else if (user.verfied == true) {
        mailFunctions.mailLink(user.email, process.env.WEBSITELINK + `form/${req.body.formName}/${req.body.adminKey}/${req.body.formId}/${user.userId}`), [], "Your Form Link";
        return res.status(200).send('Email already verfied! Form Link Sent to Mail');
    }

    await user.save();

    // send link email to the email provided
    mailFunctions.mailLink(email, process.env.WEBSITELINK + `verifyEmail/${req.body.formName}/${req.body.adminKey}/${req.body.formId}/` + token, [], "Verify Email");
    return res.send('Done!! Email sent');
}

// genreate link from email provided
async function generateLink(email, token) {
    token = token == '' ? crypto.randomBytes(8).toString('hex') : token;
    // verify email, if something wrong happens return false
    if (!testIfValidEmail(email)) return false;
    // check if that formId already exists or not
    var doesItExist = await schemas.users.findOne({ 'form.formId': token });

    while (doesItExist != null) {
        token = crypto.randomBytes(8).toString('hex');
        doesItExist = await schemas.users.findOne({ 'form.formId': token });
    }

    //console.log(token);
    // send link email to the email provided
    mailFunctions.mailLink(email, process.env.WEBSITELINK + 'form/' + token, [], "Your Form Link");

    return token;
}

async function formPage(req, res) {
    // find the form
    var formUser = await schemas.formMakerUsers.findOne({ 'forms.formId': req.params.formId, 'forms.formName': req.params.formName });
    if (formUser == null || formUser == undefined) return res.status(404).send('Form not found');
    var formOptions = findForm(formUser, req.params.formId);
    // another check to verify it is allowed
    if (formOptions.adminKeyForForm.slice(-5) != req.params.adminKey) return res.status(403).send('Not authorized');
    // find the user
    var user = await accessCollectionOfUsers(req.params.formId + '-' + formOptions.adminKeyForForm.slice(10), req.params.userId);
    if (user == null || user == undefined) return res.status(404).send('User not found');
    // form HTML
    var formHTML = makeFormHTML(formOptions.form, user);
    var image = `/image/${req.params.formName}/${req.params.adminKey}/${req.params.formId}/${req.params.userId}`

    return res.render('form', { 'user': user, 'formHTML': formHTML, 'image': image });
}

// verify email
async function verifyUserEmail(req, res) {
    // see if the form is valid or not
    var formUser = await schemas.formMakerUsers.findOne({ 'forms.formId': req.params.formId, 'forms.formName': req.params.formName });
    if (formUser == null || formUser == undefined) return res.status(404).send('Form not found');

    var formOptions = findForm(formUser, req.params.formId);

    // another check to verify it is allowed
    if (formOptions.adminKeyForForm.slice(-5) != req.params.adminKey) return res.status(403).send('Not authorized');

    // get all the users who are signed up for this form
    const collectionName = req.params.formId + '-' + formOptions.adminKeyForForm.slice(10);
    const newCollection = mongoose.model(collectionName, schemas.userSchema, collectionName);
    
    // get the user from the database
    var user = await newCollection.findOne({ "verifyLink": req.params.verifyLink });
    // if there are no user we dont need to do anything
    if (user == null || user == undefined) return res.send('Verify Link not found or expired !!!');
    
    // if a form id already exists for the user
    // send the link to the form
    if (user.userId != undefined) {
        mailFunctions.mailLink(user.email, encodeURI(process.env.WEBSITELINK + `form/${req.params.formName}/${req.params.adminKey}/${req.params.formId}/${user.userId}`), [], "Your Form Link");
        return res.send('Form Link is sent to your email');
    }

    // update the user to be verfied
    if (user.verfied == false) {
        user.verfied = true;
    }

    var userId = crypto.randomBytes(8).toString('hex');
    var doesItExist = await newCollection.findOne({ "userId": userId });

    while (doesItExist != null) {
        userId = crypto.randomBytes(8).toString('hex');
        doesItExist = await newCollection.findOne({ "userId": userId });
    }
    // type object must be marked as modified to be saved in mongoDB

    user.userId = userId;
    user.markModified('form');

    await user.save();
    mailFunctions.mailLink(user.email, encodeURI(process.env.WEBSITELINK + `form/${req.params.formName}/${req.params.adminKey}/${req.params.formId}/${user.userId}`), [], "Your Form Link");
    return res.send('Form Link is sent to your email');
}

// serve images from the database
async function serveImage(req, res) {
    // find the formId from the database
    var formUser = await schemas.formMakerUsers.findOne({ 'forms.formId': req.params.formId, 'forms.formName': req.params.formName });

    if (formUser == null || formUser == undefined) return res.status(403).send('Not Authorized !!! Check the password or contact the admin');
    var formOptions = findForm(formUser, req.params.formId);
    if (formOptions.adminKeyForForm.slice(-5) != req.params.adminKey) return res.status(403).send('Not authorized');

    // find the user
    var user = await accessCollectionOfUsers(req.params.formId + '-' + formOptions.adminKeyForForm.slice(10), req.params.userId);
    if (user == null || user == undefined) return res.status(404).send('User not found');


    res.set('Content-Type', 'image/jpeg');

    if (user.form.image == undefined || user.form.image == null) {
        return res.send('');
    }
    var imageBuffer = Buffer.from(user.form.image.replace('data:image/jpeg;base64,', ''), 'base64');

    return res.send(imageBuffer);
}

async function filterDataPage(req, res) {
    // check if the user is authorized or not
    // find the formId from the database
    var formUser = await schemas.formMakerUsers.findOne({ 'forms.formId': req.params.formId, 'forms.formName': req.params.formName, 'forms.adminKeyForForm': req.params.adminKey });

    if (formUser == null || formUser == undefined) return res.status(403).send('Not Authorized !!! Check the password or contact the admin');
    // find the form from the database
    var formOptions = findForm(formUser, req.params.formId);


    return res.render('filterData', { 'formOptions': formOptions.form });
}

async function userPage(req, res) {
    // check if the user is authorized or not
    if (req.params.password != process.env.ACCESS_KEY) return res.status(403).send('Not Authorized !!! Check the password or contact the admin');

    var user = await schemas.users.findOne({ 'form.formId': req.params.formId });

    user.form.image = '';

    return res.json(user);
}

async function pdfPage(req, res) {
    // find the formId from the database
    var formUser = await schemas.formMakerUsers.findOne({ 'forms.formId': req.params.formId, 'forms.formName': req.params.formName });
    if (formUser == null || formUser == undefined) return res.status(403).send('Not Authorized !!! Check the password or contact the admin');

    var formOptions = findForm(formUser, req.params.formId);
    if (process.env.ACCESS_KEY != req.params.adminKey) return res.status(403).send('Not authorized');

    // find the user
    var user = await accessCollectionOfUsers(req.params.formId + '-' + formOptions.adminKeyForForm.slice(10), req.params.userId);
    if (user == null || user == undefined) return res.status(404).send('User not found');

    // to reduce json size
    user.form.image = '';
    var imageURL = `/image/${req.params.formName}/${formOptions.adminKeyForForm.slice(-5)}/${req.params.formId}/${req.params.userId}`
    // after those checks you can render the pdf page
    return res.render('pdf', { 'userForm': user.form, 'formOptions': formOptions.form, 'imageURL': imageURL });
}

async function downloadPDF(req, res) {
    // find the formId from the database
    var formUser = await schemas.formMakerUsers.findOne({ 'forms.formId': req.params.formId, 'forms.formName': req.params.formName });
    if (formUser == null || formUser == undefined) return res.status(403).send('Not Authorized !!! Check the password or contact the admin');

    var formOptions = findForm(formUser, req.params.formId);
    if (req.params.adminKey != formOptions.adminKeyForForm.slice(-5)) return res.status(403).send('Not authorized');

    // find the user
    var user = await accessCollectionOfUsers(req.params.formId + '-' + formOptions.adminKeyForForm.slice(10), req.params.userId);
    if (user == null || user == undefined) return res.status(404).send('User not found');


    makePDF(req.params.formName, req.params.formId, user.userId).then(pdf => {
        res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
        res.send(pdf)
    })
}

async function editFormPage(req, res){
    // check if the user is authorized or not
    // find the formId from the database
    var formUser = await schemas.formMakerUsers.findOne({ 'forms.formId': req.params.formId, 'forms.formName': req.params.formName, 'forms.adminKeyForForm': req.params.adminKey });

    if (formUser == null || formUser == undefined) return res.status(403).send('Not Authorized !!! Check the password or contact the admin');
    // find the form from the database
    var formOptions = findForm(formUser, req.params.formId);

    return res.render('editForm', { 'formOptions': formOptions.form });
}

async function saveEditedForm(req, res){
    // check if the user is authorized or not
    var formUser = await schemas.formMakerUsers.findOne({ 'forms.formId': req.body.formId, 'forms.formName': unescape(req.body.formName), 'forms.adminKeyForForm': req.body.adminKey });
    if (formUser == null || formUser == undefined) return res.status(403).send('Not Authorized !!! Check the password or contact the admin');
    
    console.log(req.body);
    // find that spefic form of the user
    for (var i = 0; i < formUser.forms.length; i++) {
        if (formUser.forms[i].formId == req.body.formId) {
            console.log('found');
            formUser.forms[i].form = req.body.formOptions;
        }
    }
    formUser.markModified('forms');
    await formUser.save();

    return res.status(200).send("Form Saved");
}

// 404 page
async function notFound(req, res) {
    return res.status(404).send('Page Not Found');
}


module.exports = {
    signUp,
    generateLink,
    formPage,
    verifyUserEmail,
    generateVerficationLink,
    serveImage,
    filterDataPage,
    userPage,
    pdfPage,
    downloadPDF,
    notFound,
    editFormPage,
    saveEditedForm
}