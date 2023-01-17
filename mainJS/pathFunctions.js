const crypto = require('crypto');
const mailFunctions = require('../mainJS/mailFunctions.js')
const schemas = require('../schemas/schemas'); // schemas

const formOptions = require('../mainJS/formOptions.js');
const makeFormHTML = require('../mainJS/makeFormHTML.js');

function signUp(req, res) {
    return res.render('index')
}

// sees if its a valid spyponders email
function testIfValidEmail(email) {
    let regex = /\@spyponders\.com/;

    return regex.test(email);
}

// genreate email verifaction link
async function generateVerficationLink(req, res) {
    const email = req.body.email;
    var token = crypto.randomBytes(16).toString('hex');
    // verify email
    if (!testIfValidEmail(email)) return res.status(400).send('not valid email');
    // check if the verify link already exists or not
    var doesItExist = await schemas.users.findOne({ 'verifyLink': token });

    while (doesItExist != null) {
        token = crypto.randomBytes(16).toString('hex');
        doesItExist = await schemas.users.findOne({ 'verifyLink': token });
    }

    // add the user to the database if it doesnt exist
    var user = await schemas.users.findOne({ "email": email });

    if (user == null || user == undefined) {
        user = new schemas.users({
            "email": email,
            "verfied": false,
            "verifyLink": token,
            form: { 'formId': '', 'image': '' }
        });
    } else if (user.verfied == false) {  // update verify link if not verfied
        user.verifyLink = token;
    } else if (user.verfied == true) {
        mailFunctions.mailLink(email, process.env.WEBSITELINK + 'form/' + user.form.formId);
        return res.status(200).send('Email already verfied! Form Link Sent to Mail');
    }

    await user.save();

    // send link email to the email provided
    mailFunctions.mailLink(email, process.env.WEBSITELINK + 'verifyEmail/' + token);
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
    mailFunctions.mailLink(email, process.env.WEBSITELINK + 'form/' + token);

    return token;
}

async function formPage(req, res) {
    var user = await schemas.users.findOne({ 'form.formId': req.params.id });
    // check if user exits with that formId
    if (user == null || user == undefined) return res.send('Form Id is not found');
    // form HTML
    var formHTML = makeFormHTML(formOptions, user);

    return res.render('form', { 'user': user, 'formHTML': formHTML });
}

// verify email
async function verifyUserEmail(req, res) {
    var verifyLink = req.params.verifyLink;
    var user = await schemas.users.findOne({ "verifyLink": verifyLink });

    // if there are no user we dont need to do anything
    if (user == null || user == undefined) return res.send('Verify Link not found');
    // if a form id already exists for the user
    // send the link to the form
    if (user.form.formId != '') {
        mailFunctions.mailLink(user.email, process.env.WEBSITELINK + 'form/' + user.form.formId);
        return res.send('Form Link is sent to your email');
    }

    // update the user to be verfied
    if (user.verfied == false) {
        user.verfied = true;
    }
    // if there is a form already created for the user
    // send the link to the form  

    var formId = await generateLink(user.email, user.form.formId);
    // type object must be marked as modified to be saved in mongoDB

    user.form.formId = formId;
    user.markModified('form');

    await user.save();


    return res.send('Form Link is sent to your email');
}

// serve images from the database
async function serveImage(req, res) {
    const formId = req.params.id;
    var user = await schemas.users.findOne({ 'form.formId': formId });
    // check if user exits with that formId
    if (user == null || user == undefined) return res.send('Image is not found');

    res.set('Content-Type', 'image/jpeg');

    if (user.form.image == undefined || user.form.image == null){
        return res.send('');
    }
    var imageBuffer = Buffer.from(user.form.image.replace('data:image/jpeg;base64,', ''), 'base64');

    return res.send(imageBuffer);
}

async function filterDataPage(req, res) {
    // check if the user is authorized or not
    if (req.params.password != process.env.ACCESS_KEY) return res.status(403).send('Not Authorized !!! Check the password or contact the admin');

    return res.render('filterData', { 'formOptions': formOptions });
}


module.exports = {
    signUp,
    generateLink,
    formPage,
    verifyUserEmail,
    generateVerficationLink,
    serveImage,
    filterDataPage,
}