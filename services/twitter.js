'use strict';

const _ = require('lodash');
const jsonfile = require('jsonfile');
const utils = require('./utils');

let tweets = require('../notes/tweets.json');

module.exports = {

  login: async (page, browser, config) => {

    utils.log('twitter:login', 2);

    await page.goto(config.twitter_url, {
      waituntil: "networkidle0"
    });
    await page.click('#doc > div > div.StaticLoggedOutHomePage-content > div.StaticLoggedOutHomePage-cell.StaticLoggedOutHomePage-utilityBlock > div.StaticLoggedOutHomePage-signupBlock > div.StaticLoggedOutHomePage-signupHeader > a');
    await page.waitFor(500);
    await page.type('#page-container > div > div.signin-wrapper > form > fieldset > div:nth-child(2) > input', config['youlikehits_user' + config.whichyoulikehitsuser]['twitter_username' + config['youlikehits_user' + config.whichyoulikehitsuser].whichtwitteruser], {
      delay: 20
    });
    await page.type('#page-container > div > div.signin-wrapper > form > fieldset > div:nth-child(3) > input', config['youlikehits_user' + config.whichyoulikehitsuser]['twitter_password'], {
      delay: 20
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

  },

  prepare: async (page, browser, config) => {

    utils.log('twitter:prepare', 2);

    await page.goto(config.twitter_url, {
      waituntil: "networkidle0"
    });
    await page.click('#doc > div > div.StaticLoggedOutHomePage-content > div.StaticLoggedOutHomePage-cell.StaticLoggedOutHomePage-utilityBlock > div.StaticLoggedOutHomePage-signupBlock > div.StaticLoggedOutHomePage-signupHeader > a');
    await page.waitFor(500);
    await page.type('#page-container > div > div.signin-wrapper > form > fieldset > div:nth-child(2) > input', config['youlikehits_user' + config.whichyoulikehitsuser]['twitter_username' + config['youlikehits_user' + config.whichyoulikehitsuser].whichtwitteruser], {
      delay: 20
    });
    await page.type('#page-container > div > div.signin-wrapper > form > fieldset > div:nth-child(3) > input', config['youlikehits_user' + config.whichyoulikehitsuser]['twitter_password'], {
      delay: 20
    });
    await page.click('#page-container > div > div.signin-wrapper > form > div.clearfix > button');
    await page.waitFor(2000);

    // see if account was temporariely blocked by detecting the existence of the "start" button
    const startButtons = await page.evaluate(
      () => [...document.querySelectorAll('body > div.PageContainer > div > form > input.Button.EdgeButton.EdgeButton--primary')]
    );

    if (startButtons.length != 0) {
      return false;
    }

    try {
      // post tweet
      await page.waitFor(500);
      await page.click('#tweet-box-home-timeline');
      await page.waitFor(500);

      let tweet = tweets.shift();
      await page.type('#tweet-box-home-timeline', tweet, {
        delay: 20
      });

      await page.click('#timeline > div.timeline-tweet-box > div > form > div.TweetBoxToolbar > div.TweetBoxToolbar-tweetButton.tweet-button > button');
      await page.waitFor(2000);

      // delete followers
      await page.click('#page-container > div.dashboard.dashboard-left > div.DashboardProfileCard.module > div > div.ProfileCardStats > ul > li:nth-child(2) > a');
      await page.waitFor(2000);

      const streamItemUserIds = await page.evaluate(
        () => [...document.querySelectorAll('.js-stream-item')]
        .map(element => element.getAttribute('id'))
      );

      const randomInt = utils.getRandomInt(5) + 3; // 3-7

      for (let i = 0; i < streamItemUserIds.length; i++) {

        if (i == randomInt) {
          break;
        }

        // based on id, get unfollow button
        let unFollowButton = '#' + streamItemUserIds[i] + ' > div > div > div.ProfileCard-actions > div > div > div > span.user-actions-follow-button.js-follow-btn.follow-button > button.EdgeButton.EdgeButton--primary.EdgeButton--small.button-text.following-text';
        await page.click(unFollowButton);
        await page.waitFor(500);
      }
      await page.waitFor(2000);

    } catch (e) {
      // console.log(e.name);
      // console.log(e.message);
      process.exit(1);
    }

    // save tweets back to file
    jsonfile.writeFileSync(__dirname + '/../notes/tweets.json', tweets);

    return true;

  },

}
