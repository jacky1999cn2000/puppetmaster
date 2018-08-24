'use strict';

const youlikehits = require('../services/youlikehits');
const youlikehitsTwitter = require('../services/youlikehitsTwitter');
const logger = require('../services/logger');

module.exports = {

  follow: async (page, browser, config) => {

    logger.log('twitter:follow');

    // run follow automation for 5 loops (to avoid rate limit), and break if points below 3
    for (let i = 0; i < 5; i++) {
      let status = await youlikehitsTwitter.follow(page, browser, config);
      if (!status) {
        logger.log('break twitter:follow');
        break;
      }
    }

  },

  like: async (page, browser, config) => {

    logger.log('twitter:like');

    // run follow automation for 5 loops (to avoid rate limit), and break if points below 3
    for (let i = 0; i < 5; i++) {
      let status = await youlikehitsTwitter.like(page, browser, config);
      if (!status) {
        logger.log('break twitter:like');
        break;
      }
    }

  }

}
