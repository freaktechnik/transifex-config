'use strict';

const { promises: fs } = require('fs');
const os = require('os');
const path = require('path');
const randomString = require('random-string');

exports.mockEnv = async function(config = "", rc = "") {
    const mockBasePath = path.join(os.tmpdir(), `transifex-config-test-${randomString({
        length: 12
    })}`);

    await fs.mkdir(mockBasePath);
    await Promise.all([
        fs.mkdir(path.join(mockBasePath, ".tx"))
            .then(() => fs.writeFile(path.join(mockBasePath, ".tx/config"), config)),
        fs.writeFile(path.join(mockBasePath, ".transifexrc"), rc)
    ]);
    return mockBasePath;
};

exports.deleteMockEnv = async function(basePath) {
    await Promise.all([
        fs.unlink(path.join(basePath, '.tx/config')),
        fs.unlink(path.join(basePath, '.transifexrc'))
    ]);
    await fs.rmdir(path.join(basePath, '.tx'));
    await fs.rmdir(basePath);
};
