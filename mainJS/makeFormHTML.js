// fill info that user already filled in
function fillTextInfo(user, formAtrribute, type) {
    const filledInInfo = user.form[formAtrribute];

    if (type == 'textArea' || type == 'text') {
        if (filledInInfo != undefined) {
            return filledInInfo;
        }
    }

    return '';
}

function fillMultipleChoiceInfo(user, formAtrribute, option) {
    const filledInInfo = user.form[formAtrribute];

    if (filledInInfo === undefined) return '';

    if (filledInInfo == option) {
        return 'checked="true"';
    }

    if (option == 'Other:' || option == 'Other') {
        if (filledInInfo.includes(" !@#$ ")) {
            return 'checked="true"';
        }
    }

    return ''
}

function fillCheckboxInfo(user, formAtrribute, option) {
    const filledInInfo = user.form[formAtrribute];

    if (filledInInfo != undefined) {
        for (var i = 0; i < filledInInfo.length; i++) {
            if (filledInInfo[i] == option) {
                return 'checked="true"';
            }
        }
    }

    return '';
}

function fillCheckboxGridInfo(user, formAtrribute, col, row) {
    const filledInInfo = user.form[formAtrribute];

    if (filledInInfo != undefined) {
        for (var i = 0; i < filledInInfo.length; i++) {
            if (filledInInfo[i].columnValue == col && filledInInfo[i].rowValue == row) {
                return 'checked="true"';
            }
        }
    }

    return '';
}

// makes questions that reuqires text, text can include numbers, and text can include special characters
function makeTextQuestions(questionDetails, user) {
    var minLength = '';
    var maxLength = '';
    var imageHTML = '';
    var htmlTag = 'input';

    var filledInfo = fillTextInfo(user, questionDetails.name, questionDetails.type);
    var fillTextArea = fillTextInfo(user, questionDetails.name, questionDetails.type);

    // prefill the info if it exists
    if (filledInfo != '' && questionDetails.type != 'textArea') {
        filledInfo = 'value="' + filledInfo + '"';
    } else {
        filledInfo = '';
    }

    if (questionDetails.type != 'textArea') {
        fillTextArea = '';
    }

    // check if it has max length or minlength attributes or not or image for refrence
    if (questionDetails.minLength != undefined) {
        minLength = `minlength=${questionDetails.minLength}`
    }

    if (questionDetails.maxLength != undefined) {
        maxLength = `maxlength=${questionDetails.maxLength}`
    }

    if (questionDetails.img != undefined) {
        imageHTML = `<img src="${questionDetails.img}" />`
    }

    if (questionDetails.type == 'textArea') {
        htmlTag = 'textarea';
    }

    // return the HTML for the question
    return `
    <div class="formQuestion">
        <label for="${questionDetails.question}" class="questionPart">${questionDetails.question}<span class="requiredDisplay">${questionDetails.required == true ? '*' : ''}</span></label>
        ${imageHTML}
        <div whatType=${questionDetails.type} class="answerHere">
            <${htmlTag} oninput="${htmlTag == 'textarea' ? "autoResize(this)" : ''}" ${filledInfo} ${questionDetails.required ? "required" : ''} type="${questionDetails.type}" ${minLength} ${maxLength} name="${questionDetails.name}">${fillTextArea}</${htmlTag}>
        </div>    
    </div>
    `
}
// make question for that have multiple choices
function makeMultipleChoiceQuestions(questionDetails, user) {
    var optionsHTML = [];
    // loop through the options and create the HTML for the options
    for (var i = 0; i < questionDetails.options.length; i++) {
        var option = questionDetails.options[i];
        var isChosen = fillMultipleChoiceInfo(user, questionDetails.name, option);
        var userText = user.form[questionDetails.name];

        // fill in the text if the user chose other
        if (userText != undefined && userText.includes(" !@#$ ")) {
            userText = userText.split(' !@#$ ')[1];
        } else {
            userText = '';
        }

        optionsHTML.push(
            `
            <div style="${i > 9 ? "display:none;" : ''}" class="containOption">
                <input type="radio" name="${questionDetails.name}" ${isChosen} id=${option + questionDetails.question} value="${option}" />
                <label for="${option + questionDetails.question}">${option}</label>
                ${option == 'Other:' ? `<input type="text" class="withOther" name="${questionDetails.name}" value="${userText}" />` : ''}
            </div>
            `
        )
    }

    // return the HTML for the question
    return `
    <div class="formQuestion">
        <label for="${questionDetails.question}" class="questionPart">${questionDetails.question}<span class="requiredDisplay">${questionDetails.required == true ? '*' : ''}</span></label>
        
        ${optionsHTML.length > 9 ? `<h4>Search for a specific option</h4>` : ''}
        ${optionsHTML.length > 9 ? `<input class="speficSearch" type="text" onKeyUp="filterOptions(this)" />` : ''}

        <fieldset ${questionDetails.required ? "required" : ''} whatType=${questionDetails.type} class="answerHere ${optionsHTML.length > 9 ? 'noBottomBorder' : ''}">
            ${optionsHTML.join('')}
        </fieldset>    
        ${optionsHTML.length > 9 ? `<div class="showMoreBtnCont" ><button type="button" class="showMoreBtn" shownMore="true" onclick="showMoreOptions(this)">Show All</button></div>` : ''}
    </div>
    `
}

