var profileImage = document.getElementById('profileImage');
var cropper;

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




function intializeCropper(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        // convert image file to base64 string
        profileImage.setAttribute('src', reader.result);
        // try to destroy a cropper instance if it exists
        try {
            cropper.destroy();
        } catch (error) {
            console.log(error);
        }

        cropper = new Cropper(profileImage, {
            preview: '#imagePreview',
        });
        
        cropper.setDragMode("move");

    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}

// add event listeners
document.getElementById('submitForm').addEventListener('click', postEmailLink);
document.getElementById('personImage').addEventListener('change', intializeCropper);

