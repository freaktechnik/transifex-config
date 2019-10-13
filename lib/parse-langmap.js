/**
 * @author Martin Giger
 * @license MIT
 */

"use strict";

const MAP_MIN_LENGTH = 3;

/**
 * Parses the language map.
 *
 * @param {string} [langMapString=''] - Language map specification.
 * @param {object} [langMap={}] - Language map to inherit from.
 * @returns {object.<string, string>} A map of the language, with the local
 *          language code as key and the remote language code as value.
 * @exports transifex-config/lib/parse-langmap
 */
module.exports = function(langMapString = "", langMap = {}) {
    if(langMapString.length >= MAP_MIN_LENGTH) {
        langMapString.split(",").forEach((langTuple) => {
            const [
                remoteLanguage,
                localLanguage
            ] = langTuple.split(":");
            langMap[localLanguage.trim()] = remoteLanguage.trim();
        });
    }

    return langMap;
};
