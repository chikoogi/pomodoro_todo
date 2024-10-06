/*
 * https://flamingotiger.github.io/frontend/Testing/jest-image-error/
 * */

const path = require("path");

module.exports = {
  process(src, filename, config, options) {
    return `module.exports = ${JSON.stringify(path.basename(filename))};`;
  },
};
