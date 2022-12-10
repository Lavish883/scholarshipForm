const express = require('express');
const mongoose = require('mongoose');
const app =  express();
const PORT = process.env.PORT || 8080
const pathFunctions = require('./mainJS/pathFunctions');

// conenct to the database
const dbURI = process.env.DB_URL;
mongoose.set('strictQuery', false);
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

// set up the server 
app.set('view engine', 'pug');
app.use(express.json());
require('dotenv').config();


app.get('/', pathFunctions.signUp);
// used to genreate new link
// email needs to be verfied first
//app.post('/createNewLink', pathFunctions.generateLink);

app.post('/createVerifyLink', pathFunctions.generateVerficationLink);

// verify email
app.get('/verifyEmail/:verifyLink', pathFunctions.verifyUserEmail);

app.get('/form/:id', pathFunctions.formPage);

app.listen(PORT, () => {
    console.log("It's up bois!!")
});