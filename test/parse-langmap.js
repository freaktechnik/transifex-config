import test from 'ava';
import parseLanguageMap from '../lib/parse-langmap.js';

test("parseLanguageMap from string only", (t) => {
    const languageMap = "en : en-US, sr@latin:sr_latin, el:el-GR";
    const expectedLanguageMap = {
        "en-US": "en",
        "sr_latin": "sr@latin",
        "el-GR": "el",
    };

    const parsedMap = parseLanguageMap(languageMap);

    t.deepEqual(parsedMap, expectedLanguageMap);
});

test("parseLanguageMap inherit from object", (t) => {
    const existingMap = {
        "en-US": "en_US",
        "el-GR": "foo",
        "fr-FR": "fr_FR",
    };
    const languageMap = "en : en-US, sr@latin:sr_latin, el:el-GR";
    const expectedLanguageMap = {
        "en-US": "en",
        "sr_latin": "sr@latin",
        "el-GR": "el",
        "fr-FR": "fr_FR",
    };

    const parsedMap = parseLanguageMap(languageMap, existingMap);

    t.deepEqual(parsedMap, expectedLanguageMap);
});

test("parseLanguageMap no string, only object", (t) => {
    const existingMap = {
        "en-US": "en_US",
    };
    const languageMap = "";

    const parsedMap = parseLanguageMap(languageMap, existingMap);

    t.deepEqual(parsedMap, existingMap);
});
