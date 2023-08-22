const express = require('express');
const mongoose = require('mongoose');
const filterData = require('./mainJS/filterThroughData');
const app = express();
const PORT = process.env.PORT || 3030;
const pathFunctions = require('./mainJS/pathFunctions');
const createFormFuctions = require('./mainJS/creatingForms');
const saveForm = require('./mainJS/saveForm');
const downloadPDFisInBulk = require('./mainJS/downloadPDFisInBulk');
const rateLimiter = require('./mainJS/rateLimiter.js').databaseAccessLimiter;
const imageLimiter = require('./mainJS/rateLimiter.js').imageLimiter;

// conenct to the database
const dbURI = process.env.DB_URL;
mongoose.set('strictQuery', false);
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })

// set up the server 
app.set('view engine', 'pug');
app.use(express.static('public'))
// max size of the file is 5mb
// so we can get json data over 5mb
app.use(express.json({ extended: true, limit: "5mb" }));

require('dotenv').config();


// for users to sign up to the form - updated
app.get('/form/signup/:formName/:adminKey/:formId', rateLimiter, pathFunctions.signUp);
// used to genreate new link
// email needs to be verfied first
//app.post('/createNewLink', pathFunctions.generateLink);

// create a new verify link for the form - updated  
app.post('/createVerifyLink', rateLimiter, pathFunctions.generateVerficationLink);

// verify email - updated to keep up with the database
app.get('/verifyEmail/:formName/:adminKey/:formId/:verifyLink', rateLimiter, pathFunctions.verifyUserEmail);

// display the form to the user, needs password so no one can else access it use jwt
// ?jwt=token, if the token is valid then the user can access the form
app.get('/form/:formName/:adminKey/:formId/:userId', rateLimiter, pathFunctions.formPage);
app.post('/form/verifyFormAccess', rateLimiter, pathFunctions.verifyFormAccess)

// serve all images - updated
app.get('/image/:formName/:adminKey/:formId/:userId', imageLimiter, pathFunctions.serveImage);

// save the form to the database - updated
app.post('/saveForm', rateLimiter, saveForm);

// filter data page - updated
app.get('/filterData/:formName/:adminKey/:formId', rateLimiter, pathFunctions.filterDataPage)

// filter data - updated
app.post('/search/:formName/:adminKey/:formId', rateLimiter, filterData);

// pdf page for sending it to the user, needs password so no one can else access it - updated
app.get('/pdf/:formName/:adminKey/:formId/:userId', rateLimiter, pathFunctions.pdfPage);

// download the pdf- for the teachers
app.get('/download/pdf/:formName/:adminKey/:formId/:userId', rateLimiter, pathFunctions.downloadPDF);
// download all the pdfs that are requested 
app.post('/downloadAllPDFs/:formName/:adminKey/:formId', rateLimiter, downloadPDFisInBulk);

// to edit the form 
app.get('/editForm/:formName/:adminKey/:formId', rateLimiter, pathFunctions.editFormPage);

// to save the edited form
app.post('/editForm/save', rateLimiter, pathFunctions.saveEditedForm);

// tempory setup for creating new form page
app.post('/test/makeNewFormMakerUser', rateLimiter, createFormFuctions.makeNewFormMakerUser);
app.post('/test/makeNewForm', rateLimiter, createFormFuctions.makeNewForm);
app.delete('/test/deleteForm', rateLimiter, createFormFuctions.deleteForm);
app.post('/test/giveUserFormDeatils', rateLimiter, createFormFuctions.giveUserFormDeatils);
app.get('/previewForm/:formName/:adminKey/:formId', rateLimiter, pathFunctions.previewForm);
app.get('/test/serveLogoImage/:formName/:formId', imageLimiter, createFormFuctions.serveLogoImage);
app.post('/test/saveLogoImage', rateLimiter, createFormFuctions.saveLogoImage);
app.post('/formMaker/sendCodeEmail', rateLimiter ,createFormFuctions.sendCodeEmail);
app.post('/formMaker/confirmEmailWithCode', rateLimiter, createFormFuctions.confirmEmailWithCode);
app.post('/formMaker/passwordReset', rateLimiter, createFormFuctions.passwordReset);

// Making the form maker page
app.get('/formMaker', createFormFuctions.formMakerLogin);

// serve as a 404 page
app.get('*', pathFunctions.notFound);



app.listen(PORT, () => {
  console.log("It's up bois!!")
});
