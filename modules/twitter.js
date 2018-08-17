'use strict';

const _ = require('lodash');
const logger = require('../services/logger');
const youlikehits = require('../services/youlikehits');
const twitter = require('../services/twitter');
const parser = require('../services/parser');



module.exports = async (page, browser, config) => {


  await twitter.login(page, browser, config, 2);

  await youlikehits.login(page, browser, config);

  for (let i = 0; i < 5; i++) {
    await youlikehits.follow(page, browser, config);
  }


}
