require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbURI = process.env.DB_URL;
const schemas = require('./schemas/schemas.js');
const formOptions = require('./mainJS/formOptions.js'); // form options

mongoose.set('strictQuery', false);
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

async function accessCollectionOfUsers(collectionName) {
    const newCollection = mongoose.model(collectionName, schemas.userSchema, collectionName);
    var allItems = await newCollection.find({});

    return allItems;
}

async function removeUser(collectionName, userId) {
    const newCollection = mongoose.model(collectionName, schemas.userSchema, collectionName);
    await newCollection.findOneAndRemove({'userId': userId});
}

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

    const newCollection = mongoose.model('310dd3e941-4017d5352c284ce6e32764'310dd3e941-4017d5352c284ce6e32764'310dd3e941-4017d5352c284ce6e32764', newSchema, '310dd3e941-4017d5352c284ce6e32764');
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
    /*
    var user = await schemas.formMakerUsers.findOne({ 'email': 'lkumar2024@spyponders.com'});

    user.forms[0].form = formOptions;
    user.markModified('forms');
    await user.save();
    //*/
     
    var collection = await accessCollectionOfUsers('310dd3e941-4017d5352c284ce6e32764');
    console.log(collection.length);
    let removedCount = 0;
    // Go through each user and see if they already exisits in that collection
    for (var i = collection.length - 1; i >= 0; i--) {
        console.log(collection[i].email)
        for (var j = 0; j < i; j++) {
            if (collection[i].email === collection[j].email) {
                //await removeUser('310dd3e941-4017d5352c284ce6e32764', collection[i].userId);
                collection.splice(i, 1);
                removedCount++;
                break;
            }
        }
    }
    console.log(collection.length, removedCount);

    /*
    for (var i = 0; i < collection.length; i++) {
        await collection[i].save();
    }
    */
    //await collection.save();
}

moveData();