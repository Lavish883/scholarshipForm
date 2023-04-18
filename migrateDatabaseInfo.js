require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbURI = process.env.DB_URL;
const schemas = require('./schemas/schemas.js');
const formOptions = require('./mainJS/formOptions.js'); // form options

mongoose.set('strictQuery', false);
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

async function moveData() {
    /*
    // This wors for getting the data from a collection
    const newSchema = new Schema({
        "email": {
            type: String,
            required: true
        },
        "verfied": {
            type: Boolean,
            required: true
        },
        "verifyLink": {
            type: String,
            required: true
        },
        "form": {
            type: Object,
            required: true
        }
    });

    const newCollection = mongoose.model('310dd3e941-4017d5352c284ce6e32764', newSchema, '310dd3e941-4017d5352c284ce6e32764');
    var allItems = await newCollection.find({});
    */
    //
   // allItems.forEach(async (item) => {
    //    //await item.updateOne({'email': item.email, 'verfied': item.verfied, 'verifyLink': item.verifyLink, 'form': item.form, 'userId': item.form.formId}, {strict: false});
   ///     delete item.form.formId;
//        item.markModified('form');
  //      await item.save();
   // });
    //console.log(allItems.length);
    /*
    var userDatas = await schemas.users.find({});

    for (var i = 0; i < userDatas.length; i++){
         await newCollection.insertMany({
             'email': userDatas[i].email,
             'verfied': userDatas[i].verfied,
             'verifyLink': userDatas[i].verifyLink,
             'form': userDatas[i].form,
         });
     }
     */
    //await newCollection.save();
    
    var user = await schemas.formMakerUsers.findOne({ 'email': 'lkumar2024@spyponders.com'});

    user.forms[0].form = formOptions;
    user.markModified('forms');
    await user.save();
    //*/
}

moveData();