// make the HTML for checkbox questions
function makeCheckboxQuestions(questionDetails, user) {
    var optionsHTML = [];

    var userText = user.form[questionDetails.name];

    // fill in the text if the user chose other
    if (userText != undefined && userText.includes(" !@#$ ")) {
        userText = userText.split(' !@#$ ')[1];
    } else {
        userText = '';
    }

    // loop through the options and create the HTML for the options
    for (var i = 0; i < questionDetails.options.length; i++) {
        var option = questionDetails.options[i];
        let isOptionChecked = fillCheckboxInfo(user, questionDetails.name, option);
        optionsHTML.push(
            `
            <div style="${i > 9 ? "display:none;" : ''}" class="containOption">
                <input ${isOptionChecked} type="checkbox" name="${questionDetails.name}" id=${option + questionDetails.question} value="${option}" />
                <label for="${option + questionDetails.question}">${option}</label>
                ${option == 'Other:' ? `<input type="text" class="withOther" name="${questionDetails.name}" value="${userText}" />` : ''}
            </div>
            `
        )
    }

    // return the HTML for the question
    return `
    <div class="formQuestion">
        <label for="${questionDetails.question}" class="questionPart">${questionDetails.question}<span class="requiredDisplay">${questionDetails.required == true ? '*' : ''}</span></label>

        ${optionsHTML.length > 9 ? `<h4>Search for a specific option</h4>` : ''}
        ${optionsHTML.length > 9 ? `<input class="speficSearch" type="text" onKeyUp="filterOptions(this)" />` : ''}

        <fieldset whatType=${questionDetails.type} ${questionDetails.maxSelections != undefined ? "maxselections=" + questionDetails.maxSelections : ''} ${questionDetails.required ? "required" : ''} class="answerHere ${optionsHTML.length > 9 ? 'noBottomBorder' : ''}">
            ${optionsHTML.join('')}
        </fieldset>
        ${optionsHTML.length > 9 ? `<div class="showMoreBtnCont" ><button type="button" class="showMoreBtn" shownMore="true" onclick="showMoreOptions(this)">Show All</button></div>` : ''}
    </div>   `
}

// make the HTML for checkbox grid questions
function makeCheckboxGridQuestions(questionDetails, user) {
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

            let isOptionChecked = fillCheckboxGridInfo(user, questionDetails.name, questionDetails.options.columns[j - 1], questionDetails.options.rows[i - 1]);

            rowHTML.push(`<th><input ${isOptionChecked} type="checkbox" name="${questionDetails.name}" id="${questionDetails.options.columns[j - 1] + ' !@#$% ' + questionDetails.options.rows[i - 1]}" /></th>`);

        }
        rowHTML.push(`</tr>`);
        tableHTML.push(rowHTML.join(''));
    }


    // return the HTML for the question
    return `
    <div class="formQuestion">
        <label for="${questionDetails.question}" class="questionPart">${questionDetails.question}<span class="requiredDisplay">${questionDetails.required == true ? '*' : ''}</span></label>
        ${tableHTML.length > 9 ? `<h4>Search for a specific option</h4>` : ''}
        ${tableHTML.length > 9 ? `<input class="speficSearch" type="text" onKeyUp="filterOptions(this)" />` : ''}
        
        <table whatType=${questionDetails.type} ${questionDetails.required ? "required" : ''} ${questionDetails.maxSelections != undefined ? "maxselections=" + questionDetails.maxSelections : ''} class="answerHere">
            ${tableHTML.join('')}
        </table>

        ${tableHTML.length > 9 ? `<div class="showMoreBtnCont noBorderNeeded"><button type="button" class="showMoreBtn" shownMore="true" onclick="showMoreOptions(this)">Show All</button></div>` : ''}
    </div>   `
}

function makeFormHTML(formJSON, user) {
    var htmlArry = [];

    for (var i = 0; i < formJSON.length; i++) {
        if (formJSON[i].type == 'text' || formJSON[i].type == 'textArea') {
            htmlArry.push(makeTextQuestions(formJSON[i], user));
            continue;
        }
        if (formJSON[i].type == 'options') {
            htmlArry.push(makeMultipleChoiceQuestions(formJSON[i], user));
            continue;
        }

        if (formJSON[i].type == 'checkBoxes') {
            htmlArry.push(makeCheckboxQuestions(formJSON[i], user));
            continue;
        }

        if (formJSON[i].type == "checkBoxesGrid") {
            htmlArry.push(makeCheckboxGridQuestions(formJSON[i], user));
            continue;
        }

    }
    return htmlArry.join('');
}

module.exports = makeFormHTML;