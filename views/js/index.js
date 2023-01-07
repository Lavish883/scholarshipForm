async function postEmailLink(event) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "email": document.getElementById('email').value
        })
    }
    const request = await fetch('/createVerifyLink', options);
    const data = await request.text();
    alert(data);
}

// add event listeners
document.getElementById('submitForm').addEventListener('click', postEmailLink);

