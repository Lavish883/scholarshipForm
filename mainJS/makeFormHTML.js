// makes questions that reuqires text, text can include numbers, and text can include special characters
function makeTextQuestions(questionDetails) {
    var minLength = '';
    var maxLength = '';
    var imageHTML = '';
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


    // return the HTML for the question
    return `
    <div class="formQuestion">
        <label for="${questionDetails.question}" class="questionPart">${questionDetails.question}<span class="requiredDisplay">${questionDetails.required == true ? '*': ''}</span></label>
        ${imageHTML}
        <div whatType=${questionDetails.type} class="answerHere">
            <input ${questionDetails.required ? "required": ''} type="text" ${minLength} ${maxLength} name="${questionDetails.name}" />
        </div>    
    </div>
    `
}
// make question for that have multiple choices
function makeMultipleChoiceQuestions(questionDetails) {
    var optionsHTML = [];
    // loop through the options and create the HTML for the options
    for (var i = 0; i < questionDetails.options.length; i++) {
        var option = questionDetails.options[i];
        optionsHTML.push(
            `
            <div style="${i > 9 ? "display:none;": '' }" class="containOption">
                <input type="radio" name="${questionDetails.name}" id=${option + questionDetails.question} value="${option}" />
                <label for="${option + questionDetails.question}">${option}</label>
                ${option == 'Other:' ? `<input type="text" class="withOther" name="${questionDetails.name}" />` : ''}
            </div>
            `
        )
    }

    // return the HTML for the question
    return `
    <div class="formQuestion">
        <label for="${questionDetails.question}" class="questionPart">${questionDetails.question}<span class="requiredDisplay">${questionDetails.required == true ? '*': ''}</span></label>
        
        ${optionsHTML.length > 9 ? `<h4>Search for a specific option</h4>` : ''}
        ${optionsHTML.length > 9 ? `<input class="speficSearch" type="text" onKeyUp="filterOptions(this)" />` : '' }

        <fieldset ${questionDetails.required ? "required": ''} whatType=${questionDetails.type} class="answerHere ${optionsHTML.length > 9 ? 'noBottomBorder' : ''}">
            ${optionsHTML.join('')}
        </fieldset>    
        ${optionsHTML.length > 9 ? `<div class="showMoreBtnCont" ><button type="button" class="showMoreBtn" shownMore="true" onclick="showMoreOptions(this)">Show All</button></div>`: '' }
    </div>
    `
}

// make the HTML for checkbox questions
function makeCheckboxQuestions(questionDetails) {
    var optionsHTML = [];
    // loop through the options and create the HTML for the options
    for (var i = 0; i < questionDetails.options.length; i++) {
        var option = questionDetails.options[i];
        optionsHTML.push(
            `
            <div style="${i > 9 ? "display:none;": '' }" class="containOption">
                <input type="checkbox" name="${questionDetails.name}" id=${option + questionDetails.question} value="${option}" />
                <label for="${option + questionDetails.question}">${option}</label>
            </div>
            `
        )
    }

    // return the HTML for the question
    return `
    <div class="formQuestion">
        <label for="${questionDetails.question}" class="questionPart">${questionDetails.question}<span class="requiredDisplay">${questionDetails.required == true ? '*': ''}</span></label>

        ${optionsHTML.length > 9 ? `<h4>Search for a specific option</h4>` : ''}
        ${optionsHTML.length > 9 ? `<input class="speficSearch" type="text" onKeyUp="filterOptions(this)" />` : '' }

        <fieldset whatType=${questionDetails.type} ${questionDetails.maxSelections != undefined ? "maxselections=" + questionDetails.maxSelections: ''} ${questionDetails.required ? "required": ''} class="answerHere ${optionsHTML.length > 9 ? 'noBottomBorder' : ''}">
            ${optionsHTML.join('')}
        </fieldset>
        ${optionsHTML.length > 9 ? `<div class="showMoreBtnCont" ><button type="button" class="showMoreBtn" shownMore="true" onclick="showMoreOptions(this)">Show All</button></div>`: '' }
    </div>   `
}

// make the HTML for checkbox grid questions
function makeCheckboxGridQuestions(questionDetails) {
    var tableHTML = [];
    // loop through and make a table    
    for (var i = 0; i <= questionDetails.options.rows.length; i++){
        var rowHTML = [];

        rowHTML.push(`<tr class="containOption" style="${i > 9 ? 'display:none;': ''}">`);
        for (var j = 0; j <= questionDetails.options.columns.length; j++){
            if (j == 0 && i == 0) { 
                rowHTML.push(`<th></th>`);
                continue;
            }
            
            if (j == 0 && i != 0){
                rowHTML.push(`<th>${questionDetails.options.rows[i - 1]}</th>`);
                continue;
            }
            
            if (i == 0){
                rowHTML.push(`<th>${questionDetails.options.columns[j - 1]}</th>`);
                continue;
            }
            
            rowHTML.push(`<th><input type="checkbox" name="${questionDetails.name}" id="${questionDetails.options.columns[j - 1] + ' ' + questionDetails.options.rows[i - 1]}" /></th>`);
            
        }
        rowHTML.push(`</tr>`);
        tableHTML.push(rowHTML.join(''));
    }

    
    // return the HTML for the question
    return `
    <div class="formQuestion">
        <label for="${questionDetails.question}" class="questionPart">${questionDetails.question}<span class="requiredDisplay">${questionDetails.required == true ? '*': ''}</span></label>
        ${tableHTML.length > 9 ? `<h4>Search for a specific option</h4>` : ''}
        ${tableHTML.length > 9 ? `<input class="speficSearch" type="text" onKeyUp="filterOptions(this)" />` : '' }
        
        <table whatType=${questionDetails.type} ${questionDetails.required ? "required": ''} ${questionDetails.maxSelections != undefined ? "maxselections=" + questionDetails.maxSelections: ''} class="answerHere">
            ${tableHTML.join('')}
        </table>

        ${tableHTML.length > 9 ? `<div class="showMoreBtnCont noBorderNeeded"><button type="button" class="showMoreBtn" shownMore="true" onclick="showMoreOptions(this)">Show All</button></div>`: '' }
    </div>   `
}

function makeFormHTML(formJSON, formId) {
    var htmlArry = [];

    for (var i = 0; i < formJSON.length; i++) {
        if (formJSON[i].type == 'text') {
            htmlArry.push(makeTextQuestions(formJSON[i]));
            continue;
        }
        if (formJSON[i].type == 'options') {
            htmlArry.push(makeMultipleChoiceQuestions(formJSON[i]));
            continue;
        }

        if (formJSON[i].type == 'checkBoxes') {
            htmlArry.push(makeCheckboxQuestions(formJSON[i]));
            continue;
        }

        if (formJSON[i].type == "checkBoxesGrid"){
            htmlArry.push(makeCheckboxGridQuestions(formJSON[i]));
            continue;
        }

    }
    return htmlArry.join('');
}

module.exports = makeFormHTML;