const puppeteer = require('puppeteer')

// runs puppeteer and then returns the pdf of the page
async function makePDF(formId) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(process.env.WEBSITELINK + `pdf/d20248a3e30e22982eed0de6eb0a9152/${formId}`, {waitUntil: 'networkidle0'});
  const pdf = await page.pdf({ format: 'A4'});
  
  await browser.close();
  return pdf
}

module.exports = makePDF;