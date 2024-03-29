var savedData;
var applyingFilterTimeout;

// run once in the beginng to generate the HTML for all the filters
function generateFiltersHTML(data, selector) {
    var htmlArry = [];
    for (var question of data) {

        if (question.type == 'text' || question.type == 'textArea') {
            htmlArry.push(genreateTextFilterHTML(question));
            continue;
        }

        if (question.type == 'options') {
            htmlArry.push(generateOptionsHTML(question));
            continue;
        }

        if (question.type == 'checkBoxes') {
            htmlArry.push(generateCheckBoxesOptionsHTML(question));
            continue;
        }

        if (question.type == 'checkBoxesGrid') {
            htmlArry.push(makeCheckboxGridQuestions(question));
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


// genreate HTML for the filtering data
function genreateTextFilterHTML(question) {
    return `
        <div title="${question.question}" class="containFilter">
            <div class="filterName">
                <span class="question">${question.question}</span>
                <span>${question.isNumber ? ' (Higher will show)' : ''}</span>
                <i class="fas fa-caret-down"></i>
            </div>
            <input isNumber=${question.isNumber} onKeyUp="applyFilters(event)" whatType=${question.type} whatName=${question.name} type="text" class="filterInput" placeholder="Search" class=" class="searchForText" />
        </div>
    `
}

function generateOptionsHTML(question) {
    var htmLArry = [];
    var optionsArry = [];
    var totalOptionsDone = 0;
    // go through all the options and add create the html for it 
    for (var option of question.options) {
        optionsArry.push(
            `
            <div style="display:${totalOptionsDone > 5 ? 'none' : 'flex'}" onclick="changeOptionValue(this)" class="filterItem">
                ${option == 'Other:' ? `<span>Search:&nbsp;&nbsp;</span><input onKeyUp="applyFilters()" whatType=${question.type} whatName=${question.name} type="text" class="filterInputOptions searchForText" />` : `<input whatType=${question.type} whatName=${question.name} name=${question.name} type="radio" value="${option}" class="" /> <span>${option}</span>`}
            </div>
            `
        );
        totalOptionsDone++;
    }
    // if there are more than 6 options then add the show more button
    if (optionsArry.length > 6) {
        optionsArry.push(
            `
            <div onclick="changeOptionValue(this)" class="filterItem">
                ${`<span>Search:&nbsp;&nbsp;</span><input onKeyUp="applyFilters()" whatType=${question.type} whatName=${question.name} type="text" class="filterInputOptions searchForText" />`}
            </div>
            <div onclick="showMoreOptions(this)" isShowingMore="false" class="filterItem openMoreOptions">
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
            <button class="clearButton" onclick="clearOptions(this)">Clear options</button>
            <fieldset whatType=${question.type} whatName=${question.name} class="filterItems">
                ${optionsArry.join('')}
            </fieldset>
        </div>
        `
    );

    return htmLArry.join('');
}

function generateCheckBoxesOptionsHTML(question) {
    var htmLArry = [];
    var optionsArry = [];
    var totalOptionsDone = 0;
    // go through all the options and add create the html for it
    for (var option of question.options) {
        //   whatSign can be positive, negative, or neutral
        optionsArry.push(
            `
            <div whatSign="neutral" style="display:${totalOptionsDone > 5 ? 'none' : 'flex'}" onclick="changeCheckBoxesValue(this)" class="filterItem">
                <span>${option}</span>
                <i class="fas"></i>
            </div>
            `
        );
        totalOptionsDone++;
    }
    // if there are more than 6 options then add the show more button
    if (optionsArry.length > 6) {
        optionsArry.push(
            `
            <div onclick="showMoreOptions(this)" isShowingMore="false" class="filterItem openMoreOptions">
                <div style="display:inline-block;margin:auto;">Show more</div>
            </div>
            `
        );
    }
    // add the parent container
    htmLArry.push(
        `
        <div title="${question.question}" class="containFilter">
            <div class="filterName">
                <span class="question">${question.question}</span>
                <span></span>
                <i class="fas fa-caret-down" aria-hidden="true"></i>
            </div>

            <button class="clearButton" onclick="clearCheckBoxes(this)">Clear options</button>
            
            <div class="specificSearch">
                <div class="text">Search for a specific option&nbsp;&nbsp;</div>
                <input onKeyUp="filterCheckBoxesOptions(this)" whatType=${question.type} whatName=${question.name} type="text"/>
            </div>

            <fieldset whatType=${question.type} whatName=${question.name} class="filterItems">
                ${optionsArry.join('')}
            </fieldset>
        </div>
        `
    );

    return htmLArry.join('');

}

// make the HTML for checkbox grid questions
function makeCheckboxGridQuestions(questionDetails) {
    var tableHTML = [];
    // loop through and make a table    
    for (var i = 0; i <= questionDetails.options.rows.length; i++) {
        var rowHTML = [];

        rowHTML.push(`<tr class="containOption" style="${i > 9 ? 'display:none;' : ''}">`);
        for (var j = 0; j <= questionDetails.options.columns.length; j++) {
            if (j == 0 && i == 0) {
                rowHTML.push(`<th></th>`);
                continue;
            }

            if (j == 0 && i != 0) {
                rowHTML.push(`<th>${questionDetails.options.rows[i - 1]}</th>`);
                continue;
            }

            if (i == 0) {
                rowHTML.push(`<th>${questionDetails.options.columns[j - 1]}</th>`);
                continue;
            }


            rowHTML.push(`<th><input onclick="changeCheckBoxesGridValue(this)" type="checkbox" name="${questionDetails.name}" id="${questionDetails.options.columns[j - 1] + ' !@#$% ' + questionDetails.options.rows[i - 1]}" /></th>`);

        }
        rowHTML.push(`</tr>`);
        tableHTML.push(rowHTML.join(''));
    }


    // return the HTML for the question
    return `
    <div class="formQuestion">
        <label for="${questionDetails.question}" class="questionPart">${questionDetails.question}</label>
        ${tableHTML.length > 9 ? `<h4 style="color:black;">Search for a specific option</h4>` : ''}
        ${tableHTML.length > 9 ? `<input class="speficSearch" type="text" onKeyUp="filterOptions(this)" />` : ''}
        
        <button class="clearButton" onclick="clearOptions(this)">Clear options</button>
        <table whatName=${questionDetails.name} whatType=${questionDetails.type} class="answerHere">
            ${tableHTML.join('')}
        </table>

        ${tableHTML.length > 9 ? `<div class="showMoreBtnCont noBorderNeeded"><button type="button" class="showMoreBtn" shownMore="true" onclick="showMoreCheckboxGrid(this)">Show All</button></div>` : ''}
    </div>   `
}

function changeCheckBoxesGridValue(obj) {
    obj.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('.clearButton').style.display = 'block';
    applyFilters();
}

// search through the options and show the ones that match for Checkbox Grid questions
function filterOptions(object) {
    const options = object.parentElement.querySelectorAll('.containOption');
    // get rid of the show more button

    // if the search bar is empty, show all options else filter
    if (object.value.replaceAll(' ', '') == '') {
        object.parentElement.querySelector('.showMoreBtnCont').style = '';

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
    }
}

function filterCheckBoxesOptions(obj) {
    var value = obj.value;
    var filterItems = obj.parentElement.parentElement.querySelectorAll('.filterItem');
    // go thtorugh and see which ones text match then show otherwise don't show
    for (var filterItem of filterItems) {
        var text = filterItem.innerText;
        if (text.toLowerCase().includes(value.toLowerCase())) {
            filterItem.style.display = 'flex';
        } else {
            filterItem.style.display = 'none';
        }
    }
    // if thye aren't searching for anything then show the first 6
    if (value == '') {

        for (filterItem of filterItems) {
            filterItem.style.display = 'none';
        }

        for (var i = 0; i < 6; i++) {
            filterItems[i].style.display = 'flex';
        }
        obj.parentElement.parentElement.querySelector('.openMoreOptions').style.display = 'flex';
    }
}

function changeCheckBoxesValue(obj) {
    var whatSign = obj.getAttribute('whatSign');
    var i = obj.querySelector('i');

    // change how it looks like to to the user
    if (whatSign == 'neutral') {
        obj.setAttribute('whatSign', 'positive');
        i.classList.remove('fa-times');
        i.classList.add('fa-check');
    } else if (whatSign == 'positive') {
        obj.setAttribute('whatSign', 'negative');
        i.classList.remove('fa-check');
        i.classList.add('fa-times');
    } else if (whatSign == 'negative') {
        obj.setAttribute('whatSign', 'neutral');
        i.classList.remove('fa-times');
    }
    // show the clear button
    obj.parentElement.parentElement.querySelector('.clearButton').style.display = 'block';
    applyFilters();
}


function showMoreCheckboxGrid(object) {
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

function showMoreOptions(obj) {
    var filterItems = obj.parentElement.parentElement.querySelectorAll('.filterItem');
    var searchInputs = obj.parentElement.querySelectorAll('.filterInputOptions');
    var isShowingMore = obj.getAttribute('isShowingMore') == 'true' ? true : false;

    // if it is showing more then hide the extra options
    if (isShowingMore) {
        for (var i = 6; i < filterItems.length; i++) {
            filterItems[i].style.display = 'none';
        }
        // try to do that if cant thats fine as well
        try {
            searchInputs[0].parentElement.style.display = 'flex';
        } catch (err) { }

        obj.style.display = 'flex';
        obj.setAttribute('isShowingMore', 'false');
        obj.querySelector('div').innerHTML = 'Show more';

    } else {
        // if there are two search bars then remove the second one

        if (searchInputs.length > 1) {
            for (var i = 1; i < searchInputs.length; i++) {
                searchInputs[i].parentElement.remove();
            }
        }

        for (var filterItem of filterItems) {
            filterItem.style.display = 'flex';
        }
        obj.setAttribute('isShowingMore', 'true');
        obj.querySelector('div').innerHTML = 'Show less';
    }

}

function getTextFilterValues(filterValues) {
    var inputs = document.querySelectorAll('.filterInput');
    // gets all the written inputs one
    for (var input of inputs) {
        if (input.value == '') continue;
        filterValues[input.getAttribute('whatName')] = { 'value': input.value, 'type': input.getAttribute('whatType') };
        if (input.getAttribute('isNumber') == 'true') filterValues[input.getAttribute('whatName')].isNumber = true;
    }
}

function getOptionFilterValues(filterValues) {
    var fieldsets = document.querySelectorAll('fieldset[whatType="options"]');

    for (var fieldset of fieldsets) {
        // gets all the selected options for the options
        var inputs = fieldset.querySelectorAll('input');
        for (var input of inputs) {
            if (input.checked) {
                console.log(input, 'checked');
                // if its text get that value
                if (input.getAttribute('type') == 'text') {
                    if (input.value == '') continue;

                    filterValues[fieldset.getAttribute('whatName')] = { 'value': input.value, 'type': fieldset.getAttribute('whatType') };
                    continue;
                }
                filterValues[fieldset.getAttribute('whatName')] = { 'value': input.getAttribute('value'), 'type': fieldset.getAttribute('whatType') };
            }
        }
    }
}

function getCheckBoxesFilterValues(filterValues) {
    var fieldsets = document.querySelectorAll('fieldset[whatType="checkBoxes"]');

    for (var fieldset of fieldsets) {
        // gets all the selected options for the options
        var inputs = fieldset.querySelectorAll('.filterItem');
        // since there are multiple options that can be selected we need to make an array
        filterValues[fieldset.getAttribute('whatName')] = { 'value': [], 'type': fieldset.getAttribute('whatType') };

        for (var input of inputs) {
            if (input.getAttribute('whatSign') != 'neutral' && input.getAttribute('whatSign') != null) {
                filterValues[fieldset.getAttribute('whatName')].value.push({ 'value': input.innerText, 'sign': input.getAttribute('whatSign') });
            }
        }
        if (filterValues[fieldset.getAttribute('whatName')].value.length == 0) delete filterValues[fieldset.getAttribute('whatName')];
    }
}

function getCheckBoxesGridFilterValues(filterValues) {
    var fieldsets = document.querySelectorAll('[whatType="checkBoxesGrid"]');
    console.log(fieldsets);
    for (var fieldset of fieldsets) {
        var grid = [];
        console.log(fieldset);
        for (var childElm of fieldset.querySelectorAll(`[type=checkbox]`)) {
            if (childElm.checked) {
                var splitId = childElm.getAttribute('id').split(' !@#$% ');
                grid.push({ 'columnValue': splitId[0], 'rowValue': splitId[1] });
            }
        }
        if (grid.length > 0) {
            filterValues[fieldset.getAttribute('whatName')] = { 'value': grid, 'type': fieldset.getAttribute('whatType') };
        }
    }

}

// gets all the filter values that in a json format that we could pass to the server
function getAllFilterValues() {
    var filterValues = {};

    getTextFilterValues(filterValues);
    getOptionFilterValues(filterValues);
    getCheckBoxesFilterValues(filterValues)
    getCheckBoxesGridFilterValues(filterValues);
    // gets all the selected options

    console.log(filterValues);
    return filterValues;
}

function changeOptionValue(obj) {
    var fieldset = obj.parentElement;
    var inputs = fieldset.querySelectorAll('input');

    for (var input of inputs) {
        input.checked = false;
    }
    obj.querySelector('input').checked = true;
    fieldset.parentElement.querySelector('.clearButton').style.display = 'block';

    applyFilters();

}

// this makes the user profile on the sidebar
function generateUsersHTML(users) {
    var htmLArry = [];
    // use "/image/${user.form.formId}" to get the image but now use base 64 image/url image
    var image;

    for (var user of users) {
        if (user.email.includes('test')) {
            image = user.form.image;
        } else {
            image = `/image/${formName}/${adminKeyForForm.slice(-5)}/${formId}/${user.userId}`;
        }
        // for some reason the user has no form don't show them
        if (user.form == null || user.form == undefined) continue;
        htmLArry.push(
            `
            <a title="Click on for more Info" target="_blank" href="/pdf/${adminPassword}/${user.userId}">
                <div class="card">
                    <div class="imgContainer">
                        <img src=${image} alt="Photo of ${user.form.firstName + ' ' + user.form.lastName}">
                    </div>
                    <div class="textContainer">
                        <div><span class="bold">Name:</span> <span>${user.form.firstName + ' ' + user.form.lastName}</span></div>
                        <div><span class="bold">Email:</span> <span>${user.email}</span></div>
                        <div><span class="bold">GPA:</span> <span>${user.form.gpa}</span></div>
                        <div><span class="bold">Major:</span> <span>${user.form.intendedMajor}</span></div>
                    </div>
                </div>
            </a>
            `
        );
    }
    return htmLArry.join('');
}

function clearOptions(obj) {
    var inputs = obj.parentElement.querySelectorAll('input');
    for (var input of inputs) {
        input.checked = false;
    }
    obj.style.display = 'none';
    applyFilters();
}

function clearCheckBoxes(obj) {
    var inputs = document.querySelectorAll('.filterItem');
    for (var input of inputs) {
        input.setAttribute('whatSign', 'neutral');
        try {
            input.querySelector('i').classList.remove('fa-check');
        } catch (error) { }

        try {
            input.querySelector('i').classList.remove('fa-times');
        } catch (error) { }
    }
    obj.style.display = 'none';
    applyFilters();
}

async function applyFilters(event) {
    if (event != undefined && event.type == "keyup"){
        clearTimeout(applyingFilterTimeout);
        applyingFilterTimeout = setTimeout(() => {
            applyFilters();
        }, 250);
        return;
    }

    var filterValues = getAllFilterValues();

    if (Object.keys(filterValues).length == 0) {
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
    if (request.status != 200){
        let data = await request.text();
        document.getElementById('results').innerHTML = `<div class="error">${data}</div>`;
        return;
    }
    const data = await request.json();
    console.log(data.length);
    savedData = data;
    //makeOneExcelSheet(savedData);
    if (data.length == 0) {
        document.getElementById('results').innerHTML = `<div style="color:white;">No results found</div>`;
        return;
    }
    document.getElementById('results').innerHTML = generateUsersHTML(data);
}

// formats all the json data in one sheet
// add paramater of data so we can make it so each user has its own sheet
// can be used for both, one sheet or multiple sheets just pass in the data
function makeExcelWithOneSheet(workBook, data) {
    // make the rows
    let rows = [];
    let headerRow = [
        [], // for the header row
        [], // just in case if we have checkboxes grid and then we have to make second row, for rowValue and ColumnValue
        []
    ];
    let questionOrders = []; // this is the order of the questions and their types we need this so we can put the user data in correct order
    let mergeCells = []; // this is for the checkboxes grid

    for (var formQuestion of formOptions) {
        if (formQuestion.type == "checkBoxesGrid") {
            headerRow[0].push(formQuestion.name);
            mergeCells.push({ s: { r: 0, c: headerRow[0].length - 1 }, e: { r: 0, c: headerRow[0].length } });
            headerRow[0].push('');
            headerRow[1].push('Column Value');
            headerRow[1].push('Row Value');
        } else {
            headerRow[0].push(formQuestion.name);
            headerRow[1].push('');
        }
        questionOrders.push({ 'key': formQuestion.name, 'type': formQuestion.type });
    }

    rows.push(...headerRow);

    for (var user of data) {
        var userRow = [];
        var moreRows = []; // this is for the checkboxes grid
        for (var question of questionOrders) {
            // check the type of the question and then add it to the row
            let type = question.type;

            if (user.form[question.key] == undefined) { // if the user didn't answer the question
                userRow.push('N/A');
                continue;
            }

            if (type == "text" || type == "textArea" || type == "options") {
                userRow.push(user.form[question.key]);
                continue;
            }

            if (type == "checkBoxes") {
                userRow.push(user.form[question.key].join(', '));
                continue;
            }

            if (type == "checkBoxesGrid") {
                for (var i = 0; i < user.form[question.key].length; i++) {
                    // for the first one put it in the same row
                    if (i == 0) {
                        userRow.push(user.form[question.key][i].columnValue);
                        userRow.push(user.form[question.key][i].rowValue);
                        continue;
                    }
                    // if the moreRows[i] doesn't exist make it
                    if (moreRows.length < user.form[question.key].length) moreRows.push([]);
                    // now properly pad the moreRows[i]
                    // i - 1 because we already added the first one to the userRow
                    for (var j = moreRows[i - 1].length - 1; j < userRow.length - 3; j++) {
                        moreRows[i - 1].push('');
                    }
                    // now add the value to the moreRows[i]
                    moreRows[i - 1].push(user.form[question.key][i].columnValue);
                    moreRows[i - 1].push(user.form[question.key][i].rowValue);
                }
            }
        }
        rows.push(userRow);
        rows.push(...moreRows);
        // make a blank row
        rows.push([]);
    }
    const ws = XLSX.utils.aoa_to_sheet(rows);

    ws['!merges'] = mergeCells;
    XLSX.utils.book_append_sheet(workBook, ws, data[0] == undefined ? 'Sheet 1': data[0].form.firstName + ' ' + data[0].form.lastName);
}

// makes it so all the data is in one sheet
function makeOneExcelSheet() {
    // make the workbook
    const workBook = XLSX.utils.book_new();
    makeExcelWithOneSheet(workBook, savedData);
    XLSX.writeFile(workBook, 'resultsWithOneSheet.xlsx');
}

// makes it so each user has its own sheet
function makeExcelWithDifferentSheets() {
    const workBook = XLSX.utils.book_new();
    for (var user of savedData) {
        makeExcelWithOneSheet(workBook, [user]);
    }
    XLSX.writeFile(workBook, 'results_with_different_sheet.xlsx');
}

// ALl i got to do is to make the UI so the user can download the data in different formats

// downloads all the data in pdf format as a zip file
async function downloadAllDataPDFS(){
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "savedData": savedData
        })
    }
    
    let urlInfo = window.location.pathname.split(`/`);
    let request = await fetch('/downloadAllPDFs/' + urlInfo[2] + '/' + urlInfo[3] + '/' + urlInfo[4], options);
    let data = await request.blob();
        
    let url = window.URL.createObjectURL(data);
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'results.zip';
    a.click();
    window.URL.revokeObjectURL(url);
}

/*
    @params way: type String, can be either 'pdf' or 'excel' or 'excelWithDifferentSheets' 
*/

function downLoadData(way){
    // check if the user has any data
    if (savedData == undefined || savedData.length == 0) return;
    if (way == 'pdf') {
        if (confirm('Are you sure you want to download all the data in pdf format? This might take a while, depending on how many users there are. Please be patient and do not refresh the page.')){
            return downloadAllDataPDFS();
        }
    }
    if (way == 'excel') return makeOneExcelSheet();
    if (way == 'excelWithDifferentSheets') return makeExcelWithDifferentSheets();
}