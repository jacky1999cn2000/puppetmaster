'use strict';

const youlikehits = require('../services/youlikehits');

module.exports = async (page, browser, config) => {

  for (let i = 0; i < 5; i++) {
    let status = await youlikehits.follow(page, browser, config);
    if (!status) {
      break;
    }
  }

  console.log('outside');

}
