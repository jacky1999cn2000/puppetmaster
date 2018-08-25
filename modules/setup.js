'use strict';

const youlikehits = require('../services/youlikehits');
const twitter = require('../services/twitter');
const logger = require('../services/logger');
const manager = require('../services/manager');

module.exports = {

  init: async (page, browser, config) => {

    logger.log('setup:init');

    await twitter.login(page, browser, config);

    await youlikehits.login(page, browser, config);

  },

  reset: async (page, browser, config) => {

    logger.log('setup:reset');

    config = await manager.next(config);

    console.log('config ', config);

    await youlikehits.switchTwitterUser(page, browser, config);

    process.exit(0);
  }

}
