/**
 * @license MIT
 * @author Martin Giger
 */

const MAP_MIN_LENGTH = 3;

/**
 * Parses the language map.
 *
 * @exports module:transifex-config/lib/parse-langmap
 * @param {string} [langMapString=''] - Language map specification.
 * @param {object} [langMap={}] - Language map to inherit from.
 * @returns {Record<string, string>} A map of the language, with the local
 *          language code as key and the remote language code as value.
 */
export default function(langMapString = "", langMap = {}) {
    if(langMapString.length >= MAP_MIN_LENGTH) {
        for(const langTuple of langMapString.split(",")) {
            const [
                remoteLanguage,
                localLanguage,
            ] = langTuple.split(":");
            langMap[localLanguage.trim()] = remoteLanguage.trim();
        }
    }

    return langMap;
}
