/**
 * @module transifex-config/lib/errors
 * @author Martin Giger
 * @license MIT
 */
"use strict";

/**
 * @class
 * @param {string} resource - Path to the resource that has no matching config
 *                            entry.
 * @implements Error
 * @alias module:transifex-config/lib/errors.NoMatchingResourceError
 */
function NoMatchingResourceError(resource) {
    Error.captureStackTrace(this);
    this.name = "NoMatchingResourceError";
    this.message = "No matching resource configuration was found for " + resource;
}
exports.NoMatchingResourceError = NoMatchingResourceError;
