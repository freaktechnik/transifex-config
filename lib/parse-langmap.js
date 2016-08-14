/**
 * @author Martin Giger
 * @license MIT
 */

"use strict";

/**
 * Parses the language map.
 *
 * @param {string} [langMapString=""] - Language map specification.
 * @param {Object} [langMap={}] - Language map to inherit from.
 * @returns {Object.<string, string>} A map of the language, with the local
 *          language code as key and the remote language code as value.
 * @exports transifex-config/lib/parse-langmap
 */
module.exports = function(langMapString, langMap) {
    langMapString = langMapString || "";
    langMap = langMap || {};
    if(langMapString.length >= 3) {
        langMapString.split(",").forEach(function(langTuple) {
            var splitTuple = langTuple.split(":");
            langMap[splitTuple[1].trim()] = splitTuple[0].trim();
        });
    }

    return langMap;
};
