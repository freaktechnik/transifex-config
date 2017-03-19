/**
 * @module transifex-config/lib/load-config
 * @author Martin Giger
 * @license MIT
 */
"use strict";

var path = require("path");
var os = require("os");
var fs = require("mz/fs");
var parse = require("./parse-rc");

var TRANSIFEXRC = ".transifexrc",
    TXCONFIG = ".tx/config";

/**
 * Loads a file from the given path and returns its contents.
 *
 * @param {string} path - Path to the file to load.
 * @async
 * @returns {string} Contents of the file.
 * @throws The file could not be read.
 */
function loadConfig(path) {
    return fs.readFile(path, 'utf-8').then(function(content) {
        return parse(content);
    });
}

/**
 * Loads and parses the transifex client config.
 *
 * @param {string} basePath - Path the config is in.
 * @async
 * @returns {module:transifex-config~ParsedConfig} Parsed contents of the config.
 * @throws The config could not be read.
 */
exports.txconfig = function(basePath) {
    return loadConfig(path.join(basePath, TXCONFIG));
};
/**
 * Loads and parses the transifex login info.
 *
 * @param {string} basePath - Path the rc is in.
 * @param {string} [project] - Project the RC should contain.
 * @async
 * @returns {module:transifex-config~ParsedConfig} Parsed contents of the rc.
 * @throws The rc could not be read.
 */
exports.transifexrc = function(basePath, project) {
    return loadConfig(path.join(basePath, TRANSIFEXRC)).then(function(rc) {
        if((!project && Object.keys(rc).length > 0) || project in rc) {
            return rc;
        }
        else {
            return loadConfig(os.homedir(), TRANSIFEXRC).catch(function() {
                throw new Error("Couldn't load the transifexrc from the home directory. Loading was attempted, since the project's transifex RC is either empty or does not contain the requested project.");
            });
        }
    });
};
/**
 * File name of the config file from the base path.
 * @const
 * @readonly
 * @type {string}
 */
exports.TXCONFIG = TXCONFIG;
/**
 * File name of the rc file from the base path.
 * @const
 * @readonly
 * @type {string}
 */
exports.TRANSIFEXRC = TRANSIFEXRC;
