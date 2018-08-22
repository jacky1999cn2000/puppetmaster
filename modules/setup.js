'use strict';

const youlikehits = require('../services/youlikehits');
const twitter = require('../services/twitter');
const logger = require('../services/logger');

module.exports = {

  init: async (page, browser, config) => {

    logger.log('setup:init');

    await twitter.login(page, browser, config);

    await youlikehits.login(page, browser, config);

  }

}
