// this arry conatins the last 10 states of the form, so that the user can undo the last 10 changes
var last10States = [];

// automatically resizes the height of the textarea
function autoResize(obj) {
    obj.style.height = 'auto';
    obj.style.height = obj.scrollHeight + 'px';
}

// deltes the question
function deleteQuestion(obj) {
    obj.parentElement.parentElement.remove();
}

// gets rid of the clicked option
function removeOption(obj) {
    obj.parentElement.parentElement.remove();
}

// add a new option to the multiple choice question
function addMultipleChoiceOption(obj, isRowOrColumn = false) {
    var options = obj.parentElement;
    if (options.classList.contains("options") == false) {
        isRowOrColumn = true;
    }
    // oninput="this.setAttribute('value', this.value)"
    // so that the value of the input is saved when the user clicks on the "add option" button
    // because otherwise the value would be empty cause of innerHTML

    var newDiv = document.createElement("div");
    newDiv.innerHTML = `
        <div class="option">
            <i class="far fa-${isRowOrColumn == false ? "circle": "square"}"></i>
            <div class="optionTitle">
                <input type="text" class="optionTitleInput" oninput="this.setAttribute('value', this.value)" placeholder="Option"/>
            </div>
            <div class="optionDelete">
                <i onclick="removeOption(this)" class="fas fa-times"></i>
            </div>
        </div>
    `;
    //append that child before last child
    options.insertBefore(newDiv, options.lastElementChild);
}
//  makes the pdfName input visible or not
function changeQuestionInPDF(obj){
    var pdfName = obj.parentElement.parentElement.parentElement.querySelector(".pdfName");
    if (obj.checked){
        pdfName.style.display = "block";
    } else {
        pdfName.style.display = "none";
    }
}

// All below functions are used to generate the html for the questions that are already stored in the database

// generates the header for all of the questions, which consits of the question title, and switching between the different question types
function generateQuestionHeader(question){
    return `
        <div draggable="false" class="questionHeader">
            <div class="questionTitle">
                <textarea class="questionTitleInput" oninput="autoResize(this)" placeholder="Question">${question.question}</textarea>
            </div>
            ${generateQuestionTypeSelect(question.type)}
        </div>
    `
}

// generates the footer for all of the questions, which consists of the required, inPDF, isNumber, and delete buttons
function generateQuestionFooter(question){
    return `
        <div draggable="false" class="questionFooter">
            <div class="questionRequired">
                <span>Required:</span>
                <input ${question.required == true ? "checked": ""} type="checkbox" class="questionRequiredInput">
            </div>

            <div class="questionInPDF">
                <span>In generated PDF:</span>
                <input onclick="changeQuestionInPDF(this)" ${typeof question.pdfName == 'undefined' ? "" : "checked"} type="checkbox" class="questionInPDFInput">
            </div>

            <div class="isQuestionNumber">
                <span>Is question a number ?</span>
                <input ${question.isNumber == true ? "checked": ""} type="checkbox" class="isQuestioNumberInput">
            </div>

            <div onclick="deleteQuestion(this)" class="questionDelete">
                <i class="fas fa-trash-alt"></i>
            </div>
        </div>
    `
}

// generates the select element for the question type
function generateQuestionTypeSelect(questionType) {
    return `
        <div class="questionType">
            <div class="logo"></div>
            <select onchange="changeQuestionType(this)"  class="questionTypeSelect">
                <option ${questionType == "text" ? "selected": ""} value="text">Short answer</option>
                <option ${questionType == "textArea" ? "selected": ""}  value="textArea">Paragraph</option>
                <option ${questionType == "options" ? "selected": ""}  value="options">Multiple Choice</option>
                <option ${questionType == "checkBoxes" ? "selected": ""}  value="checkBoxes">Checkboxes</option>
                <option ${questionType == "checkBoxesGrid" ? "selected": ""}  value="checkBoxesGrid">Checkboxes Grid</option>
            </select>
        </div>   
    `
}

