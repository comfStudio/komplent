const path = require('path');

module.exports = {
  process(src, filename, config, options) {
    let needleRegExp = /\?/
    let replaceRegExp = /\?.*/

    let r = JSON.stringify(path.basename(filename))

    if (needleRegExp.test(filename)) {
        r = filename.replace(replaceRegExp, '')
      }
      
    return 'module.exports = ' + r;
  },
};