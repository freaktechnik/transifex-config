import test from 'ava';
import path from 'path';
import TransifexConfig from '..';
import {
    mockEnv as mockEnvironment, deleteMockEnv as deleteMockEnvironment
} from './_mock-env.js';
import errors from '../lib/errors';

test("Constructor throws if the files don't exist", (t) => {
    t.throws(() => {
        new TransifexConfig();
    });
});

test("Constructor stores base path", async (t) => {
    const basePath = await mockEnvironment();

    const txc = new TransifexConfig(basePath);
    t.is(txc.basePath, basePath);

    await deleteMockEnvironment(basePath);
});

test("Reading transifexrc", async (t) => {
    const rc = `[my site]
username = foo
password = bar
hostname = https://example.com`;
    const expectedRC = {
        "my site": {
            "username": "foo",
            "password": "bar",
            "hostname": "https://example.com"
        }
    };
    const basePath = await mockEnvironment("", rc);
    const txc = new TransifexConfig(basePath);

    const parsedRC = await txc.getRC();

    t.deepEqual(parsedRC, expectedRC);

    await deleteMockEnvironment(basePath);
});

test("Reading fails when there is no transifexrc", async (t) => {
    const basePath = await mockEnvironment();
    const txc = new TransifexConfig(basePath);
    await deleteMockEnvironment(basePath);

    txc.getRC.cache.clear();

    return t.throwsAsync(txc.getRC(), Error);
});

test("read tx config", async (t) => {
    const config = `[main]
host = https://example.com

[my_project.main_resource]
source_lang=en
source_file=foo.bar
file_filter=<lang>.bar

[my_project.second_res]
file_filter=<lang>.foo
source_lang=de`;
    const expectedConfig = {
        "main": {
            "host": "https://example.com"
        },
        "my_project": {
            "main_resource": {
                "source_lang": "en",
                "source_file": "foo.bar",
                "file_filter": "<lang>.bar"
            },
            "second_res": {
                "file_filter": "<lang>.foo",
                "source_lang": "de"
            }
        }
    };
    const basePath = await mockEnvironment(config);
    const txc = new TransifexConfig(basePath);

    const parsedConfig = await txc.getConfig();
    t.deepEqual(parsedConfig, expectedConfig);

    t.is(txc.getConfig(), txc._txconfig);
    const cachedConfig = await txc.getConfig();
    t.deepEqual(cachedConfig, expectedConfig);

    await deleteMockEnvironment(basePath);
});

test("Reading fails when there is no .tx/config", async (t) => {
    const basePath = await mockEnvironment();
    const txc = new TransifexConfig(basePath);
    await deleteMockEnvironment(basePath);

    return t.throwsAsync(txc.getConfig());
});

test("get resources only", async (t) => {
    const config = `[main]
host = https://example.com

[my_project.main_resource]
source_lang=en
source_file=foo.bar
file_filter=<lang>.bar

[my_project.second_res]
file_filter=<lang>.foo
source_lang=de`;
    const basePath = await mockEnvironment(config);
    const resources = [
        {
            "project": "my_project",
            "name": "main_resource",
            "source_lang": "en",
            "source_file": "foo.bar",
            "file_filter": "<lang>.bar"
        },
        {
            "project": "my_project",
            "name": "second_res",
            "file_filter": "<lang>.foo",
            "source_lang": "de"
        }
    ];

    const txc = new TransifexConfig(basePath);

    const parsedResources = await txc.getResources();
    t.deepEqual(parsedResources, resources);

    await deleteMockEnvironment(basePath);
});

test("Get mapped language without maps", async (t) => {
    const basePath = await mockEnvironment(`[main]
host=https://example.com`);
    const txc = new TransifexConfig(basePath);

    t.is(await txc.getMappedLang("en", {
        project: "main",
        name: "resource",
        "file_filter": "locales/<lang>.file",
        "source_lang": "en"
    }), "en");

    await deleteMockEnvironment(basePath);
});

test("Get unmapped language with maps", async (t) => {
    const basePath = await mockEnvironment(`[main]
host=https://example.com`);
    const txc = new TransifexConfig(basePath);

    t.is(await txc.getMappedLang("en", {
        project: "main",
        name: "resource",
        "lang_map": "fr:fr-FR",
        "file_filter": "locales/<lang>.file",
        "source_lang": "en"
    }), "en");

    await deleteMockEnvironment(basePath);
});

test("Get mapped language with map", async (t) => {
    const basePath = await mockEnvironment(`[main]
host=https://example.com`);
    const txc = new TransifexConfig(basePath);

    t.is(await txc.getMappedLang("en-US", {
        project: "main",
        name: "resource",
        "lang_map": "en_US:en-US",
        "file_filter": "locales/<lang>.file",
        "source_lang": "en"
    }), "en_US");

    await deleteMockEnvironment(basePath);
});

test("Get mapped language from global map", async (t) => {
    const basePath = await mockEnvironment(`[main]
host=https://example.com
lang_map=en_US:en-US`);
    const txc = new TransifexConfig(basePath);

    t.is(await txc.getMappedLang("en-US", {
        project: "main",
        name: "resource",
        "lang_map": "fr:fr-FR",
        "source_lang": "en",
        "file_filter": "locales/<lang>.file"
    }), "en_US");

    await deleteMockEnvironment(basePath);
});

test("Get mapped language overwritten by resource map", async (t) => {
    const basePath = await mockEnvironment(`[main]
host=https://example.com
lang_map=en_US:en-US`);
    const txc = new TransifexConfig(basePath);

    t.is(await txc.getMappedLang("en-US", {
        project: "main",
        name: "resource",
        "lang_map": "en:en-US",
        "source_lang": "en",
        "file_filter": "locales/<lang>.file"
    }), "en");

    await deleteMockEnvironment(basePath);
});

