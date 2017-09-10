/**
 * @author Martin Giger
 * @license MIT
 */
"use strict";

const path = require("path"),
    fs = require("fs"),
    load = require("./lib/load-config"),
    parseLangMap = require("./lib/parse-langmap"),
    errors = require("./lib/errors"),
    matchResource = require("./lib/match-resource"),
    memoize = require("lodash.memoize");

/**
 * @class
 * @param {string} [basePath=require("app-root-path")] - Path the transifex configuration is in. Defaults
 *                              to the best guess of the package root.
 * @throws The .transifexrc or .tx/config can not be found.
 * @exports transifex-config
 */
function TransifexConfig(basePath = require("app-root-path")) {
    /**
     * Base path the config is read from
     * @type {string}
     */
    this.basePath = basePath;

    const R_OK = fs.R_OK || fs.constants.R_OK;
    fs.accessSync(path.join(this.basePath, load.TRANSIFEXRC), R_OK);
    fs.accessSync(path.join(this.basePath, load.TXCONFIG), R_OK);
}

/**
 * @typedef {Object.<string, string>} ConfigSection
 * Has a property for each key in the section, with trimmed name and value.
 */
/**
 * @typedef {Object.<string, module:transifex-config~ConfigSection>} ParsedConfig
 * Has a property for each section in the config. Each section has a property
 * named after the key with its value assigned.
 */
/**
 * @async
 * @returns {module:transifex-config~ParsedConfig} Parsed .tx/config as an
 *          object. Will be cached.
 * @throws The config could not be read.
 */
TransifexConfig.prototype.getConfig = function() {
    if(!this._txconfig) {
        this._txconfig = load.txconfig(this.basePath);
    }
    return this._txconfig;
};

/**
 * @async
 * @param {string} [service] - The config should contain this service URL.
 * @returns {module:transifex-config~ParsedConfig} Parsed .transifexrc as an
 *          object. Will be cached.
 * @throws The .transifexrc could not be read.
 * @this TransifexConfig
 */
function _getRC(service) {
    return load.transifexrc(this.basePath, service);
}
/**
 * Memoized version of {@link module:transifex-config~_getRC}.
 *
 * @augments module:transifex-config~_getRC
 */
TransifexConfig.prototype.getRC = memoize(_getRC);

/**
 * @async
 * @returns {Array.<module:transifex-config~ConfigSection>} Array of resources.
 * @throws The config could not be read.
 */
TransifexConfig.prototype.getResources = function() {
    return this.getConfig().then((config) => {
        const resources = [];
        for(const p in config) {
            if(p != "main") {
                const project = config[p];
                for(const c in project) {
                    resources.push(Object.assign({
                        project: p,
                        name: c
                    }, project[c]));
                }
            }
        }
        return resources;
    });
};

/**
 * @param {string} localPath - Absolute local path of the resource to return the
 *                             config entry of.
 * @param {boolean} [matchSourceLang] - If the resource should be returned
 *                                            when the path is for the source
 *                                            language of the resource.
 * @async
 * @returns {module:transifex-config~ConfigSection} Config section for the
 *          resource.
 * @throws {module:transifex-config/lib/errors.NoMatchingResourceError} There
 *         is no matching resource.
 * @throws The config could not be read.
 */
TransifexConfig.prototype.getResource = function(localPath, matchSourceLang) {
    return this.getResources().then((resources) => {
        let lang;
        const resource = resources.find((resource) => {
            const result = matchResource(this.basePath, localPath, resource);
            if(result) {
                lang = result;
                return true;
            }
            return false;
        });
        if(!resource) {
            throw new errors.NoMatchingResourceError(localPath);
        }
        else if(!matchSourceLang && resource.source_lang == lang) {
            throw new errors.MatchesSourceError(localPath);
        }
        resource.lang = lang;
        resource.source = lang === resource.source_lang;
        return resource;
    });
};

/**
 * Check if a resource is the source resource.
 *
 * @param {string} path - Path to check.
 * @async
 * @returns {boolean} If the resource is the source.
 * @throws The config could not be read.
 */
TransifexConfig.prototype.isSourceResource = function(path) {
    return this.getResources().then((resources) => {
        return resources.some((resource) => {
            return matchResource(this.basePath, path, resource) == resource.source_lang;
        });
    });
};

/**
 * @param {string} lang - Language code to map from local to external.
 * @param {module:transifex-config~ConfigSection} resource - Resource to get map
 *                                                           the language for.
 * @async
 * @returns {string} Mapped language code.
 * @throws The config could not be read.
 */
TransifexConfig.prototype.getMappedLang = function(lang, resource) {
    return this.getConfig().then((globalConfig) => {
        if(!resource.lang_map && !globalConfig.main.lang_map) {
            return lang;
        }
        else {
            const map = parseLangMap(resource.lang_map, parseLangMap(globalConfig.main.lang_map));
            if(lang in map) {
                return map[lang];
            }
            return lang;
        }
    });
};

module.exports = TransifexConfig;
