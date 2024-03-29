async function postEmailLink(event) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "email": document.getElementById('email').value,
            "formName": window.location.href.split('/form/signup/')[1].split(`/`)[0],
            "adminKey": window.location.href.split('/form/signup/')[1].split(`/`)[1],
            "formId": window.location.href.split('/form/signup/')[1].split(`/`)[2],
        })
    }

    if (document.getElementById('email').value == '') {
        document.getElementById('isSuccess').innerText = 'Enter Email';
        document.getElementById('isSuccess').style.color = '#c25050';
        return;
    }


    const request = await fetch('/createVerifyLink', options);
    const data = await request.text();

    // if error occurs while sending email
    if (request.status != 200) {
        const emailInput = document.getElementById('email');
        emailInput.style.animation = 'shake 0.8s';
        emailInput.style.color = 'white';
        emailInput.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';

        document.getElementById('isSuccess').innerText = data;
        document.getElementById('isSuccess').style.color = '#c25050';

        setTimeout(() => {
            emailInput.style = '';
        }, 1000);
    } else {
        document.getElementById('isSuccess').innerText = data;
        document.getElementById('isSuccess').style.color = '#4caf50';

    }
}

// add event listeners
document.getElementById('submitForm').addEventListener('click', postEmailLink);