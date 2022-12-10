const crypto = require('crypto');
const mailFunctions = require('../mainJS/mailFunctions.js')
const schemas = require('../schemas/schemas'); // schemas

function signUp(req, res){
    return res.render('index')
}

// sees if its a valid spyponders email
function testIfValidEmail(email){
    let regex = /\@spyponders\.com/;

    return regex.test(email);
}

// genreate email verifaction link
async function generateVerficationLink(req, res){
    const email = req.body.email;
    var token = crypto.randomBytes(16).toString('hex');
    // verify email
    if (!testIfValidEmail(email)) return res.send('not valid email');

    // add the user to the database if it doesnt exist
    var user = await schemas.users.findOne({"email": email});
    
    if (user == null || user == undefined){
        user = new schemas.users({
            "email": email,
            "verfied": false,
            "verifyLink": token,
            form: {'formId': ''}
        });

    } else if (user.verfied == false) {  // update verify link if not verfied
        user.verifyLink = token;
    } else if (user.verfied == true) { 
        return res.send('Email already verfied');
    }

    await user.save();

    // send link email to the email provided
    mailFunctions.mailLink(email, process.env.WEBSITELINK + 'verifyEmail/' + token);
    return res.send('Done!! Email sent');
}

// genreate link from email provided
function generateLink(email, token){    
    token = token == '' ? crypto.randomBytes(8).toString('hex') : token;
    // verify email, if something wrong happens return false
    if (!testIfValidEmail(email)) return false;
    
    // send link email to the email provided
    mailFunctions.mailLink(email, process.env.WEBSITELINK + 'form/' + token);

    return token;
}

function formPage(req, res){
    return res.send(req.params.id)
}

// verify email
async function verifyUserEmail(req, res){
    var verifyLink = req.params.verifyLink;
    var user = await schemas.users.findOne({"verifyLink": verifyLink});
    
    // if there are no user we dont need to do anything
    if (user == null || user == undefined) return res.send('Verify Link not found');

    // update the user to be verfied
    if (user.verfied == false){
        user.verfied = true;
    }
    // if there is a form already created for the user
    // send the link to the form  

    var formId = generateLink(user.email, user.form.formId);

    user.form.formId = formId;
    user.markModified('form');

    await user.save();


    return res.send('Form Link is sent to your email');
}

module.exports = {
    signUp,
    generateLink,
    formPage,
    verifyUserEmail,
    generateVerficationLink
}