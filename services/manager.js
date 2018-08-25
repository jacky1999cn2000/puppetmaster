'use strict';

const _ = require('lodash');
const logger = require('./logger');
const jsonfile = require('jsonfile');

module.exports = {

  save: (config) => {

    logger.log('manager:save', 2);

    jsonfile.writeFileSync('./config.json', config);

    return config;
  },

  next: (config) => {

    logger.log('manager:next', 2);

    console.log('whichyoulikehitsuser ', config.whichyoulikehitsuser);
    console.log('whichtwitteruser ', config['youlikehits_user' + config.whichyoulikehitsuser].whichtwitteruser);

    // set up current youlikehitsuser's settings
    config['youlikehits_user' + config.whichyoulikehitsuser].twitter_follow_done = false;
    config['youlikehits_user' + config.whichyoulikehitsuser].twitter_like_done = false;
    config['youlikehits_user' + config.whichyoulikehitsuser].twitter_retweet_done = false;
    config['youlikehits_user' + config.whichyoulikehitsuser].twitter_follow_counter = 1;
    config['youlikehits_user' + config.whichyoulikehitsuser].twitter_like_counter = 1;
    config['youlikehits_user' + config.whichyoulikehitsuser].twitter_retweet_counter = 1;

    // if current youlikehitsuser's next twitteruser is bigger than max, meaning the current youlikehitsuser already iterate all its twitter users, so it's time to try a different youlikehitsuser
    if (config['youlikehits_user' + config.whichyoulikehitsuser].whichtwitteruser + 1 > config['youlikehits_user' + config.whichyoulikehitsuser].twitter_user_max) {
      config.changeyoulikehitsuser = true;
    }

    config['youlikehits_user' + config.whichyoulikehitsuser].whichtwitteruser = config['youlikehits_user' + config.whichyoulikehitsuser].whichtwitteruser + 1 > config['youlikehits_user' + config.whichyoulikehitsuser].twitter_user_max ? 1 : config['youlikehits_user' + config.whichyoulikehitsuser].whichtwitteruser + 1;

    jsonfile.writeFileSync('./config.json', config);

    return config;
  }

}
