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
 * @returns {module:transifex-config~ParsedConfig} Parsed .transifexrc as an
 *          object. Will be cached.
 * @throws The .transifexrc could not be read.
 */
TransifexConfig.prototype.getRC = function() {
    if(!this._transifexrc) {
        this._transifexrc = load.transifexrc(this.basePath);
    }
    return this._transifexrc;
};

/**
 * @async
 * @returns {Array.<module:transifex-config~ConfigSection>} Array of resources.
 * @throws The config could not be read.
 */
TransifexConfig.prototype.getResources = function() {
    return this.getConfig().then(function(config) {
        var resources = [],
            resourceId,
            resource;
        for(var c in config) {
            if(c != "main") {
                resourceId = c.split(".");
                resource = {
                    project: resourceId[0],
                    name: resourceId[1]
                };
                _.extend(resource, config[c]);
                resources.push(resource);
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
            resource = _.find(resources, function(r) {
                // If the source language should be fetched, check if it matches the source file
                if(matchSourceLang && "source_file" in r && localPath == path.join(self.basePath, r.source_file)) {
                    lang = r.source_lang;
                    return true;
                }
                else {
                    // See if the file matches the file_filter
                    var rmatch = localPath.match(new RegExp(path.join(self.basePath, r.file_filter.replace(/<lang>/g, "([a-zA-Z-]+)"))));
                    if(rmatch && rmatch.length) {
                        if(rmatch.length > 2) {
                            var firstLang = rmatch[1];
                            for(var i = 2; i < rmatch.length; ++i) {
                                if(rmatch[i] != firstLang) {
                                    return false;
                                }
                            }
                        }
                        lang = rmatch[1];
                        return true;
                    }
                    else {
                        // Check if the file matches any of the files given by trans. keys
                        var explicitPaths = _.filter(_.keys(r), function(key) {
                            return key.search(/trans\.[a-zA-Z-]+/) != -1;
                        });
                        for(var k in explicitPaths) {
                            if(localPath == path.join(self.basePath, r[explicitPaths[k]])) {
                                lang = explicitPaths[k].substr("trans.".length);
                                return true;
                            }
                        }
                    }
                }
                return false;
            });
        if(!resource || (!matchSourceLang && resource.source_lang == lang)) {
            throw new errors.NoMatchingResourceError(localPath);
        }
        resource.lang = lang;
        resource.source = lang == resource.source_lang;
        return resource;
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
