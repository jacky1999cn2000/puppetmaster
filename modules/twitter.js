'use strict';

const youlikehits = require('../services/youlikehits');
const youlikehitsTwitter = require('../services/youlikehitsTwitter');
const logger = require('../services/logger');
const manager = require('../services/manager');

module.exports = {

  follow: async (page, browser, config) => {

    logger.log('twitter:follow');

    // run follow automation for 5 loops (to avoid rate limit), and break if points below 2
    let counter = config['youlikehits_user' + config.whichyoulikehitsuser].twitter_follow_counter;

    while (counter > 0) {

      counter--;
      config['youlikehits_user' + config.whichyoulikehitsuser].twitter_follow_counter = counter;
      manager.save(config);

      let status = await youlikehitsTwitter.follow(page, browser, config);
      if (!status) {
        logger.log('break twitter:follow');
        break;
      }

    }

    config['youlikehits_user' + config.whichyoulikehitsuser].twitter_follow_done = true;
    manager.save(config);

  },

  like: async (page, browser, config) => {

    logger.log('twitter:like');

    // run follow automation for 2 loops (it is likely that this function would break immediately if we already liked 15 posts in past hour)
    let counter = config['youlikehits_user' + config.whichyoulikehitsuser].twitter_like_counter;

    while (counter > 0) {

      counter--;
      config['youlikehits_user' + config.whichyoulikehitsuser].twitter_like_counter = counter;
      manager.save(config);

      let status = await youlikehitsTwitter.like(page, browser, config);
      if (!status) {
        logger.log('break twitter:like');
        break;
      }

    }

    config['youlikehits_user' + config.whichyoulikehitsuser].twitter_like_done = true;
    manager.save(config);

  },

  retweet: async (page, browser, config) => {

    logger.log('twitter:retweet');

    // run follow automation for 2 loops
    let counter = config['youlikehits_user' + config.whichyoulikehitsuser].twitter_retweet_counter;

    while (counter > 0) {

      counter--;
      config['youlikehits_user' + config.whichyoulikehitsuser].twitter_retweet_counter = counter;
      manager.save(config);

      let status = await youlikehitsTwitter.retweet(page, browser, config);
      if (!status) {
        logger.log('break twitter:retweet');
        break;
      }

    }

    config['youlikehits_user' + config.whichyoulikehitsuser].twitter_retweet_done = true;
    manager.save(config);

  }

}
