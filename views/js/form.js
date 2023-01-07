var profileImage = document.getElementById('profileImage');
var cropper;
var autoSaveDisabled = false;


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
            viewMode: 3,
            aspectRatio:1/1.5
        });
        
        cropper.setDragMode("move");

    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}

async function saveFormToServer(){
    if (autoSaveDisabled) return setTimeout(() => autoSaveDisabled = false, 1000);
    autoSaveDisabled = true;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "formId": window.location.href.split('/form/')[1],
            "form": {
                "image": getImageAsBuffer()
            }
        })
    }
    const request = await fetch('/saveForm', options);
    const data = await request.text();
}

function getImageAsBuffer(){
    try {
        const canvas = cropper.getCroppedCanvas();
        const image = canvas.toDataURL('image/jpeg');
        document.getElementById('error').innerText = image;
        return image;
    } catch (error) {
        return null;
    }
}

// add event listeners
document.getElementById('personImage').addEventListener('change', intializeCropper);
document.getElementById('doneWithImage').addEventListener('click', saveFormToServer);