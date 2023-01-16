function genreateTextFilterHTML(question) {
    return `
        <div class="containFilter">
            <div class="filterName">
                <span>${question.name.toUpperCase()}</span>
                <i class="fas fa-caret-down"></i>
            </div>
            <input onKeyUp="applyFilters()" whatType=${question.type} whatName=${question.name} type="text" class="filterInput" placeholder="Search">
        </div>
    `
}

function generateFiltersHTML(data, selector) {
    var htmlArry = [];
    for (var question of data) {

        if (question.type == 'text') {
            htmlArry.push(genreateTextFilterHTML(question));
            continue;
        }

        htmlArry.push(
            `<div>${question.name}</div>`
        );
    }
    document.querySelector(selector).innerHTML = htmlArry.join('');
}

function getAllFilterValues() {
    var filterValues = {};
    var inputs = document.querySelectorAll('.filterInput');
    for (var input of inputs) {
        if (input.value == '') continue;
        filterValues[input.getAttribute('whatName')] = {'value': input.value, 'type': input.getAttribute('whatType')};
    }
    return filterValues;
}

function generateUsersHTML(users) {
    var htmLArry = [];
    for (var user of users) {
        htmLArry.push(
            `
            <div class="result">
                <div class="imgContainer">
                    <img src="/image/${user.form.formId}" alt="Photo of ${user.form.firstName + ' ' + user.form.lastName}">
                </div>
            </div>
            `
        );
    }
    return htmLArry.join('');
}

async function applyFilters(){
    var filterValues = getAllFilterValues();

    if (Object.keys(filterValues).length == 0) return;

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