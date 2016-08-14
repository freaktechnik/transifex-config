/**
 * @author Martin Giger
 * @license MIT
 */
"use strict";

/**
 * Parse a transifex client configuration file. Looks at the file line by line.
 *
 * @param {string} content - Configuration file contents.
 * @returns {module:transifex-config~ParsedConfig} Configuration file
 *          represented as an object.
 */
module.exports = function(content) {
    var lines = content.split("\n"),
        sections = {};

    // need deterministic iteration to know which site we're in
    for(var l = 0, line, currentSection; l < lines.length; ++l) {
        line = lines[l];
        // Section header
        if(line[0] == "[") {
            currentSection = line.substr(1, line.length - 2);
            sections[currentSection] = {};
        }
        // Section property
        else if(line.indexOf("=") != -1) {
            var parts = line.split("=");
            parts[1] = parts[1].trimLeft();

            sections[currentSection][parts[0].trim()] = parts.slice(1).join("=");
        }
        // Whitespace, ignore
    }

    return sections;
};
