/**
 * @module transifex-config/lib/match-resource
 * @license MIT
 * @author Martin Giger
 */
import path from "node:path";

const NO_RESULT = -1;


/**
 * Check if a file matches the file_filter rule.
 *
 * @param {string} basePath - Base path to the transifex config.
 * @param {string} localPath - Full path to the resource file to match.
 * @param {string} fileFilter - File filter the resource should match.
 * @returns {string|boolean} REturns the language the file matches or false.
 */
function matchFileFilter(basePath, localPath, fileFilter) {
    const rmatch = localPath.match(new RegExp(`^${path.join(basePath, fileFilter.replaceAll("<lang>", "([^\\/]+)"))}$`));
    if(rmatch && rmatch.length) {
        const [
            match, // eslint-disable-line no-unused-vars
            firstLang,
            ...otherLangs
        ] = rmatch;
        if(otherLangs.length) {
            for(const lang of otherLangs) {
                if(lang !== firstLang) {
                    return false;
                }
            }
        }
        return firstLang;
    }
    return false;
}

/**
 * @param {string} basePath - Base path to the transifex config.
 * @param {string} localPath - Full path to the resource file to match.
 * @param {string} resource - Resource to check if the local file matches.
 * @returns {string|boolean} Returns the language if the file matches the
 *          resource, else returns false.
 */
export default function(basePath, localPath, resource) {
    if("source_file" in resource && localPath == path.join(basePath, resource.source_file)) {
        return resource.source_lang;
    }

    // See if the file matches the file_filter
    const fileFilterResult = matchFileFilter(basePath, localPath, resource.file_filter);
    if(fileFilterResult) {
        return fileFilterResult;
    }

    // Check if the file matches any of the files given by trans. keys
    const explicitPaths = Object.keys(resource).filter((key) => key.search(/trans\..+/) !== NO_RESULT);
    for(const key of Object.values(explicitPaths)) {
        if(localPath == path.join(basePath, resource[key])) {
            return key.slice("trans.".length);
        }
    }


    return false;
}
