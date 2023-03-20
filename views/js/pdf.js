const itemsToPutInPdf = [
  "communityServiceHours",
  "awardsList",
  "sportsList",
  "sportsAwards",
  "clubsList",
  "clubsAwards",
  "intendedCareer",
  "intendedMajor",
  "gpa",
  "futureAspirations",
  "greatestWeakness",
  "communityServiceList"
];

function makeTextTypeQuestions(userInfo, pdfName, questionName){
    // separate the answers to a list of answers as they are separted by a comma
    var separtedList = userInfo.split(",");
    // loop through the list of answers and add them to the pdf
    var answerHTMLArry = [];

    for (var answer of separtedList){
        answerHTMLArry.push(`<h2 class="answer">${answer}</h2>`);
    }
        
    return `
        <div name="${questionName}">
            <h2 class="question">${pdfName}</h2>
            ${answerHTMLArry.join("")}
        </div>
    `
} 

function makeQuickInfoTextQuestions(userInfo, question){
    if (userInfo == undefined || userInfo == null || userInfo.length == 0) return "";
    
    var separtedList = userInfo.split(",");
    // loop through the list of answers and add them to the pdf
    var answerHTMLArry = [];

    for (var answer of separtedList){
        answerHTMLArry.push(`<h2 class="answer">${answer}</h2>`);
    }
        
    return `
        <div type=${question.type} name="${question.name}">
            <h2 class="description">${question.pdfName}</h2>
            ${answerHTMLArry.join("")}
        </div>
    `
}

function makecheckBoxesGrid(userInfo, question){
    if (userInfo.length == 0 || userInfo == undefined || userInfo == null) return "";
    var answerHTMLArry = [];

    for (var i = 0; i < userInfo.length; i++){
        answerHTMLArry.push(`<h2 class="answer fontSmaller">${userInfo[i].rowValue}: ${userInfo[i].columnValue}</h2>`);
    }

    return `
        <div type=${question.type} name="${question.name}">
            <h2 class="description">${question.pdfName}</h2>
            ${answerHTMLArry.join("")}
        </div>
    `
}

function makeCheckBoxes(userInfo, question){
    if (userInfo.length == 0 || userInfo == undefined || userInfo == null) return "";
    var answerHTMLArry = [];

    for (var i = 0; i < userInfo.length; i++){
        answerHTMLArry.push(`<h2 class="answer">${userInfo[i]}</h2>`);
    }

    return `
        <div type=${question.type} name="${question.name}">
            <h2 class="description">${question.pdfName}</h2>
            ${answerHTMLArry.join("")}
        </div>
    `

}

function handleLinkedTo(userInfo, question){
    if (userInfo == undefined || userInfo == null || userInfo == "") return;
    var linkedToElement = document.querySelector(`[name="${question.linkedTo}"]`);
    if (linkedToElement == undefined || linkedToElement == null) return;

    var separtedList = userInfo.split(",");
    var answerHTMLArry = [];

    for (var answer of separtedList){
        answerHTMLArry.push(`<h2 class="answer ${linkedToElement.getAttribute("type") == "checkBoxesGrid" ? "fontSmaller": ''}">${answer}</h2>`);
    }

    linkedToElement.innerHTML += answerHTMLArry.join("");
    
}

function generatePdfHTML(userForm, formOptions){
    // always have this on the pdf, communtiy service list one
    var writingQuestions = document.querySelector(".writing .questions");
    var quickInfo = document.querySelector(".quickInfo");

    writingQuestions.innerHTML = makeTextTypeQuestions(userForm["communityServiceList"], "Completed Community Service at:", "communityServiceHours");
    itemsToPutInPdf.splice(itemsToPutInPdf.indexOf("communityServiceList"), 1);

    for (var i = formOptions.length - 1; i >= 0; i--){
        var option = formOptions[i];

        if (option.type == "textArea" && itemsToPutInPdf.indexOf(option.name) != -1){
           writingQuestions.innerHTML += `
                <div type=${option.type} name="${option.name}">
                    <h2 class="question bigFontSize">${option.pdfName}</h2>
                    <h2 class="answer openResponse">${userForm[option.name]}</h2>
                </div>
            `
            continue;
        }
        if (option.type == "checkBoxesGrid" && itemsToPutInPdf.indexOf(option.name) != -1){
            quickInfo.innerHTML += makecheckBoxesGrid(userForm[option.name], option);
            continue;
        }
        if (itemsToPutInPdf.indexOf(option.linkedTo) != -1){
            handleLinkedTo(userForm[option.name], option);
            continue;
        }
        if (option.type == "text" && itemsToPutInPdf.indexOf(option.name) != -1){
            quickInfo.innerHTML += makeQuickInfoTextQuestions(userForm[option.name], option);
        }
        if (option.type == "checkBoxes" && itemsToPutInPdf.indexOf(option.name) != -1){
            quickInfo.innerHTML += makeCheckBoxes(userForm[option.name], option);
        }
    }
}