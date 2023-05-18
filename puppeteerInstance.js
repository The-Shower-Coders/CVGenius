const puppeteer = require('puppeteer');

let browserInstance;

async function getBrowserInstance() {
  if (browserInstance) {
    return browserInstance;
  } else {
    browserInstance = await puppeteer.launch();
    return browserInstance;
  }
}

module.exports = getBrowserInstance;