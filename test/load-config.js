import test from 'ava';
import {
    txconfig, transifexrc, TXCONFIG, TRANSIFEXRC,
} from '../lib/load-config.js';
import {
    mockEnvironment, deleteMockEnvironment,
} from './_mock-environment.js';

test("File constants", (t) => {
    t.is(TXCONFIG, ".tx/config");
    t.is(TRANSIFEXRC, ".transifexrc");
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
            "hostname": "https://example.com",
        },
    };
    const basePath = await mockEnvironment("", rc);

    const parsedRC = await transifexrc(basePath);

    t.deepEqual(parsedRC, expectedRC);

    await deleteMockEnvironment(basePath);
});

test("Reading fails when there is no transifexrc", (t) => { // eslint-disable-line arrow-body-style
    return t.throwsAsync(transifexrc("/"));
});

test("Reading falls back to home and fails when transifexrc doesn't contain project", async (t) => {
    const rc = `[my site]
username = foo
password = bar
hostname = https://example.com`;
    const basePath = await mockEnvironment("", rc);

    return t.throwsAsync(transifexrc(basePath, 'another site'));
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
            "hostname": "https://example.com",
        },
    };
    const basePath = await mockEnvironment("", rc);

    const parsedRC = await transifexrc(basePath, 'my site');

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
            "hostname": "https://example.com",
        },
    };
    const basePath = await mockEnvironment("", rc);

    const parsedRC = await transifexrc(basePath);

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
            "host": "https://example.com",
        },
        "test": {
            "my_project": {
                "main_resource": {
                    "source_lang": "en",
                    "source_file": "foo.bar",
                    "file_filter": "<lang>.bar",
                },
                "second_res": {
                    "file_filter": "<lang>.foo",
                    "source_lang": "de",
                },
            },
        },
    };
    const basePath = await mockEnvironment(config);

    const readConfig = await txconfig(basePath);
    t.deepEqual(readConfig, parsedConfig);

    await deleteMockEnvironment(basePath);
});

test("Reading fails when there is no .tx/config", (t) => { // eslint-disable-line arrow-body-style
    return t.throwsAsync(txconfig("/"));
});
