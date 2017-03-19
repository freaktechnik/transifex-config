/**
 * @author Martin Giger
 * @license MIT
 */
"use strict";

var _ = require("underscore");
var path = require("path");
var fs = require("fs");
var load = require("./lib/load-config");
var parseLangMap = require("./lib/parse-langmap");
var errors = require("./lib/errors");
var matchResource = require("./lib/match-resource");

/**
 * @class
 * @param {string} [basePath] - Path the transifex configuration is in. Defaults
 *                              to the best guess of the package root.
 * @throws The .transifexrc or .tx/config can not be found in the base path.
 * @exports transifex-config
 */
function TransifexConfig(basePath) {
    /**
     * Base path the config is read from
     * @type {string}
     */
    this.basePath = basePath || require("app-root-path");

    var R_OK = fs.R_OK || fs.constants.R_OK;
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
TransifexConfig.prototype.getRC = _.memoize(_getRC);

/**
 * @async
 * @returns {Array.<module:transifex-config~ConfigSection>} Array of resources.
 * @throws The config could not be read.
 */
TransifexConfig.prototype.getResources = function() {
    return this.getConfig().then(function(config) {
        var resources = [],
            resource,
            project;
        for(var p in config) {
            if(p != "main") {
                project = config[p];
                for(var c in project) {
                    resource = {
                        project: p,
                        name: c
                    };
                    _.extend(resource, project[c]);
                    resources.push(resource);
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
    var self = this;
    return this.getResources().then(function(resources) {
        var lang,
            resource = _.find(resources, function(resource) {
                var result = matchResource(self.basePath, localPath, resource);
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
        resource.source = lang == resource.source_lang;
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
    var self = this;
    return this.getResources().then(function(resources) {
        return _.some(resources, function(resource) {
            return matchResource(self.basePath, path, resource) == resource.source_lang;
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
    return this.getConfig().then(function(globalConfig) {
        if(!resource.lang_map && !globalConfig.main.lang_map) {
            return lang;
        }
        else {
            var map = parseLangMap(resource.lang_map, parseLangMap(globalConfig.main.lang_map));
            if(lang in map) {
                return map[lang];
            }
            return lang;
        }
    });
};

module.exports = TransifexConfig;
