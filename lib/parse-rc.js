/**
 * @license MIT
 * @author Martin Giger
 */

import ini from "ini";

/**
 * @param {Array<string>} keyPath - Path of keys that should be present in the nested object.
 * @param {object} object - Object to ensure the keys exist on.
 * @returns {object} Reference to the object with the requested keys.
 */
function ensureObjectKeyPath(keyPath, object) {
    const key = keyPath.shift();
    if(!object.hasOwnProperty(key)) {
        object[key] = {};
    }
    if(keyPath.length) {
        ensureObjectKeyPath(keyPath, object[key]);
    }
    return object;
}

/**
 * Parse a transifex client configuration file. Looks at the file line by line.
 *
 * @exports module:transifex-config/lib/parse-rc
 * @param {string} content - Configuration file contents.
 * @returns {module:transifex-config~ParsedConfig} Configuration file
 *          represented as an object.
 */
export default function(content) {
    const preParsed = ini.parse(content);
    const fullyParsed = {};
    for(const [
        section,
        values,
    ] of Object.entries(preParsed)) {
        if(section.includes(':')) {
            const [
                o,
                organization,
                p,
                project,
                r,
                resource,
            ] = section.split(':');
            if(o !== 'o' || p !== 'p' || r !== 'r') {
                fullyParsed[section] = values;
                continue;
            }
            ensureObjectKeyPath([
                organization,
                project,
            ], fullyParsed);
            fullyParsed[organization][project][resource] = values;
        }
        else {
            fullyParsed[section] = values;
        }
    }
    return fullyParsed;
}
