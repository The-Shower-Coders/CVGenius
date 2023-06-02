const puppeteer = require('puppeteer');

let browserInstance;

async function getBrowserInstance() {
  if (browserInstance) {
    return browserInstance;
  } else {
    browserInstance = await puppeteer.launch({headless: 'new'});
    return browserInstance;
  }
}


module.exports = getBrowserInstance;