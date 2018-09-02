'use strict';

const youlikehits = require('../services/youlikehits');
const twitter = require('../services/twitter');
const utils = require('../services/utils');
const manager = require('../services/manager');

module.exports = {

  init: async (page, browser, config) => {

    utils.log('setup:init');

    await twitter.login(page, browser, config);

    await youlikehits.login(page, browser, config);

    await youlikehits.addTwitterUser(page, browser, config);

  },

  reset: async (page, browser, config) => {

    utils.log('setup:reset');

    await youlikehits.removeTwitterUser(page, browser, config);

    config = await manager.next(config);

    if (config.changeyoulikehitsuser) {
      utils.log('change youlikehits user ', 2);
      config.changeyoulikehitsuser = false;
      config.whichyoulikehitsuser = config.whichyoulikehitsuser + 1 > config.youlikehits_user_max ? 1 : config.whichyoulikehitsuser + 1;
      manager.save(config);
    }

    process.exit(0);
  }

}
