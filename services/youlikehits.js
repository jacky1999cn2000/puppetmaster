'use strict';

const _ = require('lodash');
const logger = require('./logger');

module.exports = {

  login: async (page, browser, config) => {

    logger.log('youlikehits:login', 2);

    await page.goto(config.youlikehits_url, {
      waituntil: "networkidle0"
    });
    await page.type('input#username', config.youlikehits_username);
    await page.type('input#password', config.youlikehits_password);
    await page.click('#bodybg > table.mainbody > tbody > tr > td > table:nth-child(1) > tbody > tr > td > table > tbody > tr > td:nth-child(2) > table.maintable > tbody > tr:nth-child(2) > td > center > table > tbody > tr:nth-child(3) > td > input[type="submit"]');
    await page.waitFor(500);
  },

  switchTwitterUser: async (page, browser, config) => {

    logger.log('youlikehits:switchTwitterUser', 2);

    await page.goto(config.youlikehits_twitter_users, {
      waituntil: "networkidle0"
    });

    const cardIds = await page.evaluate(
      () => [...document.querySelectorAll('.cards')]
      .map(element => element.getAttribute('id'))
    );

    const cardTexts = await page.evaluate(
      () => [...document.querySelectorAll('.cards')]
      .map(element => element.innerText.split('\n')[0])
    );

    console.log('cardIds ', cardIds);
    console.log('cardTexts ', cardTexts);
  }

}
