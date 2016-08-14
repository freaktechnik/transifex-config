import test from 'ava';
import load from '../lib/load-config';
import { mockEnv, deleteMockEnv } from './_mock-env.js';

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
    const basePath = await mockEnv("", rc);

    const parsedRC = await t.notThrows(load.transifexrc(basePath));

    t.deepEqual(parsedRC, expectedRC);

    await deleteMockEnv(basePath);
});

test("Reading fails when there is no transifexrc", (t) => {
    return t.throws(load.transifexrc("/"));
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
    const parsedConfig = {
        "main": {
            "host": "https://example.com"
        },
        "my_project.main_resource": {
            "source_lang": "en",
            "source_file": "foo.bar",
            "file_filter": "<lang>.bar"
        },
        "my_project.second_res": {
            "file_filter": "<lang>.foo",
            "source_lang": "de"
        }
    };
    const basePath = await mockEnv(config);

    const readConfig = await load.txconfig(basePath);
    t.deepEqual(readConfig, parsedConfig);

    await deleteMockEnv(basePath);
});

test("Reading fails when there is no .tx/config", (t) => {
    return t.throws(load.txconfig("/"));
});