test("getResource from file_filter", async (t) => {
    const config = `[main]
host = https://example.com

[project.resource]
source_file=locales/source/main.properties
trans.rm=custom/roh/main.properties
file_filter=locales/<lang>/<lang>.properties
source_lang=en`;
    const basePath = await mockEnvironment(config);
    const txc = new TransifexConfig(basePath);

    const resource = await txc.getResource(path.join(basePath, "locales/de/de.properties"));
    t.is(resource.project, "project");
    t.is(resource.name, "resource");
    t.is(resource.lang, "de");
    t.false(resource.source);

    await deleteMockEnvironment(basePath);
});

test("getResource from trans.<lang>", async (t) => {
    const config = `[main]
host = https://example.com

[project.resource]
source_file=locales/source/main.properties
trans.rm=custom/roh/main.properties
file_filter=locales/<lang>/<lang>.properties
source_lang=en`;
    const basePath = await mockEnvironment(config);
    const txc = new TransifexConfig(basePath);

    const resource = await txc.getResource(path.join(basePath, "custom/roh/main.properties"));
    t.is(resource.project, "project");
    t.is(resource.name, "resource");
    t.is(resource.lang, "rm");
    t.false(resource.source);

    await deleteMockEnvironment(basePath);
});

test("getResource from source_file", async (t) => {
    const config = `[main]
host = https://example.com

[project.resource]
source_file=locales/source/main.properties
trans.rm=custom/roh/main.properties
file_filter=locales/<lang>/<lang>.properties
source_lang=en`;
    const basePath = await mockEnvironment(config);
    const txc = new TransifexConfig(basePath);

    const resource = await txc.getResource(path.join(basePath, "locales/source/main.properties"), true);
    t.is(resource.project, "project");
    t.is(resource.name, "resource");
    t.is(resource.lang, "en");
    t.true(resource.source);

    await deleteMockEnvironment(basePath);
});

test("getResource source lang without allowing it", async (t) => {
    const config = `[main]
host = https://example.com

[project.resource]
source_file=locales/source/main.properties
trans.rm=custom/roh/main.properties
file_filter=locales/<lang>/<lang>.properties
source_lang=en`;
    const basePath = await mockEnvironment(config);
    const txc = new TransifexConfig(basePath);

    await t.throwsAsync(txc.getResource(path.join(basePath, "locales/en/en.properties"), false), errors.MatchesSourceError);
    await t.throwsAsync(txc.getResource(path.join(basePath, "locales/source/main.properties")), errors.MatchesSourceError);

    await deleteMockEnvironment(basePath);
});

test("getResource that's not registered", async (t) => {
    const config = `[main]
host = https://example.com

[project.resource]
source_file=locales/source/main.properties
trans.rm=custom/roh/main.properties
file_filter=locales/<lang>/<lang>.properties
source_lang=en`;
    const basePath = await mockEnvironment(config);
    const txc = new TransifexConfig(basePath);

    await t.throwsAsync(txc.getResource("/full/path/to/nothing.po"), errors.NoMatchingResourceError);

    await deleteMockEnvironment(basePath);
});

test("getResource only matches if it's the exact path", async (t) => {
    const config = `[main]
host = https://example.com

[project.resource]
source_file=locales/source/main.properties
trans.rm=custom/roh/main.properties
file_filter=locales/<lang>/<lang>.properties
source_lang=en`;
    const basePath = await mockEnvironment(config);
    const txc = new TransifexConfig(basePath);

    await t.throwsAsync(txc.getResource("/wrong/path/to/locales/en/main.properties"), errors.NoMatchingResourceError);

    await deleteMockEnvironment(basePath);
});

test("getResource thwrows if it can't read the txconfig", async (t) => {
    const config = `[main]
host = https://example.com

[project.resource]
source_file=locales/source/main.properties
trans.rm=custom/roh/main.properties
file_filter=locales/<lang>/<lang>.properties
source_lang=en`;
    const basePath = await mockEnvironment(config);
    const txc = new TransifexConfig(basePath);
    await deleteMockEnvironment(basePath);

    await t.throwsAsync(txc.getResource(path.join(basePath, "locales/en/main.properties")));
});

test("isSourceResource doesn't match non-source resource", async (t) => {
    const config = `[main]
host = https://example.com

[project.resource]
source_file=locales/source/main.properties
file_filter=locales/<lang>/main.properties
source_lang=en`;
    const basePath = await mockEnvironment(config);
    const txc = new TransifexConfig(basePath);

    t.false(await txc.isSourceResource(path.join(basePath, "locales/custom/file.properties")));

    await deleteMockEnvironment(basePath);
});

test("isSourceResource doesn't match non-source language", async (t) => {
    const config = `[main]
host = https://example.com

[project.resource]
source_file=locales/source/main.properties
file_filter=locales/<lang>/main.properties
source_lang=en`;
    const basePath = await mockEnvironment(config);
    const txc = new TransifexConfig(basePath);

    t.false(await txc.isSourceResource(path.join(basePath, "locales/fr/main.properties")));

    await deleteMockEnvironment(basePath);
});

test("isSourceResource match source language resource", async (t) => {
    const config = `[main]
host = https://example.com

[project.resource]
source_file=locales/source/main.properties
file_filter=locales/<lang>/main.properties
source_lang=en`;
    const basePath = await mockEnvironment(config);
    const txc = new TransifexConfig(basePath);

    t.true(await txc.isSourceResource(path.join(basePath, "locales/en/main.properties")));

    await deleteMockEnvironment(basePath);
});
