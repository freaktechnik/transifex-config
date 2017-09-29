const fs = require('mz/fs');
const os = require('os');
const path = require('path');
const randomString = require('random-string');

exports.mockEnv = function(config, rc) {
    config = config || "";
    rc = rc || "";
    const mockBasePath = path.join(os.tmpdir(), `transifex-config-test-${randomString({
        length: 12
    })}`);

    return fs.mkdir(mockBasePath).then(() => Promise.all([
        fs.mkdir(path.join(mockBasePath, ".tx"))
            .then(() => fs.writeFile(path.join(mockBasePath, ".tx/config"), config)),
        fs.writeFile(path.join(mockBasePath, ".transifexrc"), rc)
    ]))
        .then(() => mockBasePath);
};

exports.deleteMockEnv = function(basePath) {
    return Promise.all([
        fs.unlink(path.join(basePath, '.tx/config')),
        fs.unlink(path.join(basePath, '.transifexrc'))
    ])
        .then(() => fs.rmdir(path.join(basePath, '.tx')))
        .then(() => fs.rmdir(basePath));
};
