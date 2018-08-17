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

  follow: async (page, browser, config) => {

    logger.log('youlikehits : follow');

    await page.goto(config.youlikehits_twitter_followers);
    await page.waitFor(500);

    const followpIds = await page.evaluate(
      () => [...document.querySelectorAll('.followp')]
      .map(element => element.getAttribute('id'))
    );

    const followIds = await page.evaluate(
      () => [...document.querySelectorAll('.follow')]
      .map(element => element.getAttribute('id'))
    );

    const ids = followpIds.concat(followIds);

    console.log('ids ',ids.length);

    for (let i = 0; i < ids.length; i++) {

      console.log('i ',i);
      console.log('id ', ids[i]);

      let followButton = '#' + ids[i] + ' > center > center > a:nth-child(1)';
      let confirmButton = '#' + ids[i] + ' > center > center > a:nth-child(2)';

      let twitterpage = null;
      let decision = 'RESET';
      let state = 'RESET';

      await page.click(followButton);

      browser.on('targetcreated', async target => {

        if (target.url() !== 'about:blank') {

          await logger.log(`following: ${target.url()}`, 1);

          try {
            twitterpage = await target.page();
            await twitterpage.waitFor("#follow_btn_form > button", {
              timeout: 1000
            });
            // await page.waitFor(4000);
            await twitterpage.click('#follow_btn_form > button');
            // await twitterpage.waitFor('form.unfollow > button',{
            //   timeout: 1000
            // });
            await twitterpage.waitFor(1000);
            decision = 'CONFIRM';
            state = 'CONTINUE';
            await twitterpage.close();
          } catch (e) {
            // console.log('error ', e);
            console.log('error');
            console.log('\rname', e.name);
            console.log('\rmessage',e.message);
            if(e.message.indexOf('of null') != -1){
              state = 'EXIT';
            }
            decision = 'SKIP';
            await twitterpage.close();
          }

        }

      });

      await page.waitFor(2000);

      if (decision == 'CONFIRM') {
        console.log(decision);
        console.log(state);
        await page.click(confirmButton);
        await page.waitFor(6000);
      } else {
        console.log(decision);
        console.log(state);
        let skipLink = '#' + ids[i] + ' > center > font > a';
        await page.click(skipLink);
        await page.waitFor(4000);
        if(state == 'EXIT'){
          console.log('exit...');
          process.exit(1);
        }
      }


    }

  }

}
