'use strict';

const _ = require('lodash');
const logger = require('./logger');
const jsonfile = require('jsonfile');

module.exports = {

  save: (config) => {

    logger.log('manager:save', 2);

    jsonfile.writeFileSync('./config.json', config);
  },

  next: (config) => {

  }

}
