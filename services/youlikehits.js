'use strict';

const _ = require('lodash');
const logger = require('./logger');
const parser = require('./parser');

module.exports = {

  login: async (page, browser, config) => {

    logger.log('youlikehits : login');

    await page.goto(config.youlikehits_url);
    await page.waitFor(500);
    await page.type('input#username', config.youlikehits_username);
    await page.type('input#password', config.youlikehits_password);
    await page.click('#bodybg > table.mainbody > tbody > tr > td > table:nth-child(1) > tbody > tr > td > table > tbody > tr > td:nth-child(2) > table.maintable > tbody > tr:nth-child(2) > td > center > table > tbody > tr:nth-child(3) > td > input[type="submit"]');
    await page.waitFor(500);
  },

  getTwitterFollowerURLs: async (page, browser, config) => {

    logger.log('youlikehits : getTwitterFollowerURLs');

    await page.goto(config.youlikehits_twitter_followers);
    await page.waitFor(500);
    let bodyHTML = await page.evaluate(() => document.body.innerHTML);

    return parser.parseTwitterFollowerLinks(bodyHTML);

  }

}
