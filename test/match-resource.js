import test from 'ava';
import matchResource from '../lib/match-resource';

test("Doesn't match unrelated file", (t) => {
    const basePath = "/foo/";
    const resource = {
        file_filter: "<lang>.file",
        source_lang: "en"
    };

    t.false(matchResource(basePath, "/bar/en.file", resource));
    t.false(matchResource(basePath, "/foo/en1.foo", resource));
});

test("Doesn't match path that includes the full path", (t) => {
    const basePath = "/foo/";
    const resource = {
        file_filter: "<lang>.file",
        source_lang: "en"
    };

    t.false(matchResource(basePath, "/bar/foo/en.file", resource));
    t.false(matchResource(basePath, "/foo/en.file/bar", resource));
});

test("Get resource from file_filter", (t) => {
    const basePath = "/foo/";
    const localPath = basePath + "de/de.file";
    const resource = {
        file_filter: "<lang>/<lang>.file",
        source_lang: "en"
    };
    const match = matchResource(basePath, localPath, resource);

    t.is(match, "de");
});

test("File filter needs <lang> to be the same value everywhere", (t) => {
    const basePath = "/foo/";
    const localPath = basePath + "de/fr.file";
    const resource = {
        file_filter: "<lang>/<lang>.file",
        source_lang: "en"
    };
    const match = matchResource(basePath, localPath, resource);

    t.false(match);
});

test("Get resource from trans.lang", (t) => {
    const basePath = "/foo/";
    const localPath = basePath + "custom/my.file";
    const resource = {
        file_filter: "<lang>/<lang>.file",
        "trans.fi": "custom/my.file",
        source_lang: "en"
    };
    const match = matchResource(basePath, localPath, resource);

    t.is(match, "fi");
});

test("Get resource from source_file", (t) => {
    const basePath = "/foo/";
    const localPath = basePath + "source.file";
    const resource = {
        file_filter: "<lang>/<lang>.file",
        source_file: "source.file",
        source_lang: "en"
    };
    const match = matchResource(basePath, localPath, resource);

    t.is(match, "en");
});
