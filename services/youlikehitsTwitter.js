'use strict';

const _ = require('lodash');
const logger = require('./logger');

module.exports = {

  follow: async (page, browser, config) => {

    logger.log('youlikehitsTwitter:follow', 2);

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

    for (let i = 0; i < ids.length; i++) {

      if (typeof points[i] != 'undefined' && points[i] < 2) {
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

          // await logger.log(`following: ${target.url()}`, 1);

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
          process.exit(1);
        }

      }

    } // for loop

    return true;

  }, // follow method

  like: async (page, browser, config) => {

    logger.log('youlikehitsTwitter:like', 2);

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

    // don't need to get points since we can only make 15 likes per hour, so simply return if the page not has likes
    if (ids.length == 0) {
      return false;
    }

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

      let twitterpage = null;
      let decision = 'RESET';
      let state = 'RESET';

      // click like button, and capture the pop up new window
      await likeButtons[i].click();

      browser.on('targetcreated', async target => {

        if (target.url() !== 'about:blank') {

          // await logger.log(`liking: ${target.url()}`, 1);

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
          process.exit(1);
        }

      }

    } // for loop

    return true;

  } // like method

}
