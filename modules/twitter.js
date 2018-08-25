'use strict';

const youlikehits = require('../services/youlikehits');
const youlikehitsTwitter = require('../services/youlikehitsTwitter');
const logger = require('../services/logger');
const manager = require('../services/manager');

module.exports = {

  follow: async (page, browser, config) => {

    logger.log('twitter:follow');

    // run follow automation for 5 loops (to avoid rate limit), and break if points below 2
    let counter = config.twitter_follow_counter;

    while (counter > 0) {

      counter--;
      config.twitter_follow_counter = counter;
      manager.save(config);
      console.log('counter', counter);

      let status = await youlikehitsTwitter.follow(page, browser, config);
      if (!status) {
        logger.log('break twitter:follow');
        break;
      }

    }

    config.twitter_follow_counter = 5;
    config.twitter_follow_done = true;
    manager.save(config);

  },

  like: async (page, browser, config) => {

    logger.log('twitter:like');

    // run follow automation for 5 loops (don't need to watch points since we can't like more than 15 posts per hour)
    let counter = config.twitter_like_counter;

    while (counter > 0) {

      counter--;
      config.twitter_like_counter = counter;
      manager.save(config);
      console.log('counter', counter);

      let status = await youlikehitsTwitter.like(page, browser, config);
      if (!status) {
        logger.log('break twitter:like');
        break;
      }

    }

    config.twitter_like_counter = 2;
    config.twitter_like_done = true;
    manager.save(config);

  }

}
