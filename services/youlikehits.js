'use strict';

const _ = require('lodash');
const logger = require('./logger');

module.exports = {

  login: async (page, browser, config) => {

    logger.log('youlikehits:login', 2);

    await page.goto(config.youlikehits_url);
    await page.waitFor(500);
    await page.type('input#username', config.youlikehits_username);
    await page.type('input#password', config.youlikehits_password);
    await page.click('#bodybg > table.mainbody > tbody > tr > td > table:nth-child(1) > tbody > tr > td > table > tbody > tr > td:nth-child(2) > table.maintable > tbody > tr:nth-child(2) > td > center > table > tbody > tr:nth-child(3) > td > input[type="submit"]');
    await page.waitFor(500);
  },

  twitterfollow: async (page, browser, config) => {

    logger.log('youlikehits:twitterfollow', 2);

    // go to twitter follower link
    await page.goto(config.youlikehits_twitter_followers);
    await page.waitFor(500);

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

    // console.log('ids ', ids.length);

    // similarly, get all points for each link
    const followpPoints = await page.evaluate(
      () => [...document.querySelectorAll('.followp > center')]
      .map(element => parseInt(element.innerText.split(':')[1]))
    );

    const followPoints = await page.evaluate(
      () => [...document.querySelectorAll('.follow > center')]
      .map(element => parseInt(element.innerText.split(':')[1]))
    );

    const points = followpPoints.concat(followPoints);

    // console.log('points ', points.length);

    for (let i = 0; i < ids.length; i++) {

      // console.log('i ', i);
      // console.log('id ', ids[i]);
      // console.log('point ', points[i]);

      if (points[i] < 3) {
        return false;
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

          await logger.log(`following: ${target.url()}`, 1);

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
            if (e.message.indexOf('of null') != -1) {
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

      console.log(decision);
      console.log(state);

      if (decision == 'CONFIRM') {

        await page.click(confirmButton);
        await page.waitFor(6000);

      } else {

        let skipLink = '#' + ids[i] + ' > center > font > a';
        await page.click(skipLink);
        await page.waitFor(4000);

        if (state == 'EXIT') {
          console.log('exit...');
          process.exit(1);
        }

      }

    } // for loop

    return true;

  }, // twitterfollow method

  twitterlike: async (page, browser, config) => {

    logger.log('youlikehits:twitterlike', 2);

    // go to twitter tweets link
    await page.goto(config.youlikehits_twitter_likes, {
      waituntil: "networkidle0"
    });

    const cardIds = await page.evaluate(
      () => [...document.querySelectorAll('.cards')]
      .map(element => element.getAttribute('id'))
    );

    console.log('cardIds ', cardIds);

    const frames = await page.frames();

    const tweetframes = await frames.filter(frame => frame['_navigationURL'].indexOf('tweetrender') != -1);

    let likeButtons = [];
    let confirmButtons = [];

    for (let tweetframe of tweetframes) {
      let likeButton = await tweetframe.$('body > center > a:nth-child(1)');
      let confirmButton = await tweetframe.$('body > center > a:nth-child(2)');

      likeButtons.push(likeButton);
      confirmButtons.push(confirmButton);
    }

    console.log('likeButtons.length ', likeButtons.length);
    console.log('confirmButtons.length ', confirmButtons.length);

    for (let i = 0; i < cardIds.length; i++) {

      let twitterpage = null;
      let decision = 'RESET';
      let state = 'RESET';

      await likeButtons[i].click();

      browser.on('targetcreated', async target => {

        if (target.url() !== 'about:blank') {

          await logger.log(`tweeting: ${target.url()}`, 1);

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
            if (e.message.indexOf('of null') != -1) {
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

      console.log(decision);
      console.log(state);

      if (decision == 'CONFIRM') {

        await confirmButtons[i].click();
        await page.waitFor(6000);

      } else {

        let skipLink = '#' + cardIds[i] + ' > center > font > a:nth-child(1)';
        await page.click(skipLink);
        await page.waitFor(4000);

        if (state == 'EXIT') {
          console.log('exit...');
          process.exit(1);
        }

      }

    } // for loop

  } // twittertweet method

}
