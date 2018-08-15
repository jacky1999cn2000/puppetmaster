'use strict';

const _ = require('lodash');
const logger = require('../services/logger');
const youlikehits = require('../services/youlikehits');
const twitter = require('../services/twitter');
const parser = require('../services/parser');



module.exports = async (page, browser, config) => {


  await twitter.login(page, browser, config);

  await youlikehits.login(page, browser, config);

  let twitterFollowerURLs = await youlikehits.getTwitterFollowerURLs(page, browser, config);

  console.log('twitterFollowerURLs ', twitterFollowerURLs);
  // let twitterFollowURLs = await youlikehits.getTwitterFollowURLs(browser, config);

  // twitter.login(browser, config);

  // let listPageHTML = await nightmare
  //   .goto(twitterFollowURLs[0])
  //   .wait('body');

}
