const express = require('express');
const mongoose = require('mongoose');
const filterData = require('./mainJS/filterThroughData');
const app =  express();
const PORT = process.env.PORT || 3030;
const pathFunctions = require('./mainJS/pathFunctions');
const saveForm = require('./mainJS/saveForm');

// conenct to the database
const dbURI = process.env.DB_URL;
mongoose.set('strictQuery', false);
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

// set up the server 
app.set('view engine', 'pug');
app.use(express.static('public'))
// max size of the file is 5mb
// so we can get json data over 5mb
app.use(express.json({ extended: true, limit: "5mb" }));

require('dotenv').config();


app.get('/', pathFunctions.signUp);
// used to genreate new link
// email needs to be verfied first
//app.post('/createNewLink', pathFunctions.generateLink);

app.post('/createVerifyLink', pathFunctions.generateVerficationLink);

// verify email
app.get('/verifyEmail/:verifyLink', pathFunctions.verifyUserEmail);

// display the form to the user
app.get('/form/:id', pathFunctions.formPage);

// serve all images
app.get('/image/:id', pathFunctions.serveImage);

// save the form to the database
app.post('/saveForm', saveForm);

// filter data page
app.get('/filterData/:password', pathFunctions.filterDataPage);

// filter data
app.post('/search/:password', filterData);

// user page for teachers to see more info about them
app.get('/admin/:password/:formId', pathFunctions.userPage);

// pdf page for sending it to the user, needs password so no one can else access it
app.get('/pdf/:password/:formId', pathFunctions.pdfPage);

// download the pdf
app.get('/download/pdf/:password/:formId', pathFunctions.downloadPDF);

app.listen(PORT, () => {
    console.log("It's up bois!!")
});