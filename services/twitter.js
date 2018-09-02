'use strict';

const _ = require('lodash');
const utils = require('./utils');

module.exports = {

  login: async (page, browser, config) => {

    utils.log('twitter:login', 2);

    await page.goto(config.twitter_url, {
      waituntil: "networkidle0"
    });
    await page.click('#doc > div > div.StaticLoggedOutHomePage-content > div.StaticLoggedOutHomePage-cell.StaticLoggedOutHomePage-utilityBlock > div.StaticLoggedOutHomePage-signupBlock > div.StaticLoggedOutHomePage-signupHeader > a');
    await page.waitFor(500);
    await page.type('#page-container > div > div.signin-wrapper > form > fieldset > div:nth-child(2) > input', config['youlikehits_user' + config.whichyoulikehitsuser]['twitter_username' + config['youlikehits_user' + config.whichyoulikehitsuser].whichtwitteruser], {
      delay: 80
    });
    await page.type('#page-container > div > div.signin-wrapper > form > fieldset > div:nth-child(3) > input', config['youlikehits_user' + config.whichyoulikehitsuser]['twitter_password'], {
      delay: 80
    });
    await page.click('#page-container > div > div.signin-wrapper > form > div.clearfix > button');
    await page.waitFor(2000);

    // see if account was temporariely blocked by detecting the existence of the "start" button
    const startButtons = await page.evaluate(
      () => [...document.querySelectorAll('body > div.PageContainer > div > form > input.Button.EdgeButton.EdgeButton--primary')]
    );

    if (startButtons.length != 0) {
      return false;
    } else {
      return true;
    }

  }

}