// generates the body for the short anwser&paragrpah questions
function generateTextQuestionBody(question){
    return `
    <div class="questionBody">
        <div class="questionID">
            <span>Question ID:</span>
            <input spellcheck="false" value="${question.name}" oninput="this.setAttribute('value', this.value)" type="text" class="questionIDInput" placeholder="Question ID">
        </div>
        <div class="linkedTo">
            <span>Linked to:</span>
            <input value="${typeof question.linkedTo == 'undefined' ? "" : question.linkedTo}" oninput="this.setAttribute('value', this.value)" type="text" class="linkedToInput" placeholder="Linked to">
        </div>

        <div class="maxLength">
            <span>Max length:</span>
            <input value="${typeof question.maxLength == 'undefined' ? "" : question.maxLength}" oninput="this.setAttribute('value', this.value)" type="number" class="maxLengthInput" placeholder="Max amount of chars">
        </div>

        <div style="display:${typeof question.pdfName == 'undefined' ? "none": "block"}" class="pdfName">
            <span>PDF name:</span>
            <input value="${typeof question.pdfName == 'undefined' ? "" : question.pdfName}" oninput="this.setAttribute('value', this.value)" type="text" class="pdfNameInput" placeholder="Name to be in pdf">
        </div>
    </div>
    `
}
// creates the short anwser&paragrpah questions
function generateTextQuestionHTML(question) {
    return `
        <div draggable="true" class="question">
            ${generateQuestionHeader(question)}
            <div class="questionBody">
                ${generateTextQuestionBody(question)}
            </div>
            ${generateQuestionFooter(question)}
        </div>
            `
}
// generates the options for both multiple choice and checkboxes
function generateAllOptions(options, checkbox = false){
    var htmlArry = [];

    for (var option of options){
        htmlArry.push(
            `
                <div class="option">
                    <i class="far fa-${checkbox == false ? "circle": "square"}"></i>
                    <div class="optionTitle">
                        <input value="${option}" ${option == "Other:" && checkbox == false ? "disabled": ""} oninput="this.setAttribute('value', this.value)" type="text" class="optionTitleInput" placeholder="Option"/>
                    </div>
                    <div class="optionDelete">
                        <i onclick="removeOption(this)" class="fas fa-times"></i>
                    </div>
                </div>
            `
        )
    }

    return htmlArry.join("");
}
// generates the body for the multiple choice 
function generateOptionQuestionBody(question){ 
    return `
        <div class="questionID">
            <span>Question ID:</span>
            <input spellcheck="false" value="${question.name}" oninput="this.setAttribute('value', this.value)" type="text" class="questionIDInput" placeholder="Question ID">
        </div>
        <div style="display:${typeof question.pdfName == 'undefined' ? "none": "block"}" class="pdfName">
            <span>PDF name:</span>
            <input value="${typeof question.pdfName == 'undefined' ? "" : question.pdfName}" oninput="this.setAttribute('value', this.value)" type="text" class="pdfNameInput" placeholder="Name to be in pdf">
        </div>
        <h4>Options</h4>
        <div class="options">
            ${generateAllOptions(question.options)}
            ${addMoreOptionButton()}
        </div>
    `
}
// creates the multiple choice questions
function generateOptionQuestionHTML(question) {
    return `
        <div draggable="true" class="question">
            ${generateQuestionHeader(question)}
            <div class="questionBody">
               ${generateOptionQuestionBody(question)}
            </div>
            ${generateQuestionFooter(question)}
        </div>
    `
}
function generateCheckBoxQuestionBody(question){
    return `
        <div class="questionID">
            <span>Question ID:</span>
            <input spellcheck="false" value="${question.name}" oninput="this.setAttribute('value', this.value)" type="text" class="questionIDInput" placeholder="Question ID">
        </div>
        <div class="maxSelections">
            <span>Max selections:</span>
            <input value="${typeof question.maxSelections == 'undefined' ? "" : question.maxSelections}" type="number" class="maxSelectionsInput" placeholder="Max selections">
        </div>
        <div style="display:${typeof question.pdfName == 'undefined' ? "none": "block"}" class="pdfName">
            <span>PDF name:</span>
            <input value="${typeof question.pdfName == 'undefined' ? "" : question.pdfName}" oninput="this.setAttribute('value', this.value)" type="text" class="pdfNameInput" placeholder="Name to be in pdf">
        </div>      

        <h4>Checkboxes</h4>
        <div class="options">
            ${generateAllOptions(question.options, true)}
        </div>
        ${addMoreOptionButton()}
    `
}
// creates the checkboxes questions
function generateCheckBoxQuestionHTML(question) {
    return `
        <div draggable="true" class="question">
            ${generateQuestionHeader(question)}
            <div class="questionBody">
                ${generateCheckBoxQuestionBody(question)}
            </div>
            ${generateQuestionFooter(question)}
        </div>
    `
}
//creates the add option button
function addMoreOptionButton(){
    return `
        <div onclick="addMultipleChoiceOption(this)" class="addOptionButton">
            <i class="fas fa-plus"></i>
            Add option
        </div>    
    `
}
function generateCheckBoxGridQuestionBody(question){
    return `
        <div class="questionID">
            <span>Question ID:</span>   
            <input spellcheck="false" value="${question.name}" oninput="this.setAttribute('value', this.value)" type="text" class="questionIDInput" placeholder="Question ID">
        </div>
        <div class="maxSelections">
            <span>Max selections:</span>
            <input value="${typeof question.maxSelections == 'undefined' ? "" : question.maxSelections}" type="number" class="maxSelectionsInput" placeholder="Max selections">
        </div>
        <div style="display:${typeof question.pdfName == 'undefined' ? "none": "block"}" class="pdfName">
            <span>PDF name:</span>
            <input value="${typeof question.pdfName == 'undefined' ? "" : question.pdfName}" oninput="this.setAttribute('value', this.value)" type="text" class="pdfNameInput" placeholder="Name to be in pdf">
        </div>
        <div class="checkBoxGrid">
            <div class="columns">
                <h4>Columns</h4>
                ${generateAllOptions(question.options.columns, true)}
                ${addMoreOptionButton()}
            </div>  
            <div class="rows">
                <h4>Rows</h4>
                ${generateAllOptions(question.options.rows, true)}
                ${addMoreOptionButton()}
            </div>
        </div>
    `
}
// creates the chec box grid type of questions
function generateCheckBoxGridQuestionHTML(question) {
    return `
        <div draggable="true" class="question">
            ${generateQuestionHeader(question)}
            <div class="questionBody">
                ${generateCheckBoxGridQuestionBody(question)}
            </div>
            ${generateQuestionFooter(question)}
        </div>
    `
}

