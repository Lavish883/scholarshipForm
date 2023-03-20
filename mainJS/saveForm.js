const schemas = require('../schemas/schemas'); // schemas
const mailFunctions = require('../mainJS/mailFunctions.js');
const makePDF = require('../mainJS/makePDF.js');

const messages = [
    'Thank you for submitting the form. You can always come back and edit it with this link: ',
]

// get user from the database
async function getUser(formId){
    return await schemas.users.findOne({'form.formId': formId});
}

// save form to the database
async function saveForm(req, res){
    console.log('got here')
    const formId = req.body.formId;
    const bodyForm = req.body.form;
    const finishedWithForm = req.body.finishedWithForm;

    var user = await getUser(formId);

    // if user is not found
    if (user == null) {
        return res.status(403).send('User not found');
    }
    
    // console.log(bodyForm.values)

    // update the form
    for (var key in bodyForm.values){
        user.form[key] = bodyForm.values[key];
    }

    //console.log(bodyForm.image)
    if (bodyForm.image !== undefined) {
        user.form.image = bodyForm.image;
        user.form.imageHeight = bodyForm.imageHeight;
        user.form.imageWidth = bodyForm.imageWidth;
    }
    
    // if user is finished with the form mark it as done and send an email
    if (finishedWithForm == true) {
        user.finishedWithForm = true;
        makePDF(user.form.formId).then(pdf => {
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

    return res.send('Done!!' + formId);
}

module.exports = saveForm;