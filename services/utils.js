'use strict';

module.exports = {

  log: (content, indentation) => {
    console.log('\r');

    let spaces = '';

    if (typeof indentation == 'undefined') {
      indentation = 0;
    }

    for (let i = 0; i < indentation; i++) {
      spaces += ' ';
    }

    console.log(spaces + '*** ' + content + ' ***');

  }

}
