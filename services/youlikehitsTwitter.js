'use strict';

const _ = require('lodash');
const utils = require('./utils');
const manager = require('./manager');

module.exports = {

  follow: async (page, browser, config) => {

    utils.log('youlikehitsTwitter:follow', 2);

    // go to twitter follower link
    await page.goto(config.youlikehits_twitter_followers, {
      waituntil: "networkidle0"
    });

    // for some reason, there are 2 kinds of follow links (.followp and .follow), so we query both and combine them together
    const followpIds = await page.evaluate(
      () => [...document.querySelectorAll('.followp')]
      .map(element => element.getAttribute('id'))
    );

    const followIds = await page.evaluate(
      () => [...document.querySelectorAll('.follow')]
      .map(element => element.getAttribute('id'))
    );

    const ids = followpIds.concat(followIds);

    // simply return if the page has no follows
    if (ids.length == 0) {
      return;
    }

    const randomInt = utils.getRandomInt(5) + 3; // 3-7

    for (let i = 0; i < ids.length; i++) {

      if (i == randomInt) {
        break;
      }

      // based on id, get follow/confirm button
      let followButton = '#' + ids[i] + ' > center > center > a:nth-child(1)';
      let confirmButton = '#' + ids[i] + ' > center > center > a:nth-child(2)';

      let twitterpage = null;
      let decision = 'RESET';
      let state = 'RESET';

      // click follow button, and capture the pop up new window
      await page.click(followButton);

      browser.on('targetcreated', async target => {

        if (target.url() !== 'about:blank') {

          // await utils.log(`following: ${target.url()}`, 1);

          try {
            twitterpage = await target.page();
            await twitterpage.waitFor("#follow_btn_form > button", {
              timeout: 1000
            });

            await twitterpage.click('#follow_btn_form > button');
            await twitterpage.waitFor(1000);

            decision = 'CONFIRM';
            state = 'CONTINUE';

            await twitterpage.close();
          } catch (e) {
            // console.log(e.name);
            // console.log(e.message);

            // for "of null" error, we need to skip the item, and then restart the process;
            // for "timeout" error, we need to skip the item, and continue
            // otherwise, confirm and continue
            if (e.message.indexOf('\'close\' of null') != -1) {
              decision = 'SKIP';
              state = 'EXIT';
            } else if (e.message.indexOf('timeout') != -1) {
              decision = 'SKIP';
              state = 'CONTINUE';
            } else {
              decision = 'CONFIRM';
              state = 'CONTINUE';
            }
            await twitterpage.close();
          }

        }

      });

      await page.waitFor(2000);

      // console.log(decision);
      // console.log(state);

      if (decision == 'CONFIRM') {

        await page.click(confirmButton);
        await page.waitFor(6000);

      } else {

        let skipLink = '#' + ids[i] + ' > center > font > a';
        await page.click(skipLink);
        await page.waitFor(4000);

        if (state == 'EXIT') {
          console.log('exit...');
          config['youlikehits_user' + config.whichyoulikehitsuser].twitter_preparation_done = false;
          manager.save(config);
          process.exit(1);
        }

      }

    } // for loop

    return;

  }, // follow method

  like: async (page, browser, config) => {

    utils.log('youlikehitsTwitter:like', 2);

    // go to twitter likes link
    await page.goto(config.youlikehits_twitter_likes, {
      waituntil: "networkidle0"
    });

    // for some reason, there are 2 kinds of like links (.cardsp and .cards), so we query both and combine them together
    const cardpIds = await page.evaluate(
      () => [...document.querySelectorAll('.cardsp')]
      .map(element => element.getAttribute('id'))
    );

    const cardIds = await page.evaluate(
      () => [...document.querySelectorAll('.cards')]
      .map(element => element.getAttribute('id'))
    );

    const ids = cardpIds.concat(cardIds);

    // simply return if the page has no likes
    if (ids.length == 0) {
      return;
    }

    const randomInt = utils.getRandomInt(2) + 2; // 2-3

    // get all iframes on the page, and filter for 'like' iframes
    const frames = await page.frames();

    const likeframes = await frames.filter(frame => frame['_navigationURL'].indexOf('favtweetrender') != -1);

    // get like & confirm buttons for each iframe
    let likeButtons = [];
    let confirmButtons = [];

    for (let likeframe of likeframes) {
      let likeButton = await likeframe.$('body > center > a:nth-child(1)');
      let confirmButton = await likeframe.$('body > center > a:nth-child(2)');

      likeButtons.push(likeButton);
      confirmButtons.push(confirmButton);
    }

    for (let i = 0; i < ids.length; i++) {

      if (i == randomInt) {
        break;
      }

      let twitterpage = null;
      let decision = 'RESET';
      let state = 'RESET';

      // click like button, and capture the pop up new window
      await likeButtons[i].click();

      browser.on('targetcreated', async target => {

        if (target.url() !== 'about:blank') {

          // await utils.log(`liking: ${target.url()}`, 1);

          try {
            twitterpage = await target.page();
            await twitterpage.waitFor("#favorite_btn_form > fieldset > input", {
              timeout: 1000
            });

            await twitterpage.click('#favorite_btn_form > fieldset > input');
            await twitterpage.waitFor(1000);

            decision = 'CONFIRM';
            state = 'CONTINUE';

            await twitterpage.close();
          } catch (e) {
            // console.log(e.name);
            // console.log(e.message);

            // for "of null" error, we need to skip the item, and then restart the process;
            // for "timeout" error, we need to skip the item, and continue
            // otherwise, confirm and continue
            if (e.message.indexOf('\'close\' of null') != -1) {
              decision = 'SKIP';
              state = 'EXIT';
            } else if (e.message.indexOf('timeout') != -1) {
              decision = 'SKIP';
              state = 'CONTINUE';
            } else {
              decision = 'CONFIRM';
              state = 'CONTINUE';
            }
            await twitterpage.close();
          }

        }

      });

      await page.waitFor(2000);

      // console.log(decision);
      // console.log(state);

      if (decision == 'CONFIRM') {

        await confirmButtons[i].click();
        await page.waitFor(6000);

      } else {

        let skipLink = '#' + cardIds[i] + ' > center > font > a:nth-child(1)';
        await page.click(skipLink);
        await page.waitFor(4000);

        if (state == 'EXIT') {
          console.log('exit...');
          config['youlikehits_user' + config.whichyoulikehitsuser].twitter_preparation_done = false;
          manager.save(config);
          process.exit(1);
        }

      }

    } // for loop

    return;

  }, // like method

  retweet: async (page, browser, config) => {

    utils.log('youlikehitsTwitter:retweet', 2);

    // go to twitter retweets link
    await page.goto(config.youlikehits_twitter_retweets, {
      waituntil: "networkidle0"
    });

    // for some reason, there are 2 kinds of retweets links (.cardsp and .cards), so we query both and combine them together
    const cardpIds = await page.evaluate(
      () => [...document.querySelectorAll('.cardsp')]
      .map(element => element.getAttribute('id'))
    );

    const cardIds = await page.evaluate(
      () => [...document.querySelectorAll('.cards')]
      .map(element => element.getAttribute('id'))
    );

    const ids = cardpIds.concat(cardIds);

    // simply return if the page has no retweets
    if (ids.length == 0) {
      return;
    }

    const randomInt = utils.getRandomInt(3) + 2; // 2-4

    // get all iframes on the page, and filter for 'retweet' iframes
    const frames = await page.frames();

    const retweetframes = await frames.filter(frame => frame['_navigationURL'].indexOf('retweetrender') != -1);

    // get retweet & confirm buttons for each iframe
    let retweetButtons = [];
    let confirmButtons = [];

    for (let retweetframe of retweetframes) {
      let retweetButton = await retweetframe.$('body > center > a:nth-child(1)');
      let confirmButton = await retweetframe.$('body > center > a:nth-child(2)');

      retweetButtons.push(retweetButton);
      confirmButtons.push(confirmButton);
    }

    for (let i = 0; i < ids.length; i++) {

      if (i == randomInt) {
        break;
      }

      let twitterpage = null;
      let decision = 'RESET';
      let state = 'RESET';

      // click retweet button, and capture the pop up new window
      await retweetButtons[i].click();

      browser.on('targetcreated', async target => {

        if (target.url() !== 'about:blank') {

          // await utils.log(`retweeting: ${target.url()}`, 1);

          try {
            twitterpage = await target.page();
            await twitterpage.waitFor("#retweet_btn_form > fieldset > input", {
              timeout: 1000
            });

            await twitterpage.click('#retweet_btn_form > fieldset > input');
            await twitterpage.waitFor(1000);

            decision = 'CONFIRM';
            state = 'CONTINUE';

            await twitterpage.close();
          } catch (e) {
            // console.log(e.name);
            // console.log(e.message);

            // for "of null" error, we need to skip the item, and then restart the process;
            // for "timeout" error, we need to skip the item, and continue
            // otherwise, confirm and continue
            if (e.message.indexOf('\'close\' of null') != -1) {
              decision = 'SKIP';
              state = 'EXIT';
            } else if (e.message.indexOf('timeout') != -1) {
              decision = 'SKIP';
              state = 'CONTINUE';
            } else {
              decision = 'CONFIRM';
              state = 'CONTINUE';
            }
            await twitterpage.close();
          }

        }

      });

      await page.waitFor(2000);

      // console.log(decision);
      // console.log(state);

      if (decision == 'CONFIRM') {

        await confirmButtons[i].click();
        await page.waitFor(6000);

      } else {

        let skipLink = '#' + cardIds[i] + ' > center > font > a:nth-child(1)';
        await page.click(skipLink);
        await page.waitFor(4000);

        if (state == 'EXIT') {
          console.log('exit...');
          config['youlikehits_user' + config.whichyoulikehitsuser].twitter_preparation_done = false;
          manager.save(config);
          process.exit(1);
        }

      }

    } // for loop

    return;

  } // retweet method

}
