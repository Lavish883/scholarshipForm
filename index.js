const express = require('express');
const mongoose = require('mongoose');
const filterData = require('./mainJS/filterThroughData');
const app =  express();
const PORT = process.env.PORT || 3030;
const pathFunctions = require('./mainJS/pathFunctions');
const createFormFuctions = require('./mainJS/creatingForms');
const saveForm = require('./mainJS/saveForm');

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
app.get('/form/signup/:formName/:adminKey/:formId', pathFunctions.signUp);
// used to genreate new link
// email needs to be verfied first
//app.post('/createNewLink', pathFunctions.generateLink);

// create a new verify link for the form - updated  
app.post('/createVerifyLink', pathFunctions.generateVerficationLink);

// verify email - updated to keep up with the database
app.get('/verifyEmail/:formName/:adminKey/:formId/:verifyLink', pathFunctions.verifyUserEmail);

// display the form to the user, adminKey only contains last five letter here - updated
app.get('/form/:formName/:adminKey/:formId/:userId', pathFunctions.formPage);

// serve all images - updated
app.get('/image/:formName/:adminKey/:formId/:userId', pathFunctions.serveImage);

// save the form to the database - updated
app.post('/saveForm', saveForm);

// filter data page - updated
app.get('/filterData/:formName/:adminKey/:formId', pathFunctions.filterDataPage)

// filter data - updated
app.post('/search/:formName/:adminKey/:formId', filterData);

// pdf page for sending it to the user, needs password so no one can else access it - updated
app.get('/pdf/:formName/:adminKey/:formId/:userId', pathFunctions.pdfPage);

// download the pdf- for the teachers - updated
app.get('/download/pdf/:formName/:adminKey/:formId/:userId', pathFunctions.downloadPDF);

// to edit the form 
app.get('/editForm/:formName/:adminKey/:formId', pathFunctions.editFormPage);

// to save the edited form
app.post('/editForm/save', pathFunctions.saveEditedForm);

// tempory setup for creating new form page
app.post('/test/makeNewFormMakerUser', createFormFuctions.makeNewFormMakerUser);
app.post('/test/makeNewForm', createFormFuctions.makeNewForm);
app.delete('/test/deleteForm', createFormFuctions.deleteForm);
app.post('/test/giveUserFormDeatils', createFormFuctions.giveUserFormDeatils);
app.get('/previewForm/:formName/:adminKey/:formId', pathFunctions.previewForm);

// Making the form maker page
app.get('/formMaker', createFormFuctions.formMakerLogin);

// serve as a 404 page
app.get('*', pathFunctions.notFound);



app.listen(PORT, () => {
    console.log("It's up bois!!")
});
