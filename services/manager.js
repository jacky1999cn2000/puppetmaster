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

    config.twitter_follow_done = false;
    config.twitter_like_done = false;
    config.twitter_follow_counter = 1;
    config.twitter_like_counter = 1;
    config.whichtwitteruser = config.whichtwitteruser + 1 > config.twitter_user_max ? 1 : config.whichtwitteruser + 1;

    jsonfile.writeFileSync('./config.json', config);

    return config;
  }

}
