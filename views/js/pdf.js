const itemsToPutInPdf = [];

function makeItemsToPutInPdf(formOptions) {
    for (var option of formOptions) {
        if (option.pdfName != undefined && option.pdfName != null && option.pdfName != "") {
            itemsToPutInPdf.push(option.name);
        }
    }
}

function makeTextTypeQuestions(userInfo, pdfName, questionName) {
    // separate the answers to a list of answers as they are separted by a comma
    var separtedList = userInfo.split(",");
    // loop through the list of answers and add them to the pdf
    var answerHTMLArry = [];

    for (var answer of separtedList) {
        answerHTMLArry.push(`<h2 class="answer">${sanitizeHTML(answer)}</h2>`);
    }

    return `
        <div name="${questionName}">
            <h2 class="question">${pdfName}</h2>
            ${answerHTMLArry.join("")}
        </div>
    `
}

function makeQuickInfoTextQuestions(userInfo, question) {
    if (userInfo == undefined || userInfo == null || userInfo.length == 0) return "";

    var separtedList = userInfo.split(",");
    // loop through the list of answers and add them to the pdf
    var answerHTMLArry = [];

    for (var answer of separtedList) {
        answerHTMLArry.push(`<h2 class="answer">${sanitizeHTML(answer)}</h2>`);
    }

    return `
        <div type=${question.type} name="${question.name}">
            <h2 class="description">${question.pdfName}</h2>
            ${answerHTMLArry.join("")}
        </div>
    `
}

function makecheckBoxesGrid(userInfo, question) {
    if (userInfo.length == 0 || userInfo == undefined || userInfo == null) return "";
    var answerHTMLArry = [];

    for (var i = 0; i < userInfo.length; i++) {
        answerHTMLArry.push(`<h2 class="answer fontSmaller">${sanitizeHTML(userInfo[i].rowValue)}${sanitizeHTML(userInfo[i].rowValue).charAt(sanitizeHTML(userInfo[i].rowValue).length - 1) == ":" ? "" : ":"} ${sanitizeHTML(userInfo[i].columnValue)}</h2>`);
    }

    return `
        <div type=${question.type} name="${question.name}">
            <h2 class="description">${question.pdfName}</h2>
            ${answerHTMLArry.join("")}
        </div>
    `
}

function makeCheckBoxes(userInfo, question) {
    if (userInfo.length == 0 || userInfo == undefined || userInfo == null) return "";
    var answerHTMLArry = [];

    if (typeof userInfo == "string") userInfo = [userInfo];

    for (var i = 0; i < userInfo.length; i++) {
        answerHTMLArry.push(`<h2 class="answer">${sanitizeHTML(userInfo[i])}</h2>`);
    }

    return `
        <div type=${question.type} name="${question.name}">
            <h2 class="description">${question.pdfName}</h2>
            ${answerHTMLArry.join("")}
        </div>
    `

}

function handleLinkedTo(userInfo, question) {
    if (userInfo == undefined || userInfo == null || userInfo == "") return;
    var linkedToElement = document.querySelector(`[name="${question.linkedTo}"]`);
    if (linkedToElement == undefined || linkedToElement == null) return;

    var separtedList = userInfo.split(",");
    var answerHTMLArry = [];

    for (var answer of separtedList) {
        answerHTMLArry.push(`<h2 class="answer ${linkedToElement.getAttribute("type") == "checkBoxesGrid" ? "fontSmaller" : ''}">${sanitizeHTML(answer)}</h2>`);
    }

    linkedToElement.innerHTML += answerHTMLArry.join("");
}

function sanitizeHTML(str) {
    var temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

function generatePdfHTML(userForm, formOptions) {
    var writingQuestions = document.querySelector(".writing .questions");
    var quickInfo = document.querySelector(".quickInfo");

    for (var i = 0; i < formOptions.length; i++) {
        var option = formOptions[i];

        if (option.type == "textArea" && itemsToPutInPdf.indexOf(option.name) != -1) {
            writingQuestions.innerHTML += `
                <div type=${option.type} name="${option.name}">
                    <h2 class="question bigFontSize">${sanitizeHTML(option.pdfName)}</h2>
                    <h2 class="answer openResponse">${sanitizeHTML(userForm[option.name])}</h2>
                </div>
            `
            continue;
        }

        if (option.type == "checkBoxesGrid" && itemsToPutInPdf.indexOf(option.name) != -1) {
            if (option.onLeftSideOfPdfInput == true){
                writingQuestions.innerHTML += makecheckBoxesGrid(userForm[option.name], option);
            } else {
                quickInfo.innerHTML += makecheckBoxesGrid(userForm[option.name], option);
            }
            continue;
        }

        if (itemsToPutInPdf.indexOf(option.linkedTo) != -1) {
            handleLinkedTo(userForm[option.name], option);
            continue;
        }

        if (option.type == "text" && itemsToPutInPdf.indexOf(option.name) != -1) {
            if (option.onLeftSideOfPdfInput == true) {
                writingQuestions.innerHTML += makeQuickInfoTextQuestions(userForm[option.name], option);
            } else { 
                quickInfo.innerHTML += makeQuickInfoTextQuestions(userForm[option.name], option);
            }
        }
        if ((option.type == "checkBoxes" || option.type == "options" )&& itemsToPutInPdf.indexOf(option.name) != -1) {
            if (option.onLeftSideOfPdfInput == true) {
                writingQuestions.innerHTML += makeCheckBoxes(userForm[option.name], option);
            } else {
                quickInfo.innerHTML += makeCheckBoxes(userForm[option.name], option);
            }
        }
    }
}