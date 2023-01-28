const schemas = require('../schemas/schemas'); // schemas

function reduceJSONSize(users){
    for (var i = 0; i < users.length; i++) {
        if (users[i].form.bot != true){
            users[i].form.image = '';
        }
    }
    return users;
}

// when input is 4.33, 4 shows up
function compareNumbers(userNumber, value){
    if (parseFloat(userNumber) < parseFloat(value)) return false;
    return true;
}

function isTextInString(userText, string){
    console.log(userText, string);
    if (userText.toLowerCase().includes(string.toLowerCase())) return true;
    return false;
}

async function filterData(req, res) {
    // check if the user is authorized or not
    if (req.params.password != process.env.ACCESS_KEY) return res.status(403).send('Not Authorized !!! Check the password or contact the admin');
    // get all users
    console.log(req.body);
    var users = await schemas.users.find({});
    var remUsers = JSON.parse(JSON.stringify(users));

    // filter the users
    for (var key in req.body.filterValues) {
        var item = req.body.filterValues[key];

        for (var i = remUsers.length - 1; i >= 0; i--) {
            var userForm = remUsers[i].form;
            // if the user does not have the key then remove the user
            if (userForm[key] == undefined){
                remUsers.splice(i, 1);
                continue;
            }
            // compare numbers if the input was number
            if (item.isNumber == true && compareNumbers(userForm[key], item.value) == false){
                remUsers.splice(i, 1);
                continue;
            }
            // compare text if the input was text
            if (item.type == 'text' || item.type == 'textarea') {
                if (isTextInString(userForm[key], item.value) == false && item.isNumber != true) {
                    remUsers.splice(i, 1);
                    continue;
                }
            }
        }
    }

    remUsers = reduceJSONSize(remUsers);

    return res.json(remUsers);
}

module.exports = filterData