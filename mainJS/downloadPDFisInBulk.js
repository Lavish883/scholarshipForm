const schemas = require('../schemas/schemas');
const findForm = require('../mainJS/pathFunctions').findForm;
const JSZip = require('jszip');
const puppeteer = require('puppeteer');

function setDelay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    })
}

async function downloadAllPDFs(req, res){
    // find the formId from the database & check if the user is authorized to download the pdfs
    var formUser = await schemas.formMakerUsers.findOne({ 'forms.formId': req.params.formId, 'forms.formName': unescape(req.params.formName) });
    if (formUser == null || formUser == undefined) return res.status(403).send('Not Authorized !!! Check the password or contact the admin');

    var formOptions = findForm(formUser, req.params.formId);
    if (req.params.adminKey != formOptions.adminKeyForForm) return res.status(403).send('Not authorized');

    // make all the fetch urls for the pdfs
    var fetchURLS = [];

    for (var user of req.body.savedData){
        fetchURLS.push(process.env.WEBSITELINK + `pdf/${req.params.formName}/${req.params.adminKey}/${req.params.formId}/` + user.userId);
    }   
    // create a zip file
    const zip = new JSZip();

    // launch puppeteer and fetch all the pdfs
    const browser = await puppeteer.launch({ 
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--single-process', '--no-zygote'],
        headless: "new",  
        executablePath: process.env.PRODUCTION == true ? process.env.PUPPETEER_EXECUTABLE_PATH: puppeteer.executablePath(),
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    for (var i = 0; i < fetchURLS.length; i++){
        await page.goto(fetchURLS[i], {waitUntil: 'networkidle0'});
        const pdf = await page.pdf({ format: 'A4', margin: { top: '30px', bottom: '30px', left: '60px', right: '60px' }});        
        await zip.file(req.body.savedData[i].form.firstName + req.body.savedData[i].form.lastName + '.pdf', pdf);
    }

    await browser.close();

    // now generate the zip file
    zip.generateAsync({type:"nodebuffer"}).then(function(content) {
        // send the zip file
        res.set({ 'Content-Type': 'application/zip', 'Content-Length': content.length })
        return res.send(content);
    });    
}


module.exports = downloadAllPDFs;