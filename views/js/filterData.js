function genreateTextFilterHTML(question) {
    return `
        <div class="containFilter">
            <div class="filterName">
                <span class="question">${question.question}</span>
                <span>${question.isNumber ? ' (Higher will show)' : ''}</span>
                <i class="fas fa-caret-down"></i>
            </div>
            <input isNumber=${question.isNumber} onKeyUp="applyFilters()" whatType=${question.type} whatName=${question.name} type="text" class="filterInput" placeholder="Search" class=" class="searchForText" />
        </div>
    `
}

function generateFiltersHTML(data, selector) {
    var htmlArry = [];
    for (var question of data) {

        if (question.type == 'text' || question.type == 'textarea') {
            htmlArry.push(genreateTextFilterHTML(question));
            continue;
        }
        /*
        htmlArry.push(
          `<div>${question.name}</div>`
       );
       */
    }
    document.querySelector(selector).innerHTML = htmlArry.join('');
}

function getAllFilterValues() {
    var filterValues = {};
    var inputs = document.querySelectorAll('.filterInput');
    for (var input of inputs) {
        if (input.value == '') continue;
        filterValues[input.getAttribute('whatName')] = {'value': input.value, 'type': input.getAttribute('whatType')};
        if (input.getAttribute('isNumber') == 'true') filterValues[input.getAttribute('whatName')].isNumber = true;
    }
    return filterValues;
}

function generateUsersHTML(users) {
    var htmLArry = [];
    // use "/image/${user.form.formId}" to get the image but now use base 64 image/url image
    var image;

    for (var user of users) {
        if (user.email.includes('test')){
            image = user.form.image;
        } else{
            image = `/image/${user.form.formId}`;
        }
        
        htmLArry.push(
            `
            <div class="card">
                <div class="imgContainer">
                    <img src=${image} alt="Photo of ${user.form.firstName + ' ' + user.form.lastName}">
                </div>
            </div>
            `
        );
    }
    return htmLArry.join('');
}

async function applyFilters(){
    var filterValues = getAllFilterValues();

    if (Object.keys(filterValues).length == 0){
        document.getElementById('results').innerHTML = '';
        return;
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "filterValues": filterValues
        })
    }
    const request = await fetch('/search/' + window.location.pathname.split(`filterData/`)[1], options);
    const data = await request.json();

    document.getElementById('results').innerHTML = generateUsersHTML(data);
}