var profileImage = document.getElementById('profileImage');
var cropper;
var autoSaveDisabled = false;
var finishedGoingOver = false;


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

async function saveImageToServer() {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "userId": window.location.href.split('/form/')[1].split('/')[3],
            "formName": unescape(window.location.href.split('/form/')[1].split('/')[0]),
            "formId": window.location.href.split('/form/')[1].split('/')[2],
            "adminKey": window.location.href.split('/form/')[1].split('/')[1],
            "form": {
                "image": cropper.getCroppedCanvas().toDataURL('image/jpeg'),
                "imageHeight": cropper.getCroppedCanvas().height,
                "imageWidth": cropper.getCroppedCanvas().width,
            },
            "finishedWithForm": false
        })
    }
    const request = await fetch('/saveForm', options);
    const data = await request.text();
}

async function closeCropper() {
    await saveImageToServer();
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

function getAllFormValues() {
    const allFormElements = document.querySelectorAll('.answerHere');
    var formValues = {};

    for (var elm of allFormElements) {
        let type = elm.getAttribute('whatType');

        if (type == 'text' || type == 'textArea') {
            // there can only be one of these
            var childElm = elm.querySelector(`[type=${type}]`);

            formValues[childElm.getAttribute('name')] = childElm.value;
        }

        if (type == 'options') {
            // get the value of the one that is checked
            //console.log(type, elm.querySelectorAll(`[type=radio]`))
            for (var childElm of elm.querySelectorAll(`[type=radio]`)) {
                if (childElm.checked) {
                    if (childElm.value == 'Other:') {
                        formValues[childElm.getAttribute('name')] = " !@#$ " + elm.querySelector('.withOther').value;
                    } else {
                        formValues[childElm.getAttribute('name')] = childElm.value;
                    }
                    continue;
                }
            }
        }

        if (type == 'checkBoxes') {
            // get the value of the one that is checked
            var checked = [];
            for (var childElm of elm.querySelectorAll(`[type=checkbox]`)) {
                if (childElm.checked) {
                    checked.push(childElm.value);
                }
            }
            formValues[childElm.getAttribute('name')] = checked;
            console.log(checked);
        }

        if (type == 'checkBoxesGrid') {
            var grid = [];
            for (var childElm of elm.querySelectorAll(`[type=checkbox]`)) {
                if (childElm.checked) {
                    var splitId = childElm.getAttribute('id').split(' !@#$% ');
                    grid.push({ 'columnValue': splitId[0], 'rowValue': splitId[1] });
                }
            }
            formValues[childElm.getAttribute('name')] = grid;
            console.log(grid);
        }
    }

    return formValues;
}

async function saveFormToServer(finishedWithForm = false) {
    console.log('Saving.......')
    autoSaveDisabled = true;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "userId": window.location.href.split('/form/')[1].split('/')[3],
            "formName": unescape(window.location.href.split('/form/')[1].split('/')[0]),
            "formId": window.location.href.split('/form/')[1].split('/')[2],
            "adminKey": window.location.href.split('/form/')[1].split('/')[1],
            "form": {
                "values": getAllFormValues()
            },
            "finishedWithForm": finishedWithForm,
        })
    }
    const request = await fetch('/saveForm', options);
    const data = await request.text();
    console.log('Saveddddd')
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

// Don't touch validate form functions at all they are very important and work perfectly if bugs are found then only touch them

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

    if (maxSelections == null || maxSelections == undefined) {
        maxSelections = 1;
    }

    // get all children of the fieldset
    const children = obj.querySelectorAll('input');
    var selected = 0;
    var ignoreSelections = false;


    for (var child of children) {
        // if child is none of above we don't care about it  
        if (child.getAttribute('type') == 'checkbox' && child.checked) {
            if (child.value == 'None of the above' || child.value == 'Undecided' || child.value == "Haven't yet") {
                ignoreSelections = true;                
            }
        }

        if (child.checked) {
            selected++;
        }
    }

    if (ignoreSelections && selected > 1) {
        return true;
    } else if (ignoreSelections && selected == 1) {
        return false;
    }

    if (maxSelections != 'none' && selected != maxSelections) {
        // shake the input if it is not valid
        console.log(obj);
        return true;
    }

    // or Other is selcted but nothing is written its invalid
    if (obj.querySelector("[value='Other:']") != null) {

        if (obj.querySelector("[value='Other:']").checked == true && obj.querySelector('.withOther').value.replaceAll(' ', '') == '') {
            console.log(obj);
            return true;
        }
    }

    return false;
}
// validate the form before sending
async function validateForm(event) {
    event.preventDefault();
    // check if all the required fields are filled
    const requiredFields = document.querySelectorAll('[required]');
    console.log(requiredFields);
    for (var requiredField of requiredFields) {

        if (requiredField.nodeName == 'INPUT' && validateTextInput(requiredField)) { //
            requiredField.parentElement.parentElement.scrollIntoView();
            return;
        }

        if (requiredField.nodeName == 'TEXTAREA' && validateTextInput(requiredField)) { //
            requiredField.parentElement.parentElement.scrollIntoView();
            return;
        }

        if (requiredField.nodeName != 'INPUT' && requiredField.nodeName != 'TEXTAREA' && validateFieldSets(requiredField)) {
                console.log(requiredField)
                // give an animation of shake if its wrong
                requiredField.style.animation = 'shake 0.8s';
                requiredField.style.color = 'white';
                requiredField.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';

                setTimeout(() => {
                    requiredField.style = '';
                }, 900);

                requiredField.parentElement.scrollIntoView();
                return;
        }
    }
    if (finishedGoingOver){
        await saveFormToServer(true);
        document.body.innerHTML = `<h1 class="formEndTextColor" style="text-align: center; margin-top: 30vh;">${formEndText}</h1>`;
    } else {
        alert('Please go over the form again and make sure everything is correct');
        finishedGoingOver = true;
        document.getElementById('form').scrollIntoView();
        document.getElementById('form').style.opacity = '0.65';
    }
}

// auto save
async function autoSave() {
    // check if auto save is disabled or not
    if (autoSaveDisabled) {
        return setTimeout(() => {
            autoSaveDisabled = false;
            autoSave();
        }, 20 * 1000);
    }

    autoSaveDisabled = true;

    console.log('auto saving');
    document.querySelector('.autoSaveIndicator').style.display = 'flex';
    await saveFormToServer(false);

    // hide the auto save indicator, at least one second so they can see it
    setTimeout(() => {
        document.querySelector('.autoSaveIndicator').style.display = 'none';
    }, 1000);


    setTimeout(() => {
        autoSave();
    }, 20 * 1000);
}

// add event listeners
try {
    document.getElementById('personImage').addEventListener('change', intializeCropper);
} catch (error){
    console.log(error);
}

try {
    document.getElementById('doneWithImage').addEventListener('click', closeCropper);
} catch (error){
    console.log(error);
}

try {
    document.getElementById('sumbitFormBtn').addEventListener('click', validateForm);
} catch (error){
    console.log(error);
}

setTimeout(autoSave, 20 * 1000);