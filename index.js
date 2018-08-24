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

  if (!config.twitter_follow_done) {
    await twitter.follow(pages[0], browser, config);
  }

  if (!config.twitter_like_done) {
    await twitter.like(pages[0], browser, config);
  }

};

execute();
