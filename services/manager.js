'use strict';

const _ = require('lodash');
const utils = require('./utils');
const jsonfile = require('jsonfile');

module.exports = {

  save: (config) => {

    utils.log('manager:save', 2);

    jsonfile.writeFileSync('./config.json', config);

    return config;
  },

  next: (config) => {

    utils.log('manager:next', 2);

    console.log('whichyoulikehitsuser ', config.whichyoulikehitsuser);
    console.log('whichtwitteruser ', config['youlikehits_user' + config.whichyoulikehitsuser].whichtwitteruser);

    // set up current youlikehitsuser's settings
    config['youlikehits_user' + config.whichyoulikehitsuser].twitter_operation_done = false;

    // if current youlikehitsuser's next twitteruser is bigger than max, meaning the current youlikehitsuser already iterate all its twitter users, so it's time to try a different youlikehitsuser
    if (config['youlikehits_user' + config.whichyoulikehitsuser].whichtwitteruser + 1 > config['youlikehits_user' + config.whichyoulikehitsuser].twitter_user_max) {
      config.changeyoulikehitsuser = true;
    }

    config['youlikehits_user' + config.whichyoulikehitsuser].whichtwitteruser = config['youlikehits_user' + config.whichyoulikehitsuser].whichtwitteruser + 1 > config['youlikehits_user' + config.whichyoulikehitsuser].twitter_user_max ? 1 : config['youlikehits_user' + config.whichyoulikehitsuser].whichtwitteruser + 1;

    jsonfile.writeFileSync('./config.json', config);

    return config;
  },

  update: (config, type, subtype, value) => {

    utils.log('manager:update', 2);

    config['youlikehits_user' + config.whichyoulikehitsuser][type + '_' + subtype + config['youlikehits_user' + config.whichyoulikehitsuser].whichtwitteruser] = value;

    jsonfile.writeFileSync('./config.json', config);

    return config;

  },

  changeyoulikehitsuser: (config) => {

    utils.log('manager:change youlikehits user ', 2);

    config.changeyoulikehitsuser = false;
    config.whichyoulikehitsuser = config.whichyoulikehitsuser + 1 > config.youlikehits_user_max ? 1 : config.whichyoulikehitsuser + 1;

    jsonfile.writeFileSync('./config.json', config);

    return config;
  },

  getvalue: (config, type, subtype) => {

    utils.log('manager:getvalue', 2);

    return config['youlikehits_user' + config.whichyoulikehitsuser][type + '_' + subtype + config['youlikehits_user' + config.whichyoulikehitsuser].whichtwitteruser];

  }

}
