/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 *
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */

const path = require('path');
const os = require('os');
const exec = require('./exec');

/**
 * The main function
 */
async function main() {
    const rootDir = process.cwd(); // The root dir that contains `README.md`.
    const serverDir = path.join(rootDir, 'server'); // The golang server dir.

    // Build the golang server.
    console.log(`enter ${serverDir}`);
    process.chdir(serverDir);
    console.log(`build server...`);
    if (os.platform() === 'win32') {
        await exec('go', ['build', '-o', '../build/ShadowEditor.exe']);
    } else {
        await exec('go', ['build', '-o', '../build/ShadowEditor']);
    }
    console.log(`leave ${serverDir}`);
    process.chdir(rootDir);

    // done
    console.log('Done!');
}

main();