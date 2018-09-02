'use strict';

const _ = require('lodash');
const utils = require('./utils');
const jsonfile = require('jsonfile');

let tweets = require('../notes/tweets.json');

module.exports = {

  get: async (page, browser, config) => {

    utils.log('getfuntweets:get', 2);

    await page.goto(config.funtweets_url, {
      waituntil: "networkidle0"
    });

    while (tweets.length < 100) {
      // get all tweets on the page
      const funtweets = await page.evaluate(
        () => [...document.querySelectorAll('.tweet-text')]
        .map(element => element.innerText.split('\n')[1])
      );

      // add to tweets array
      tweets = tweets.concat(funtweets);

      console.log('tweets.length ', tweets.length);

      // click button to load more tweets
      await page.click('#tweet-block > nav:nth-child(1) > a');
      await page.waitFor(2000);
    }

    jsonfile.writeFileSync(__dirname + '/../notes/tweets.json', tweets);

  }

}
