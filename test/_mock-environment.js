import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import randomString from 'random-string';

/**
 * Creates a temporary mock file root
 *
 * @param {string} config - Contents of the transifexconfig
 * @param {string} rc - Contents of the transifexrc
 * @returns {string} base path to the mock env
 */
export async function mockEnvironment(config = "", rc = "") {
    const mockBasePath = path.join(os.tmpdir(), `transifex-config-test-${randomString({
        length: 12,
    })}`);

    await fs.mkdir(mockBasePath);
    await Promise.all([
        fs.mkdir(path.join(mockBasePath, ".tx"))
            .then(() => fs.writeFile(path.join(mockBasePath, ".tx/config"), config)),
        fs.writeFile(path.join(mockBasePath, ".transifexrc"), rc),
    ]);
    return mockBasePath;
}

/**
 * Clean up a temporary mock file root.
 *
 * @param {string} basePath
 */
export async function deleteMockEnvironment(basePath) {
    await Promise.all([
        fs.unlink(path.join(basePath, '.tx/config')),
        fs.unlink(path.join(basePath, '.transifexrc')),
    ]);
    await fs.rmdir(path.join(basePath, '.tx'));
    await fs.rmdir(basePath);
}
