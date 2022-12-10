// sends a post request
async function postEmailLink(){
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