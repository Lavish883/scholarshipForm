var profileImage = document.getElementById('profileImage');
var cropper;
var autoSaveDisabled = false;


function intializeCropper(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    // unhide the modal for cropping
    document.getElementById('modal').style.visibility = 'visible';
    document.getElementById('form').style.display = 'none';
    document.body.style.overflow = 'hidden';

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
            aspectRatio: 1 / 1.5,
        });

        cropper.setDragMode("move");

    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}

async function closeCropper() {
    await saveFormToServer();
    // hide the modal for cropping
    document.getElementById('modal').style.visibility = 'hidden';
    document.getElementById('form').style.display = 'flex';
    document.body.style.overflowY = 'scroll';
    // fix the image preview
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('imagePreview').style = '';

    // create a new image element
    const image = document.createElement('img');
    image.src = cropper.getCroppedCanvas().toDataURL('image/jpeg');
    image.width = 200;

    document.getElementById('imagePreview').appendChild(image);
}

async function saveFormToServer() {
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

function getImageAsBuffer() {
    try {
        const canvas = cropper.getCroppedCanvas();
        const image = canvas.toDataURL('image/jpeg');
        //document.getElementById('error').innerText = image;
        return image;
    } catch (error) {
        return null;
    }
}

// show more button for options
function showMoreOptions(object) {
    const options = object.parentElement.parentElement.querySelectorAll('.containOption');

    if (object.getAttribute('shownMore') == 'true') {
        for (var i = 0; i < options.length; i++) {
            options[i].style = '';
        }
        object.setAttribute('shownMore', 'false');
        object.innerText = 'Show Less';
    } else {
        for (var i = options.length - 1; i > 8; i--) {
            options[i].style.display = 'none';
        }
        object.setAttribute('shownMore', 'true');
        object.innerText = 'Show More';
    }


}

// filter options for search
function filterOptions(object) {
    const options = object.parentElement.querySelectorAll('.containOption');
    // get rid of the show more button

    // if the search bar is empty, show all options else filter
    if (object.value.replaceAll(' ', '') == '') {
        object.parentElement.querySelector('.showMoreBtnCont').style = '';
        try {
            object.parentElement.querySelector('fieldset').classList.add('noBottomBorder');
        } catch (error) {
            console.log(error);
        }

        for (var i = 0; i < options.length; i++) {
            if (i < 10) {
                options[i].style = '';
            } else {
                options[i].style.display = 'none';
            }
        }
    } else {
        for (var i = 0; i < options.length; i++) {
            if (options[i].innerText.toLowerCase().replaceAll(' ', '').includes(object.value.toLowerCase().replaceAll(' ', '')) || i == 0) {
                options[i].style = '';
            } else {
                options[i].style.display = 'none';
            }
        }
        object.parentElement.querySelector('.showMoreBtnCont').style.display = 'none';
        // remove class of not bottom border for the fieldset
        try {
            object.parentElement.querySelector('fieldset').classList.remove('noBottomBorder');
        } catch (error) {
            console.log(error);
        }
    }
    //console.log(options);
}

function validateTextInput(obj) {
    if (obj.value.replaceAll(' ', '') == '') {
        // shake the input if it is not valid
        obj.style.animation = 'shake 0.8s';
        obj.style.color = 'white';
        obj.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';

        setTimeout(() => {
            obj.style = '';
        }, 900);

        return true;
    }
    return false;
}

function validateFieldSets(obj) {
    var maxSelections = obj.getAttribute('maxselections');
    console.log(maxSelections);
}

// validate the form before sending
function validateForm(event) {
    event.preventDefault();
    // check if all the required fields are filled
    const requiredFields = document.querySelectorAll('[required]');

    for (var requiredField of requiredFields) {

        if (requiredField.nodeName == 'INPUT' && false) {
            requiredField.parentElement.parentElement.scrollIntoView();
            return;
        }

        if (requiredField.nodeName == 'FIELDSET' && validateFieldSets(requiredField)) {
            requiredField.parentElement.parentElement.scrollIntoView();
            return;
        }

        console.log(requiredField.nodeName);
        console.log(requiredField.value);
    }
    console.log(requiredFields);
}

// add event listeners
document.getElementById('personImage').addEventListener('change', intializeCropper);
document.getElementById('doneWithImage').addEventListener('click', closeCropper);
document.getElementById('sumbitFormBtn').addEventListener('click', validateForm);
