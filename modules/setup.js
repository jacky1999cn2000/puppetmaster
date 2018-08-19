'use strict';

const youlikehits = require('../services/youlikehits');
const twitter = require('../services/twitter');

module.exports = async (page, browser, config) => {

  await twitter.login(page, browser, config);

  await youlikehits.login(page, browser, config);

}
