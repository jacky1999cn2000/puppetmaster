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

  await setup.init(pages[0], browser, config);

  if (!config['youlikehits_user' + config.whichyoulikehitsuser].twitter_operation_done) {
    await twitter.operate(pages[0], browser, config);
  }

  await setup.reset(pages[0], browser, config);

};

execute();