// creates all the existing questions that are already in the database
function generateExistingQuestions(formOptions) {
    var htmlArry = [];

    for (var question of formOptions) {
        if (question.type == "text" || question.type == "textArea") {
            htmlArry.push(generateTextQuestionHTML(question));
            continue;
        }

        if (question.type == "options") {
            htmlArry.push(generateOptionQuestionHTML(question));
            continue;
        }

        if (question.type == "checkBoxes") {
            htmlArry.push(generateCheckBoxQuestionHTML(question));
            continue;
        }

        if (question.type == "checkBoxesGrid") {
           htmlArry.push(generateCheckBoxGridQuestionHTML(question));
            continue;
        }
    }

    document.getElementById("questions").innerHTML = htmlArry.join("");
    setUpCSS();
}

function setUpCSS(){
    document.querySelectorAll("textarea").forEach(textarea => {
        autoResize(textarea);
    });
    $("#questions").sortable({
        items: ".question",
        cursor: "move",
    });
}
// this is what gets saved to the database, generates the form options jso
function makeFormOptionsJSON(){
    var questions = document.querySelectorAll(".question");
    var formOptions = [];

    for (var question of questions){
        // get all the basic info
        var jsonQuestion = {
            "question": question.querySelector(".questionTitleInput").value,
            "type": question.querySelector(".questionTypeSelect").value,
            "required": question.querySelector(".questionRequiredInput").checked,
            "name": question.querySelector(".questionIDInput").value,
            "isNumber": question.querySelector(".isQuestioNumberInput").checked,
        }
        // get options if there are any it depends on the question type
        if (jsonQuestion.type == "options" || jsonQuestion.type == "checkBoxes"){
            jsonQuestion.options = [];
            var options = question.querySelectorAll(".optionTitleInput");

            for (var option of options){
                if (option.value == "") continue;
                jsonQuestion.options.push(option.value);
            }
        }

        if (jsonQuestion.type == "checkBoxesGrid"){
            jsonQuestion.options = {
                "columns": [],
                "rows": []
            }
            var columns = question.querySelectorAll(".columns .optionTitleInput");
            var rows = question.querySelectorAll(".rows .optionTitleInput");

            for (var column of columns){
                if (column.value == "") continue;
                jsonQuestion.options.columns.push(column.value);
            }

            for (var row of rows){
                if (row.value == "") continue;
                jsonQuestion.options.rows.push(row.value);
            }
        }

        // now get any extra data that might exist for that question
        var linkedToInput = question.querySelector(".linkedToInput");
        if (linkedToInput != null && linkedToInput.value != ""){
            jsonQuestion.linkedTo = linkedToInput.value;
        }

        var maxSelectionsInput = question.querySelector(".maxSelectionsInput");
        if (maxSelectionsInput != null && maxSelectionsInput.value != ""){
            jsonQuestion.maxSelections = maxSelectionsInput.value;
        }

        var maxLengthInput = question.querySelector(".maxLengthInput");
        if (maxLengthInput != null && maxLengthInput.value != ""){
            jsonQuestion.maxLength = maxLengthInput.value;
        }

        var pdfNameInput = question.querySelector(".pdfNameInput");
        if (pdfNameInput != null && pdfNameInput.style.display != "none" && pdfNameInput.value != ""){
            jsonQuestion.pdfName = pdfNameInput.value;
        }

        formOptions.push(jsonQuestion);
    }
    return formOptions;
}
// getss all the data asscociated with the form, that is the form name, id, admin key and the form options
function getFormData(){
    var formName = window.location.pathname.split("/")[2];
    var adminKey = window.location.pathname.split("/")[3];
    var formId = window.location.pathname.split("/")[4];
    
    var form = {
        "formName": formName,
        "formId": formId,
        "adminKey": adminKey,
        "formOptions": makeFormOptionsJSON()
    }

    return form;
}

