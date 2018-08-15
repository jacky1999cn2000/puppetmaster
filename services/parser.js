'use strict';

const _ = require('lodash');
const cheerio = require('cheerio');
const logger = require('./logger');

module.exports = {

  parseTwitterFollowerLinks: (rawHTML) => {

    logger.log('parser : parseTwitterFollowerLinks', 1);

    let $ = cheerio.load(rawHTML);

    let twitterFollowURLs = [];

    let links = $('.followbutton').each((i, link) => {
      let value = $(link).attr('onclick');
      if (value.indexOf('window.open') != -1) {
        twitterFollowURLs.push(value.split('\',\'Twitter')[0].split('window.open(\'')[1]);
      }
    });

    return twitterFollowURLs;
  }

}
