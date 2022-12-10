const crypto = require('crypto');
const fs = require('fs');
const mailFunctions = require('../mainJS/mailFunctions.js')

function signUp(req, res){
    return res.render('index')
}

function generateLink(req, res){    
    const email = req.body.email;
    const token = crypto.randomBytes(8).toString('hex');
    
    console.log(token, email);
    mailFunctions.mailLink(email, 'https://lavish883-turbo-space-succotash-7w4gv5rp5xrfp95v-8080.preview.app.github.dev/form/' + token);
    return res.send('Done!! Email sent');
}

function formPage(req, res){
    return res.send(req.params.id)
}

module.exports = {
    signUp,
    generateLink,
    formPage
}