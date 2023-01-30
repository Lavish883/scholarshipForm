const adminPassword = window.location.href.split("/filterData/")[1];

// genreate HTML for the filtering data
function genreateTextFilterHTML(question) {
    return `
        <div title="${question.question}" class="containFilter">
            <div class="filterName">
                <span class="question">${question.question}</span>
                <span>${question.isNumber ? ' (Higher will show)' : ''}</span>
                <i class="fas fa-caret-down"></i>
            </div>
            <input isNumber=${question.isNumber} onKeyUp="applyFilters()" whatType=${question.type} whatName=${question.name} type="text" class="filterInput" placeholder="Search" class=" class="searchForText" />
        </div>
    `
}

function generateOptionsHTML(question){
    var htmLArry = [];
    var optionsArry = [];
    var totalOptionsDone = 0;
    // go through all the options and add create the html for it 
    for (var option of question.options){
        optionsArry.push(
            `
            <div style="display:${totalOptionsDone > 5 ? 'none': 'flex'}" onclick="changeOptionValue(this)" class="filterItem">
                ${option == 'Other:' ? `<span>Other:&nbsp;&nbsp;</span><input onKeyUp="applyFilters()" whatType=${question.type} whatName=${question.name} type="text" class="filterInput" placeholder="Search" class=" class="searchForText" />` : `<input whatType=${question.type} whatName=${question.name} name=${question.name} type="radio" value="${option}" class="" /> <span>${option}</span>`}
            </div>
            `
        );
        totalOptionsDone++;
    }

    if (optionsArry.length > 6){
        optionsArry.push(
            `
            <div onclick="changeOptionValue(this)" class="filterItem">
                ${`<span>Other:&nbsp;&nbsp;</span><input onKeyUp="applyFilters()" whatType=${question.type} whatName=${question.name} type="text" class="filterInput" placeholder="Search" class=" class="searchForText" />`}
            </div>
            <div onclick="showMoreOptions(this)" class="filterItem openMoreOptions">
                <div style="display:inline-block;margin:auto;">Show more</div>
            </div>
            `
        );
    }


    // add the parent conatiner
    htmLArry.push(
        `
        <div title="${question.question}" class="containFilter">
            <div class="filterName">
                <span class="question">${question.question}</span>
                <span></span>
                <i class="fas fa-caret-down" aria-hidden="true"></i>
            </div>
            <fieldset class="filterItems">
                ${optionsArry.join('')}
            </fieldset>
        </div>
        `
    );

    return htmLArry.join('');
}

function generateFiltersHTML(data, selector) {
    var htmlArry = [];
    for (var question of data) {

        if (question.type == 'text' || question.type == 'textarea') {
            htmlArry.push(genreateTextFilterHTML(question));
            continue;
        }

        if (question.type == 'options'){
            htmlArry.push(generateOptionsHTML(question));
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

function showMoreOptions(obj){
    var filterItems = obj.parentElement.parentElement.querySelectorAll('.filterItem');
    var searchInputs = obj.parentElement.querySelectorAll('.filterInput');

    // if there are two search bars then remove the second one
    if (searchInputs.length > 1){
        for (var i = 1; i < searchInputs.length; i++){
            searchInputs[i].parentElement.remove();
        }
    }

    for (var filterItem of filterItems){
        filterItem.style.display = 'flex';
    }
    
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

function changeOptionValue(obj){
    var fieldset = obj.parentElement;
    var inputs = fieldset.querySelectorAll('input');
    
    for (var input of inputs){
        input.checked = false;
    }

    obj.querySelector('input').checked = true;
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
            <a title="Click on for more Info" target="_blank" href="/admin/${adminPassword}/${user.form.formId}">
                <div class="card">
                    <div class="imgContainer">
                        <img src=${image} alt="Photo of ${user.form.firstName + ' ' + user.form.lastName}">
                    </div>
                    <div class="textContainer">
                        <div><span class="bold">Name:</span> ${user.form.firstName + ' ' + user.form.lastName}</div>
                        <div><span class="bold">Email:</span> ${user.email}</div>
                        <div><span class="bold">GPA:</span> ${user.form.gpa}</div>
                        <div><span class="bold">Major:</span> ${user.form.intendedMajor}</div>
                    </div>
                </div>
            </a>
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

    document.getElementById('results').innerHTML = `<img width="75" src="/publicImages/saving.svg" alt="loading" class="loading" />`

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