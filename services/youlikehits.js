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

    const ids = await page.evaluate(
      () => [...document.querySelectorAll('.follow')]
      .map(element => element.getAttribute('id'))
    );

    for (let i = 0; i < ids.length; i++) {

      let followButton = '#' + ids[i] + ' > center > center > a:nth-child(1)';
      let confirmButton = '#' + ids[i] + ' > center > center > a:nth-child(2)';

      await page.click(followButton);

      browser.on('targetcreated', async target => {
        if (target.url() !== 'about:blank') {
          logger.log(`following: ${target.url()}`, 1);
          try {
            const twitterpage = await target.page();
            await twitterpage.waitFor(500);
            await twitterpage.click('#follow_btn_form > button');
            await twitterpage.waitFor(500);
            await twitterpage.close();
          } catch (e) {}
        }
      });

      await page.waitFor(2000);
      await page.click(confirmButton);
      await page.waitFor(4000);
    }

  }

}
