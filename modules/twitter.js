'use strict';

const youlikehits = require('../services/youlikehits');
const youlikehitsTwitter = require('../services/youlikehitsTwitter');
const utils = require('../services/utils');
const manager = require('../services/manager');

module.exports = {

  operate: async (page, browser, config) => {

    utils.log('twitter:operate');

    let healthy = await manager.getvalue(config, 'twitter', 'healthy');

    if (!healthy) {
      return;
    }

    // earn points
    await youlikehitsTwitter.follow(page, browser, config);
    // await youlikehitsTwitter.like(page, browser, config);
    // await youlikehitsTwitter.retweet(page, browser, config);

    config['youlikehits_user' + config.whichyoulikehitsuser].twitter_operation_done = true;
    manager.save(config);

  }

}
