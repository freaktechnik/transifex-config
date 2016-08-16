"use strict";
var _ = require("underscore");
var path = require("path");

/**
 * Check if a file matches the file_filter rule.
 *
 * @param {string} basePath - Base path to the transifex config.
 * @param {string} localPath - Full path to the resource file to match.
 * @param {string} fileFilter - File filter the resource should match.
 * @returns {string|boolean} REturns the language the file matches or false.
 */
function matchFileFilter(basePath, localPath, fileFilter) {
    var rmatch = localPath.match(new RegExp("^" + path.join(basePath, fileFilter.replace(/<lang>/g, "([^\\/]+)")) + "$"));
    if(rmatch && rmatch.length) {
        if(rmatch.length > 2) {
            var firstLang = rmatch[1];
            for(var i = 2; i < rmatch.length; ++i) {
                if(rmatch[i] != firstLang) {
                    return false;
                }
            }
        }
        return rmatch[1];
    }
    return false;
}

/**
 * @param {string} basePath - Base path to the transifex config.
 * @param {string} localPath - Full path to the resource file to match.
 * @param {string} resource - Resource to check if the local file matches.
 * @returns {string|boolean} Returns the language if the file matches the
 *          resource, else returns false.
 * @exports transifex-config/lib/match-resource
 */
module.exports = function(basePath, localPath, resource) {
    if("source_file" in resource && localPath == path.join(basePath, resource.source_file)) {
        return resource.source_lang;
    }
    else {
        // See if the file matches the file_filter
        var fileFilterResult = matchFileFilter(basePath, localPath, resource.file_filter);
        if(fileFilterResult) {
            return fileFilterResult;
        }
        else {
            // Check if the file matches any of the files given by trans. keys
            var explicitPaths = _.filter(_.keys(resource), function(key) {
                    return key.search(/trans\..+/) != -1;
                }),
                key;
            for(var k in explicitPaths) {
                key = explicitPaths[k];
                if(localPath == path.join(basePath, resource[key])) {
                    return key.substr("trans.".length);
                }
            }
        }
    }
    return false;
};
