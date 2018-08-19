'use strict';

const youlikehits = require('../services/youlikehits');

module.exports = async (page, browser, config) => {

  // run follow automation for 5 loops (avoid rate limit), and break if points below 3
  for (let i = 0; i < 5; i++) {
    let status = await youlikehits.follow(page, browser, config);
    if (!status) {
      break;
    }
  }

  console.log('outside');

}
