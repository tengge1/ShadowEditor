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
const fs = require('fs-extra');
const os = require('os');
const exec = require('./exec');

/**
 * The main function
 */
async function main() {
    const rootDir = process.cwd(); // The root dir that contains `README.md`.
    const serverDir = path.join(rootDir, 'server'); // The golang server dir.
    const webDir = path.join(rootDir, 'web'); // The web dir.

    console.log(`root dir: ${rootDir}`);
    console.log(`server dir: ${serverDir}`);
    console.log(`web dir: ${webDir}`);

    // Install the golang dependencies.
    console.log(`enter ${serverDir}`);
    process.chdir(serverDir);
    await exec('go', ['env', '-w', 'GO111MODULE=on']);
    await exec('go', ['install']);
    console.log(`leave ${serverDir}`);
    process.chdir(rootDir);

    // Create build dir if it does not exist.
    if (!fs.existsSync('build')) {
        fs.mkdirSync('build');
    }

    // Build the golang server.
    console.log(`enter ${serverDir}`);
    process.chdir(serverDir);
    console.log(`build server...`);
    if (os.platform() === 'win32') {
        await exec('go', ['build', '-o', '../build/ShadowEditor.exe']);
    } else {
        await exec('go', ['build', '-o', '../build/ShadowEditor']);
    }
    console.log('copy config.toml to the build directory');
    fs.copyFileSync('config.toml', '../build/config.toml');
    console.log(`leave ${serverDir}`);
    process.chdir(rootDir);

    // Build the nodejs web client.
    console.log(`enter ${webDir}`);
    process.chdir(webDir);
    console.log('build web client...');
    const npx = os.platform() === 'win32' ? 'npx.cmd' : 'npx';
    await exec(npx, ['rollup', '-c', 'rollup.config.js']);
    console.log(`copy files...`);
    fs.copySync('./assets', '../build/public/assets');
    fs.copySync('./locales', '../build/public/locales');
    fs.copyFileSync('./favicon.ico', '../build/public/favicon.ico');
    fs.copyFileSync('./index.html', '../build/public/index.html');
    fs.copyFileSync('./manifest.json', '../build/public/manifest.json');
    fs.copyFileSync('./sw.js', '../build/public/sw.js');
    fs.copyFileSync('./view.html', '../build/public/view.html');

    console.log(`leave ${webDir}`);
    process.chdir(rootDir);

    console.log('Done!');
}

main();