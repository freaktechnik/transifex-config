/**
 * @license MIT
 * @author Martin Giger
 */
import path from "node:path";
import fs from "node:fs";
import {
    txconfig, transifexrc, TRANSIFEXRC, TXCONFIG
} from "./lib/load-config.js";
import parseLangMap from "./lib/parse-langmap.js";
import {
    NoMatchingResourceError, MatchesSourceError
} from "./lib/errors.js";
import matchResource from "./lib/match-resource.js";
import memoize from "lodash.memoize";
import defaultBasePath from "app-root-path";

/**
 * @typedef {Record<string, string>} ConfigSection
 * Has a property for each key in the section, with trimmed name and value.
 */
/**
 * @typedef {Record<string, module:transifex-config~ConfigSection>} ParsedConfig
 * Has a property for each section in the config. Each section has a property
 * named after the key with its value assigned.
 */

/**
 * @param {string} [service] - The config should contain this service URL.
 * @returns {module:transifex-config~ParsedConfig} Parsed .transifexrc as an
 *          object. Will be cached.
 * @async
 * @throws The .transifexrc could not be read.
 * @this {TransifexConfig}
 */
function _getRC(service) {
    return transifexrc(this.basePath, service);
}

/**
 * @exports module:transifex-config
 * @class
 */
class TransifexConfig {
    /**
     * @param {string} [basePath=require("app-root-path")] - Path the transifex configuration is in. Defaults
     *                              to the best guess of the package root.
     * @throws The .transifexrc or .tx/config can not be found.
     */
    constructor(basePath = defaultBasePath) {
        /**
         * Base path the config is read from.
         *
         * @type {string}
         */
        this.basePath = basePath;

        const R_OK = fs.R_OK || fs.constants.R_OK;
        /* eslint-disable node/no-sync */
        fs.accessSync(path.join(this.basePath, TRANSIFEXRC), R_OK);
        fs.accessSync(path.join(this.basePath, TXCONFIG), R_OK);
        /* eslint-enable node/no-sync */
    }

    /**
     * Memoized version of {@link module:transifex-config~_getRC}.
     *
     * @extends module:transifex-config~_getRC
     */
    getRC = memoize(_getRC);

    /**
     * @returns {module:transifex-config~ParsedConfig} Parsed .tx/config as an
     *          object. Will be cached.
     * @async
     * @throws The config could not be read.
     */
    getConfig() {
        if(!this._txconfig) {
            this._txconfig = txconfig(this.basePath);
        }
        return this._txconfig;
    }

    /**
     * @returns {Array.<module:transifex-config~ConfigSection>} Array of resources.
     * @async
     * @throws The config could not be read.
     */
    async getResources() {
        const config = await this.getConfig();
        const resources = [];
        for(const [
            organization,
            projects
        ] of Object.entries(config)) {
            if(organization != "main" && typeof projects === 'object') {
                for(const [
                    project,
                    configResources
                ] of Object.entries(projects)) {
                    for(const [
                        name,
                        resource
                    ] of Object.entries(configResources)) {
                        resources.push(Object.assign({
                            organization,
                            project,
                            name
                        }, resource));
                    }
                }
            }
        }
        return resources;
    }

    /**
     * @param {string} localPath - Absolute local path of the resource to return the
     *                             config entry of.
     * @param {boolean} [matchSourceLang] - If the resource should be returned
     *                                            when the path is for the source
     *                                            language of the resource.
     * @returns {module:transifex-config~ConfigSection} Config section for the
     *          resource.
     * @async
     * @throws {module:transifex-config/lib/errors.NoMatchingResourceError} There
     *         is no matching resource.
     * @throws The config could not be read.
     */
    async getResource(localPath, matchSourceLang) {
        const resources = await this.getResources();
        let lang;
        const resource = resources.find((txResource) => {
            const result = matchResource(this.basePath, localPath, txResource);
            if(result) {
                lang = result;
                return true;
            }
            return false;
        });
        if(!resource) {
            throw new NoMatchingResourceError(localPath);
        }
        else if(!matchSourceLang && resource.source_lang == lang) {
            throw new MatchesSourceError(localPath);
        }
        resource.lang = lang;
        resource.source = lang === resource.source_lang;
        return resource;
    }

    /**
     * Check if a resource is the source resource.
     *
     * @param {string} resourcePath - Path to check.
     * @returns {boolean} If the resource is the source.
     * @async
     * @throws The config could not be read.
     */
    async isSourceResource(resourcePath) {
        const resources = await this.getResources();
        return resources.some((resource) => matchResource(this.basePath, resourcePath, resource) == resource.source_lang);
    }

    /**
     * @param {string} lang - Language code to map from local to external.
     * @param {module:transifex-config~ConfigSection} resource - Resource to get map
     *                                                           the language for.
     * @returns {string} Mapped language code.
     * @async
     * @throws The config could not be read.
     */
    async getMappedLang(lang, resource) {
        const globalConfig = await this.getConfig();
        if(!resource.lang_map && !globalConfig.main.lang_map) {
            return lang;
        }
        const map = parseLangMap(resource.lang_map, parseLangMap(globalConfig.main.lang_map));
        if(Object.hasOwn(map, lang)) {
            return map[lang];
        }
        return lang;
    }
}

export default TransifexConfig;
