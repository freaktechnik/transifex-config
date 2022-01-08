/**
 * @module transifex-config/lib/errors
 * @author Martin Giger
 * @license MIT
 */
export class NoMatchingResourceError extends Error {
    /**
     * @constructs module:transifex-config/lib/errors.NoMatchingResourceError
     * @param {string} resource - Path to the resource that has no matching config entry.
     * @implements Error
     */
    constructor(resource) {
        super(`No matching resource configuration was found for ${resource}`);
        this.name = "NoMatchingResourceError";
    }
}

export class MatchesSourceError extends Error {
    /**
     * @constructs module:transifex-config/lib/errors.MatchesSourceError
     * @param {string} resource - Path to the resource that is the source file.
     * @implements Error
     */
    constructor(resource) {
        super(`Resource ${resource} matches source language resource`);
        this.name = "MatchesSourceError";
    }
}
