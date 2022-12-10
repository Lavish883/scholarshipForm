const crypto = require('crypto');
const fs = require('fs');


function signUp(req, res){
    return res.render('index')
}

function generateLink(req, res){
    console.log(req.body);
    
    const email = req.body.email;
    const token = crypto.randomBytes(8).toString('hex');
    console.log(token);

    return res.send('Done!! Email sent');
}

module.exports = {
    signUp,
    generateLink
}