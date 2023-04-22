// I don't want to deal with accessTokens & refreshTokens, so I'm just going to use a simple login system
var userName;
var password;

async function login() {
    // make a post request to the server
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "email": document.getElementById('email').value,
            "password": document.getElementById('password').value
        })
    }
    const response = await fetch('/test/giveUserFormDeatils', options);
    const data = await response.text();

    // user was able to log in
    if (response.status == 200) {
        // we can use these now to make requests to the server
        userName = document.getElementById('email').value;
        password = document.getElementById('password').value;

        formatUserFormData(JSON.parse(data));
        document.querySelector('main').style.display = '';
    } else {
        document.querySelector('#loginModal .errorBox').innerText = data;
        document.querySelector('#loginModal .errorBox').style.display = 'block';
        // shake the login box
        document.querySelector('#loginModal .loginContainer').style.animation = 'shake 0.5s';
        setTimeout(() => { document.querySelector('#loginModal .loginContainer').style.animation = ''; }, 800);
    }
}

async function deleteForm(formId, formName) {
    if(!confirm('Are you sure you want to delete this form?')) return;
    // make a post request to the server
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "email": userName,
            "password": password,
            "formId": formId,
            "formName": formName
        })
    }
    const response = await fetch('/test/deleteForm', options);
    const data = await response.text();

    // user was able to log in
    if (response.status == 200) {
        formatUserFormData(JSON.parse(data));
    } else {
        alert(data);
    }
}

function formatUserFormData(data) {
    try {
        document.getElementById('loginModal').remove();
        document.getElementById('signUpModal').remove();
    } catch (err) {}
    var userInfoHTML = [];

    for (var form of data) {
        var formId = form.formId;
        var formName = form.formName;
        var adminKeyForForm = form.adminKeyForForm;

        userInfoHTML.push(`
            <div class="card">
                <h2>${formName}</h2>
                <div class="left">
                    <div title="Preview Form" onclick="window.open('/previewForm/${formName}/${adminKeyForForm}/${formId}')" class="iconContainer">
                        <i class="fas fa-eye"></i>
                    </div>
                    <div title="Edit" onclick="window.open('/editForm/${formName}/${adminKeyForForm}/${formId}')" class="iconContainer">
                        <i class="fas fa-pen"></i>
                    </div>
                    <div title="Examine Data" onclick="window.open('/filterData/${formName}/${adminKeyForForm}/${formId}')" class="iconContainer">
                        <i class="fas fa-chart-pie"></i>
                    </div>
                    <div title="Delete Form" class="iconContainer" onclick="deleteForm('${formId}', '${formName}')">
                        <i class="fas fa-trash"></i>
                    </div>
                    <div title="Share Form" class="iconContainer" onclick="window.open('/form/signup/${formName}/${adminKeyForForm.slice(-5)}/${formId}')">
                        <i class="fas fa-share"></i>
                    </div>
                </div>
            </div>
        `);
    }

    document.getElementById('cards').innerHTML = userInfoHTML.join('');
}

function showOrHideNewFormModal(){
    document.getElementById('makeNewFormModal').classList.toggle('show');
}

async function makeNewForm() {
    // make a post request to the server
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "email": userName,
            "password": password,
            "formName": document.getElementById('newFormName').value
        })
    }
    const response = await fetch('/test/makeNewForm', options);
    const data = await response.text();

    // user was able to log in
    if (response.status == 200) {
        showOrHideNewFormModal();
        formatUserFormData(JSON.parse(data));
    } else {
        alert(data);
    }
}

async function signUpNewUser() {
    var errorBox = document.querySelector('#signUpModal .errorBox');
    var goodNews = document.querySelector('#signUpModal .goodNews');
    // check if passwords match
    if (document.getElementById('newPassword').value != document.getElementById('newPasswordConfirm').value) {
        errorBox.innerText = 'Passwords do not match';
        errorBox.style.display = 'block';
        document.querySelector('#signUpModal .loginContainer').style.animation = 'shake 0.8s';
        setTimeout(() => { document.querySelector('#signUpModal .loginContainer').style.animation = ''; }, 800);
        return;
    }
    // make a post request to the server
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "email": document.getElementById('newEmail').value,
            "password": document.getElementById('newPassword').value
        })
    }
    const response = await fetch('/test/makeNewFormMakerUser', options);
    const data = await response.text();

    // user was able to log in
    if (response.status == 200) {
        goodNews.innerText = 'User created';
        goodNews.style.display = 'block';
    } else {
        errorBox.innerText = data;
        errorBox.style.display = 'block';
        setTimeout(() => { document.querySelector('#signUpModal .loginContainer').style.animation = ''; }, 800);
        document.querySelector('#signUpModal .loginContainer').style.animation = 'shake 0.8s';
    }
}

function changeBetweenLoginAndSignUp() {
    var login = document.getElementById('loginModal');
    var signUp = document.getElementById('signUpModal');

    if (login.style.display == 'none') {
        login.style.display = 'flex';
        signUp.style.display = 'none';
    } else {
        login.style.display = 'none';
        signUp.style.display = 'flex';
    }
}   