/**
 * @module transifex-config/lib/load-config
 * @author Martin Giger
 * @license MIT
 */
import path from "node:path";
import os from "node:os";
import { promises as fs } from "node:fs";
import parse from "./parse-rc.js";

/**
 * File name of the config file from the base path.
 *
 * @const
 * @readonly
 * @type {string}
 */
export const TRANSIFEXRC = ".transifexrc";
/**
 * File name of the rc file from the base path.
 *
 * @const
 * @readonly
 * @type {string}
 */
export const TXCONFIG = ".tx/config";

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
export function txconfig(basePath) {
    return loadConfig(path.join(basePath, TXCONFIG));
}

/**
 * Fixes the header names of the RC by re-assembling the host names instead of
 * each domain part being a subsection.
 *
 * @param {object} rc - RC to normalize.
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
export async function transifexrc(basePath, service) {
    const localConfig = await loadConfig(path.join(basePath, TRANSIFEXRC));
    const rc = normalizeRC(localConfig);
    if((!service && Object.keys(rc).length) || service in rc) {
        return rc;
    }

    try {
        const config = await loadConfig(path.join(os.homedir(), TRANSIFEXRC));
        const normalized = normalizeRC(config);
        return normalized;
    }
    catch(error) {
        throw new Error("Couldn't load the transifexrc from the home directory. Loading was attempted, since the project's transifex RC is either empty or does not contain the requested project.");
    }
}
