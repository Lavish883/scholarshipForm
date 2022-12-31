// sends a post request

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

function compressImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        // convert image file to base64 string
        document.getElementById('preview').setAttribute('src', reader.result);
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}

// add event listeners
document.getElementById('submitForm').addEventListener('click', postEmailLink);
document.getElementById('personImage').addEventListener('change', compressImage);

