/**
 * @module transifex-config/lib/errors
 * @license MIT
 * @author Martin Giger
 */
export class NoMatchingResourceError extends Error {
    /**
     * @constructs module:transifex-config/lib/errors.NoMatchingResourceError
     * @implements {Error}
     * @param {string} resource - Path to the resource that has no matching config entry.
     */
    constructor(resource) {
        super(`No matching resource configuration was found for ${resource}`);
        this.name = "NoMatchingResourceError";
    }
}

export class MatchesSourceError extends Error {
    /**
     * @constructs module:transifex-config/lib/errors.MatchesSourceError
     * @implements {Error}
     * @param {string} resource - Path to the resource that is the source file.
     */
    constructor(resource) {
        super(`Resource ${resource} matches source language resource`);
        this.name = "MatchesSourceError";
    }
}
