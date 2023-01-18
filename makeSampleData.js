const mongoose = require('mongoose');
const schemas = require('./schemas/schemas'); // schemas
const formOptions = require('./mainJS/formOptions.js'); // form options
const crypto = require('crypto');
const fetch = require('node-fetch');


require('dotenv').config();

const imageArry = [
    "waifu",
    "neko",
    "shinobu",
    "cry",
    "pat",
    "smug",
    "highfive",
    "nom",
    "bite",
    "slap",
    "wink",
    "poke",
    "dance",
    "cringe",
    "blush",
    "random"
]

async function getRandomImage(){
    const request = await fetch(`https://api.waifu.pics/sfw/${imageArry[Math.floor(Math.random() * imageArry.length)]}`);
    const data = await request.json();
    return data.url;
}

// conenct to the database
const dbURI = process.env.DB_URL;
mongoose.set('strictQuery', false);
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

async function makeSampleData(amntOfUsers) {
    for (var i = 0; i < amntOfUsers; i++) {
        let formToken = crypto.randomBytes(8).toString('hex');
        let verifyLink = crypto.randomBytes(16).toString('hex');

        var doesTokenExist = await schemas.users.findOne({ 'form.formId': formToken });
        var doesVerifyLinkExist = await schemas.users.findOne({ 'verifyLink': verifyLink });

        while (doesTokenExist != null) {
            formToken = crypto.randomBytes(8).toString('hex');
            doesTokenExist = await schemas.users.findOne({ 'form.formId': formToken });
        }

        while (doesVerifyLinkExist != null) {
            verifyLink = crypto.randomBytes(16).toString('hex');
            doesVerifyLinkExist = await schemas.users.findOne({ 'verifyLink': verifyLink });
        }

        var user = new schemas.users({
            "email": 'test' + i + '@spyponders.com',
            "verfied": true,
            "verifyLink": verifyLink,
            form: { 'formId': formToken, 'image': '' },
            "bot": true
        });
        
        user.form['image'] = await getRandomImage();

        for (var j = 0; j < formOptions.length; j++) {

            if (formOptions[j].isNumber) {
                user.form[formOptions[j].name] = Math.floor(Math.random() * 100);
                continue;
            }

            if (formOptions[j].type == 'text') {
                user.form[formOptions[j].name] = 'test';
                continue;
            } 
            
            if (formOptions[j].type == 'options') {
                user.form[formOptions[j].name] = formOptions[j].options[Math.floor(Math.random() * formOptions[j].options.length)];
                continue;
            }

            if (formOptions[j].type == 'checkBoxes' && formOptions[j].maxSelections != undefined) {
                var selections = [];
                for (var k = 0; k < formOptions[j].maxSelections; k++) {
                    selections.push(formOptions[j].options[Math.floor(Math.random() * formOptions[j].options.length)]);
                }
                user.form[formOptions[j].name] = selections;
                continue;
            }

            if (formOptions[j].type == 'checkBoxes' && formOptions[j].maxSelections == undefined) {
                var selections = [];
                for (var k = 0; k < formOptions[j].options.length; k++) {
                    if (Math.random() > 0.8) {
                        selections.push(formOptions[j].options[k]);
                    }
                }
                user.form[formOptions[j].name] = selections;
                continue;
            }

            if (formOptions[j].type == 'checkBoxesGrid' && formOptions[j].maxSelections != undefined) {
                var selections = [];
                for (var k = 0; k < formOptions[j].maxSelections; k++) {
                    selections.push({
                        "rowValue": formOptions[j].options.rows[Math.floor(Math.random() * formOptions[j].options.rows.length)],
                        "columnValue": formOptions[j].options.columns[Math.floor(Math.random() * formOptions[j].options.columns.length)]
                    });
                }
                user.form[formOptions[j].name] = selections;
                continue;
            }
        }

        user.markModified('form');
        //console.log(user);
        await user.save();
    }
}

makeSampleData(50);
