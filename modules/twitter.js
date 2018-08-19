'use strict';

const youlikehits = require('../services/youlikehits');

module.exports = async (page, browser, config) => {

  // for (let i = 0; i < 5; i++) {
  //   let status = await youlikehits.follow(page, browser, config);
  //   console.log('status ', status);
  //   if (status == 'break') {
  //     break;
  //   }
  // }
  //
  let counter = 0;

  while (counter < 30) {
    counter += await youlikehits.follow(page, browser, config);
    console.log('counter ', counter);
  }

  console.log('done');

}
