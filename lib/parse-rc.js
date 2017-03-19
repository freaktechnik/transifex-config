/**
 * @author Martin Giger
 * @license MIT
 */
"use strict";

var ini = require("ini");

/**
 * Parse a transifex client configuration file. Looks at the file line by line.
 *
 * @param {string} content - Configuration file contents.
 * @returns {module:transifex-config~ParsedConfig} Configuration file
 *          represented as an object.
 * @exports transifex-config/lib/parse-rc
 */
module.exports = function(content) {
    return ini.parse(content);
};
