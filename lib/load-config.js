/**
 * @module transifex-config/lib/load-config
 * @license MIT
 * @author Martin Giger
 */
import path from "node:path";
import os from "node:os";
import { promises as fs } from "node:fs";
import parse from "./parse-rc.js";

/**
 * File name of the config file from the base path.
 *
 * @type {string}
 * @const
 * @readonly
 */
export const TRANSIFEXRC = ".transifexrc";
/**
 * File name of the rc file from the base path.
 *
 * @type {string}
 * @const
 * @readonly
 */
export const TXCONFIG = ".tx/config";

/**
 * Loads a file from the given path and returns its contents.
 *
 * @param {string} configPath - Path to the file to load.
 * @returns {string} Contents of the file.
 * @async
 * @throws The file could not be read.
 */
async function loadConfig(configPath) {
    const result = await fs.readFile(configPath, 'utf8');
    return parse(result);
}

/**
 * Loads and parses the transifex client config.
 *
 * @param {string} basePath - Path the config is in.
 * @returns {module:transifex-config~ParsedConfig} Parsed contents of the config.
 * @async
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
 * @returns {module:transifex-config~ParsedConfig} Parsed contents of the rc.
 * @async
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
    catch{
        throw new Error("Couldn't load the transifexrc from the home directory. Loading was attempted, since the project's transifex RC is either empty or does not contain the requested project.");
    }
}
