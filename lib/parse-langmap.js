"use strict";

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
