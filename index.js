const express = require('express');
const fs = require('fs');
const app =  express();
const PORT = process.env.PORT || 8080
const pathFunctions = require('./mainJS/pathFunctions');



app.set('view engine', 'pug');
app.use(express.json());


app.get('/', pathFunctions.signUp);
app.post('/createNewLink', pathFunctions.generateLink);


app.listen(PORT, () => {
    console.log("It's up bois!!")
});