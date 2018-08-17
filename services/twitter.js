'use strict';

const _ = require('lodash');
const logger = require('./logger');

module.exports = {

  login: async (page, browser, config, whichuser) => {

    logger.log('twitter : login');

    await page.goto(config.twitter_url);
    await page.waitFor(500);
    await page.click('#doc > div > div.StaticLoggedOutHomePage-content > div.StaticLoggedOutHomePage-cell.StaticLoggedOutHomePage-utilityBlock > div.StaticLoggedOutHomePage-signupBlock > div.StaticLoggedOutHomePage-signupHeader > a');
    await page.waitFor(500);
    await page.type('#page-container > div > div.signin-wrapper > form > fieldset > div:nth-child(2) > input', config['twitter_username' + whichuser]);
    await page.type('#page-container > div > div.signin-wrapper > form > fieldset > div:nth-child(3) > input', config['twitter_password' + whichuser]);
    await page.click('#page-container > div > div.signin-wrapper > form > div.clearfix > button');
    await page.waitFor(500);

  }

}
