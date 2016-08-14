var fs = require('mz/fs');
var os = require('os');
var path = require('path');
var randomString = require('random-string');

exports.mockEnv = function(config, rc) {
    config = config || "";
    rc = rc || "";
    var mockBasePath = path.join(os.tmpdir(), "transifex-config-test-" + randomString({
        length: 12
    }));

    return fs.mkdir(mockBasePath).then(function() {
        return Promise.all([
            fs.mkdir(path.join(mockBasePath, ".tx")).then(() => fs.writeFile(path.join(mockBasePath, ".tx/config"), config)),
            fs.writeFile(path.join(mockBasePath, ".transifexrc"), rc)
        ]);
    }).then(function() {
        return mockBasePath;
    });
};

exports.deleteMockEnv = function(basePath) {
    return Promise.all([
        fs.unlink(path.join(basePath, '.tx/config')),
        fs.unlink(path.join(basePath, '.transifexrc'))
    ]).then(function() {
        return fs.rmdir(path.join(basePath, '.tx'));
    }).then(function() {
        return fs.rmdir(basePath);
    });
};
