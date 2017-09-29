/**
 * @module transifex-config/lib/load-config
 * @author Martin Giger
 * @license MIT
 */
"use strict";

const path = require("path"),
    os = require("os"),
    fs = require("mz/fs"),
    parse = require("./parse-rc"),
    TRANSIFEXRC = ".transifexrc",
    TXCONFIG = ".tx/config";

/**
 * Loads a file from the given path and returns its contents.
 *
 * @param {string} configPath - Path to the file to load.
 * @async
 * @returns {string} Contents of the file.
 * @throws The file could not be read.
 */
function loadConfig(configPath) {
    return fs.readFile(configPath, 'utf-8').then(parse);
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
 * Fixes the header names of the RC by re-assembling the host names instead of
 * each domain part being a subsection.
 *
 * @param {Object} rc - RC to normalize.
 * @returns {module:transifex-config~ParsedConfig} Normalized RC.
 */
function normalizeRC(rc) {
    let value;
    for(const s in rc) {
        const resourcePath = [ s ];
        let lastElement = s;
        value = rc;
        while(typeof value[lastElement] === "object") {
            value = value[lastElement];
            lastElement = Object.keys(value).pop();
            resourcePath.push(lastElement);
        }
        resourcePath.pop();
        delete rc[s];
        rc[resourcePath.join(".")] = value;
    }
    return rc;
}
/**
 * Loads and parses the transifex login info.
 *
 * @param {string} basePath - Path the rc is in.
 * @param {string} [service] - Service host the RC should contain.
 * @async
 * @returns {module:transifex-config~ParsedConfig} Parsed contents of the rc.
 * @throws The rc could not be read.
 */
exports.transifexrc = function(basePath, service) {
    return loadConfig(path.join(basePath, TRANSIFEXRC)).then((rc) => {
        rc = normalizeRC(rc);
        if((!service && Object.keys(rc).length) || service in rc) {
            return rc;
        }

        return loadConfig(path.join(os.homedir(), TRANSIFEXRC))
            .then(normalizeRC)
            .catch(() => {
                throw new Error("Couldn't load the transifexrc from the home directory. Loading was attempted, since the project's transifex RC is either empty or does not contain the requested project.");
            });
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
