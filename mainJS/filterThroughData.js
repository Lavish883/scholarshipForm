const schemas = require('../schemas/schemas'); // schemas

function reduceJSONSize(users) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].form.bot != true) {
            users[i].form.image = '';
        }
        // we don't want give id of that entry in our databse
        users[i]._id = '';
    }
    return users;
}

// when input is 4.33, 4 shows up
function compareNumbers(userNumber, value) {
    if (parseFloat(userNumber) < parseFloat(value)) return false;
    return true;
}

function isTextInString(userText, string) {
    console.log(userText, string);
    if (userText.toLowerCase().includes(string.toLowerCase())) return true;
    return false;
}

// arry that needs to be travsersed and sing being positive or negative
function makeComparingString(arry, sign) {
    var string = '';
    for (var i = 0; i < arry.length; i++) {
        if (arry[i].sign == sign) {
            string += ' ' + arry[i].value;
        }
    }

    return string;
}

function filterCheckBoxesPositive(filterValues, remUsers) {
    for (var key in filterValues) {
        var filter = filterValues[key];
        // only need to see chekcboxe as they are the only ones that can be positive or negative
        if (filter.type == 'checkBoxes' && filter.value.length > 0) {
            var stringToCompare = makeComparingString(filter.value, 'positive');
            if (stringToCompare.replace(/\s/g, '').length == 0) continue;

            for (var i = remUsers.length - 1; i >= 0; i--) {
                var user = remUsers[i];
                // if user doens't have the key then remove the user
                if (user.form[key] == undefined || user.form[key] == null) {
                    remUsers.splice(i, 1);
                    console.log('removed; doesnt icnlude key');
                    continue;
                }

                // go through all the user checkboxes and see if they have all the values
                var userCheckboxes = user.form[key];
                var userIncludesOne = false;

                for (var j = 0; j < userCheckboxes.length; j++) {
                    if (stringToCompare.includes(userCheckboxes[j])) {
                        userIncludesOne = true;
                        continue;
                    }
                }
                // if it stil remains it didn't include any of the values so remove the user
                if (userIncludesOne == false) {
                    remUsers.splice(i, 1);
                }

            }
        }
    }
}

function filterCheckBoxesNegative(filterValues, remUsers) {
    for (var key in filterValues) {
        var filter = filterValues[key];
        // only need to see chekcboxe as they are the only ones that can be positive or negative
        if (filter.type == 'checkBoxes' && filter.value.length > 0) {
            var stringToCompare = makeComparingString(filter.value, 'negative');

            console.log(filter.value, 'filter value')
            if (stringToCompare.replace(/\s/g, '').length == 0) continue;

            for (var i = remUsers.length - 1; i >= 0; i--) {
                var user = remUsers[i];
                // if user doens't have the key then remove the user
                if (user.form[key] == undefined || user.form[key] == null) {
                    console.log('removed; doesnt icnlude key');
                    remUsers.splice(i, 1);
                    continue;
                }
                console.log(stringToCompare, 'string to compare');

                // go through all the user checkboxes and see if they have all the values
                var userCheckboxes = user.form[key];

                for (var j = 0; j < userCheckboxes.length; j++) {
                    //console.log(userCheckboxes[j], stringToCompare);
                    if (stringToCompare.includes(userCheckboxes[j])) {
                        console.log('removed; includes negative');
                        remUsers.splice(i, 1);
                        continue;
                    }
                }

            }
        }
    }
}

function filterCheckBoxesGrid(filterValues, remUsers) {
    // make a new arry of filters that have checkboxesGrid and also make it a more optmitzed data structure
    // [key, [{col row}]]
    var newFilterValues = [];

    for (var key in filterValues) {
        var filter = filterValues[key];

        if (filter.type == 'checkBoxesGrid') {
            newFilterValues.push([key, filter.value]);
        }
    }

    for (var filter of newFilterValues) {
        var key = filter[0];
        var filterValues = filter[1];
        // if user doens't have the key then remove the user
        for (var i = remUsers.length - 1; i >= 0; i--) {
            var user = remUsers[i];
            // go through all the filters if it doesn't pass all of them remove
            if (user.form[key] == undefined || user.form[key] == null) {
                remUsers.splice(i, 1);
                continue;
            }
            var userValues = user.form[key];
            // make user values string
            var userArryCompare = [];
            for (var userValue of userValues) {
                userArryCompare.push(userValue.columnValue + userValue.rowValue);
            }

            for (var actualFilters of filterValues) {
                // make a filter string and then compare it to the user values string
                let filterString = actualFilters.columnValue + actualFilters.rowValue;
                if (userArryCompare.indexOf(filterString) == -1) {
                    remUsers.splice(i, 1);
                    break;
                }
            }
        }
    }
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
            // if error with incoming datat then just move on
            if (item.value == undefined || item.value == null) continue;

            // if the user does not have the key then remove the user
            if (userForm[key] == undefined || userForm[key] == null) {
                remUsers.splice(i, 1);
                continue;
            }
            // compare numbers if the input was number
            if (item.isNumber == true && compareNumbers(userForm[key], item.value) == false) {
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
            // compare options if the input was options and if it doesn;t include it then remove the user
            if (item.type == 'options') {
                if (userForm[key].toLowerCase().includes(item.value.toLowerCase()) == false) {
                    remUsers.splice(i, 1);
                    continue;
                }
            }
        }
    }

    // with postive and negative signs we can filter a lot of data
    // so positive should get all the ones that do include even if they don't include all thats fine
    filterCheckBoxesPositive(req.body.filterValues, remUsers);
    filterCheckBoxesNegative(req.body.filterValues, remUsers);
    // negative if even they have one of them kick them out

    // filter the users based on the grid checkboxes
    filterCheckBoxesGrid(req.body.filterValues, remUsers);

    // gets rid of the image data reducing the size of the json    
    remUsers = reduceJSONSize(remUsers);

    return res.json(remUsers);
}

module.exports = filterData