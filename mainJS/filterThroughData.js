const schemas = require('../schemas/schemas'); // schemas


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
            user = remUsers[i];
            // if input was text or textarea
            if (item.type == 'text' || item.type == 'textarea') {
                if (user.form[key] == undefined){
                    remUsers.splice(i, 1);
                    continue;
                }
                
                if (user.form[key].toLowerCase().includes(item.value.toLowerCase()) == false) {
                    remUsers.splice(i, 1);
                    continue;
                }
            }
        }
    }

    

    return res.json(remUsers);
}

module.exports = filterData