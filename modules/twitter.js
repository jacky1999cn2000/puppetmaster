'use strict';

const youlikehits = require('../services/youlikehits');
const youlikehitsTwitter = require('../services/youlikehitsTwitter');
const logger = require('../services/logger');
const manager = require('../services/manager');

module.exports = {

  follow: async (page, browser, config) => {

    logger.log('twitter:follow');

    // run follow automation for 5 loops (to avoid rate limit), and break if points below 3
    let counter = config.counter;

    while (counter > 0) {

      counter--;
      config.counter = counter;
      manager.save(config);
      console.log('counter', counter);

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
    let counter = config.counter;

    while (counter > 0) {

      counter--;
      config.counter = counter;
      manager.save(config);

      let status = await youlikehitsTwitter.like(page, browser, config);
      if (!status) {
        logger.log('break twitter:like');
        break;
      }

    }

  }

}
