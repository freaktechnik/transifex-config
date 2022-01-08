import test from 'ava';
import load from '../lib/load-config.js';
import {
    mockEnv as mockEnvironment, deleteMockEnv as deleteMockEnvironment
} from './_mock-environment.js';

test("File constants", (t) => {
    t.true("TXCONFIG" in load);
    t.true("TRANSIFEXRC" in load);

    t.is(load.TXCONFIG, ".tx/config");
    t.is(load.TRANSIFEXRC, ".transifexrc");
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

    const parsedRC = await load.transifexrc(basePath);

    t.deepEqual(parsedRC, expectedRC);

    await deleteMockEnvironment(basePath);
});

test("Reading fails when there is no transifexrc", (t) => { // eslint-disable-line arrow-body-style
    return t.throwsAsync(load.transifexrc("/"));
});

test("Reading falls back to home and fails when transifexrc doesn't contain project", async (t) => {
    const rc = `[my site]
username = foo
password = bar
hostname = https://example.com`;
    const basePath = await mockEnvironment("", rc);

    return t.throwsAsync(load.transifexrc(basePath, 'another site'));
});

test("Read config based on project", async (t) => {
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

    const parsedRC = await load.transifexrc(basePath, 'my site');

    t.deepEqual(parsedRC, expectedRC);

    await deleteMockEnvironment(basePath);
});

test("Normalize config hostname", async (t) => {
    const rc = `[https://sub.example.com]
username = foo
password = bar
hostname = https://example.com`;
    const expectedRC = {
        "https://sub.example.com": {
            "username": "foo",
            "password": "bar",
            "hostname": "https://example.com"
        }
    };
    const basePath = await mockEnvironment("", rc);

    const parsedRC = await load.transifexrc(basePath);

    t.deepEqual(parsedRC, expectedRC);

    await deleteMockEnvironment(basePath);
});

test("read tx config", async (t) => {
    const config = `[main]
host = https://example.com

[o:test:p:my_project:r:main_resource]
source_lang=en
source_file=foo.bar
file_filter=<lang>.bar

[o:test:p:my_project:r:second_res]
file_filter=<lang>.foo
source_lang=de`;
    const parsedConfig = {
        "main": {
            "host": "https://example.com"
        },
        "test": {
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
        }
    };
    const basePath = await mockEnvironment(config);

    const readConfig = await load.txconfig(basePath);
    t.deepEqual(readConfig, parsedConfig);

    await deleteMockEnvironment(basePath);
});

test("Reading fails when there is no .tx/config", (t) => { // eslint-disable-line arrow-body-style
    return t.throwsAsync(load.txconfig("/"));
});
