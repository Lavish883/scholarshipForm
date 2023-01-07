const schemas = require('../schemas/schemas'); // schemas


// get user from the database
async function getUser(formId){
    return await schemas.users.findOne({'form.formId': formId});
}


// save form to the database
async function saveForm(req, res){
    console.log('got here')
    const formId = req.body.formId;
    const bodyForm = req.body.form;

    var user = await getUser(formId);

    if (user == null) {
        res.setStatusCode(403);
        return res.send('User not found');
    }
    
    // create a new buffer from the image
    const imageBuffer = Buffer.from(bodyForm.image, 'base64');
    console.log(imageBuffer);
    
    user.form.image = bodyForm.image;
    user.markModified('form');
    await user.save();  

    return res.send('Done!!' + formId);
}

module.exports = saveForm;