// saves the form to the server
async function saveFormToServer(obj, formToolBar = false){
    // adjust the css so that the usr knows its saving
    if (formToolBar == false) {
        obj.querySelector("img").style.display = "block";
        obj.style.backgroundColor = "#3c8e41";
        obj.setAttribute("onclick", "");
        obj.querySelector("span").innerHTML = "Saving...";
    } else {
        document.querySelector(".formToolBar .fa-save").remove();
        document.querySelector(".formToolBar").innerHTML += `<i class="fas fa-circle-notch fa-spinner fa-spin"></i>`;
    }


    var options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(getFormData())
    }

    var response = await fetch("/editForm/save", options);
    var data = await response.text();

    if (response.status != 200){
        alert("Something went wrong. Please contact the developer.");
    }

    // adjust the css so that the usr knows its done saving
    if (formToolBar == false) {
        obj.querySelector("img").style.display = "none";
        obj.style.backgroundColor = "#4caf50";
        obj.setAttribute("onclick", "saveFormToServer(this)");
        obj.querySelector("span").innerHTML = "Save Form to Server";
    } else {
        document.querySelector(".formToolBar .fa-spinner").remove();
        document.querySelector(".formToolBar").innerHTML += `<i class="fas fa-check"></i>`;
        setTimeout(() => {
            document.querySelector(".formToolBar .fa-check").remove();
            document.querySelector(".formToolBar").innerHTML += `<i onclick="saveFormToServer(this, true)" title="Save Form to Server" class="fas fa-save"></i>`;
        }, 500);
    }
}

function scrollToolBar(event){
    document.querySelector(".formToolBar").style.top = window.scrollY + 50 + "px";
}

function addQuestion(){
    var question = generateTextQuestionHTML({
        "type": "text",
        "question": "",
        "required": false,
        "name": "",
    });
    var newElement = document.createElement("div");
    newElement.innerHTML = question;
    document.getElementById("questions").appendChild(newElement);
    newElement.scrollIntoView({behavior: "smooth"});
    setUpCSS();
}

function generateQuestionBodyHTML(type, question){
    if (type == "text" || type == "textArea"){ 
        return generateTextQuestionBody(question);
    }

    if (type == "options"){
        return generateOptionQuestionBody(question);
    }

    if (type == "checkBoxes"){
        console.log(generateCheckBoxQuestionBody(question));
        return generateCheckBoxQuestionBody(question);
    }

    if (type == "checkBoxesGrid"){
        question.options = { 
            "columns": question.options.slice(0, question.options.length / 2),
            "rows": question.options.slice(question.options.length / 2, question.options.length)
        }
        return generateCheckBoxGridQuestionBody(question);
    }
}

function changeQuestionType(obj){
    var questionType = obj.value;
    // gets all the propertiess that user might of set alrea
    var question = obj.parentElement.parentElement.parentElement;
    var linkedTo = question.querySelector(".linkedToInput");
    var maxSelections = question.querySelector(".maxSelectionsInput");
    var maxLength = question.querySelector(".maxLengthInput");
    var pdfName = question.querySelector(".pdfNameInput");
    var questionID = question.querySelector(".questionIDInput");
    
    // get all of the options if it has any
    var options = [];
    question.querySelectorAll(".optionTitleInput").forEach((option) => {
        if (option.value != ""){
            options.push(option.value);
        }
    });
    // make the question object to be passed into the generateQuestionBodyHTML function
    var questionObj = {
        "type": questionType,
        "linkedTo": linkedTo != null ? linkedTo.value : undefined,
        "maxSelections": maxSelections != null ? maxSelections.value : undefined,
        "maxLength": maxLength != null ? maxLength.value : undefined,
        "pdfName": pdfName != null ? pdfName.value : undefined,
        "name": questionID != null ? questionID.value : undefined,
        "options": options
    }
    // makes it checked as when we change the body pdfname will be shown
    if (pdfName != null){
        question.querySelector(".questionInPDFInput").setAttribute("checked", "true");
    }
        
    // change in question body
    question.querySelector(".questionBody").innerHTML = generateQuestionBodyHTML(questionType, questionObj);
}

// auto save the form every 10 seconds
async function autoSave(){
    await saveFormToServer(document.querySelector('.formToolBar .fa-save'), true);
    setTimeout(autoSave, 10000); // 10 seconds
}

window.addEventListener("scroll", scrollToolBar);

//autoSave();