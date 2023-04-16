const puppeteer = require('puppeteer')

// runs puppeteer and then returns the pdf of the page
async function makePDF(formName, formId, userId) {
  const browser = await puppeteer.launch({ 
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--single-process', '--no-zygote'],
    headless: true,  
    executablePath: process.env.PRODUCTION == true ? process.env.PUPPETEER_EXECUTABLE_PATH: puppeteer.executablePath(),
  });
  const page = await browser.newPage();

  await page.goto(process.env.WEBSITELINK + `pdf/${formName}/${process.env.ACCESS_KEY}/${formId}/${userId}`, {waitUntil: 'networkidle0'});
  const pdf = await page.pdf({ format: 'A4', margin: { top: '30px', bottom: '30px', left: '60px', right: '60px' }});
  
  await browser.close();
  return pdf
}

module.exports = makePDF;