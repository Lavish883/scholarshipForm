async function verifyFormAccess(){
    var formStuff = window.location.pathname.split('/');
    document.getElementById('submitForm').setAttribute('disabled', 'true');

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'formName': unescape(formStuff[2]),
            'formAdminKey': formStuff[3],
            'formId': formStuff[4],
            'userId': formStuff[5],
            'code': document.getElementById('code').value
        })
    }
    
    let response = await fetch('/form/verifyFormAccess', options);
    let data = await response.text();
    
    if (response.status != 200){
        document.getElementById('isSuccess').style.color = '#c20707';
        document.getElementById('isSuccess').style.display = 'block';
        document.getElementById('isSuccess').innerHTML = data;
        document.getElementById('submitForm').removeAttribute('disabled');
    } else {
        window.location.href = window.location.pathname + '?jwt=' + data;
    }
}

document.getElementById('submitForm').addEventListener('click', verifyFormAccess);