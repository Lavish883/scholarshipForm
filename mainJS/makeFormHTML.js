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
        <label for="${questionDetails.question}" class="questionPart">${questionDetails.question}</label>
        ${imageHTML}
        <div class="answerHere">
            <input required=${questionDetails.required} type="text" ${minLength} ${maxLength} name="${questionDetails.question}" />
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
            <div style="${i > 1000 ? "display:none;": '' }" class="containOption">
                <input type="radio" name="${questionDetails.question}" id=${option + questionDetails.question} value="${option}" />
                <label for="${option + questionDetails.question}">${option}</label>
                ${option == 'Other:' ? `<input type="text" class="withOther" name="${questionDetails.question}" />` : ''}
            </div>
            `
        )
    }

    // return the HTML for the question
    return `
    <div class="formQuestion">
        <label for="${questionDetails.question}" class="questionPart">${questionDetails.question}</label>
        <fieldset required=${questionDetails.required} class="answerHere">
            ${optionsHTML.join('')}
        </fieldset>    
    </div>
    `
}

// make the HTML for checkbox questions
function makeCheckboxQuestions(questionDetails) {
    var optionsHTML = [];
    // loop through the options and create the HTML for the options
    for (var option of questionDetails.options) {
        optionsHTML.push(
            `
            <div class="containOption">
                <input type="checkbox" name="${questionDetails.question}" id=${option + questionDetails.question} value="${option}" />
                <label for="${option + questionDetails.question}">${option}</label>
            </div>
            `
        )
    }

    // return the HTML for the question
    return `
    <div class="formQuestion">
        <label for="${questionDetails.question}" class="questionPart">${questionDetails.question}</label>
        <fieldset required=${questionDetails.required} class="answerHere">
            ${optionsHTML.join('')}
        </fieldset>
    </div>   `
}

// make the HTML for checkbox grid questions
function makeCheckboxGridQuestions(questionDetails) {
    var tableHTML = [];
    // loop through and make a table    
    for (var i = 0; i <= questionDetails.options.rows.length; i++){
        tableHTML.push(`<tr>`);
        for (var j = 0; j <= questionDetails.options.columns.length; j++){
            if (j == 0 && i == 0) { 
                tableHTML.push(`<th></th>`);
                continue;
            }
            
            if (j == 0 && i != 0){
                tableHTML.push(`<th>${questionDetails.options.rows[i - 1]}</th>`);
                continue;
            }
            
            if (i == 0){
                tableHTML.push(`<th>${questionDetails.options.columns[j - 1]}</th>`);
                continue;
            }
            
            tableHTML.push(`<th><input type="checkbox" name="${questionDetails.options.columns[j - 1] + ' ' + questionDetails.options.rows[i - 1]}" /></th>`);
            
        }
        tableHTML.push(`</tr>`);
    }

    
    // return the HTML for the question
    return `
    <div class="formQuestion">
        <label for="${questionDetails.question}" class="questionPart">${questionDetails.question}</label>
        <table>
            ${tableHTML.join('')}
        </table>
        <div class="answerHere">
        </div>
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