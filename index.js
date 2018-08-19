'use strict';

const puppeteer = require('puppeteer');

const config = require('./config.json');

const setup = require('./modules/setup');
const twitter = require('./modules/twitter');

async function execute() {

  /*
    create the only browser instance and get the first page
  */
  const width = 1000
  const height = 800

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      `--window-size=${width},${height}`
    ],
  });

  const pages = await browser.pages();

  await pages[0].setViewport({
    width,
    height
  });

  await setup(pages[0], browser, config);

  switch (config.task) {
    case 'twitter:follow':
      twitter(pages[0], browser, config);
      break;
    default:
      console.error('unknown task');
  }

};

execute();
