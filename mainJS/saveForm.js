const schemas = require('../schemas/schemas'); // schemas
const mailFunctions = require('../mainJS/mailFunctions.js');
const makePDF = require('../mainJS/makePDF.js');
const mongoose = require('mongoose');

const messages = [
    'Thank you for submitting the form. You can always come back and edit it with this link: ',
]

// get user from the database
async function getUser(formId){
    return await schemas.users.findOne({'form.formId': formId});
}

// if userId is given it will return one user, if not it will return all users
async function accessCollectionOfUsers(collectionName, userId = null) {
    var allItems;
    const newCollection = mongoose.model(collectionName, schemas.userSchema, collectionName);
    if (userId == null) {
        allItems = await newCollection.find({});
    } else {
        allItems = await newCollection.findOne({'userId': userId});
    }

    return allItems;
}

function findForm(formUser, formId){
    var actualForm;
    for (var form of formUser.forms) {
        if (form.formId == formId) {
            actualForm = form;
            break;
        }
    }
    return actualForm;
}

// save form to the database
async function saveForm(req, res){

    // get the form from the database and verify it is allowed
    var formUser = await schemas.formMakerUsers.findOne({ 'forms.formId': req.body.formId, 'forms.formName': req.body.formName});
    if (formUser == null || formUser == undefined) return res.status(404).send('Form not found');
    var formOptions = findForm(formUser, req.body.formId);
    // another check to verify it is allowed
    if (formOptions.adminKeyForForm.slice(-5) != req.body.adminKey) return res.status(403).send('Not authorized');

    // find the user
    var user = await accessCollectionOfUsers(req.body.formId + '-' + formOptions.adminKeyForForm.slice(10), req.body.userId);  
    if (user == null || user == undefined) return res.status(404).send('User not found');
    
    const bodyForm = req.body.form;
    const finishedWithForm = req.body.finishedWithForm;
    

    // console.log(bodyForm.values)

    // update the form
    for (var key in bodyForm.values){
        user.form[key] = bodyForm.values[key];
    }
    //user.form.image = bodyForm.image;

    //console.log(bodyForm.image)
    if (typeof bodyForm.image != 'undefined') {
        user.form.image = bodyForm.image;
        user.form.imageHeight = bodyForm.imageHeight;
        user.form.imageWidth = bodyForm.imageWidth;
    }

    
    // if user is finished with the form mark it as done and send an email
    if (finishedWithForm == true) {
        user.finishedWithForm = true;
        // make pdf and send email
        makePDF(formOptions, req.body.userId).then(pdf => {
            // make pdf to base64 pdf string so we can send it as an attachment
            var pdfString = pdf.toString('base64');
            // send email with the pdf attached
            mailFunctions.mailLink(user.email, messages[0] + process.env.WEBSITELINK + 'form/' + user.form.formId, [{
                filename: 'organizedForm.pdf',
                content: pdfString,
                encoding: 'base64'
            }], "Scholarship Form submitted");
        })
    }

    user.markModified('form');

    await user.save();  
    return res.send('Done!!' + req.body.userId);
}

module.exports = saveForm;