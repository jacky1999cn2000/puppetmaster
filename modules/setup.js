'use strict';

const youlikehits = require('../services/youlikehits');
const twitter = require('../services/twitter');
const utils = require('../services/utils');
const manager = require('../services/manager');

module.exports = {

  init: async (page, browser, config) => {

    utils.log('setup:init');

    let healthy = await twitter.login(page, browser, config);
    config = await manager.update(config, 'twitter', 'healthy', healthy);

    // if account is blocked, don't need to proceed
    if (healthy) {
      await youlikehits.login(page, browser, config);
      await youlikehits.addTwitterUser(page, browser, config);
    }

  },

  reset: async (page, browser, config) => {

    utils.log('setup:reset');

    let healthy = await manager.getvalue(config, 'twitter', 'healthy');

    // if account is blocked, don't need to do this
    if (healthy) {
      await youlikehits.removeTwitterUser(page, browser, config);
    }

    config = await manager.next(config);

    if (config.changeyoulikehitsuser) {
      config = await manager.changeyoulikehitsuser(config);
    }

    process.exit(0);
  }

}
