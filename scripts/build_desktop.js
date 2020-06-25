/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 *
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */

const subprocess = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const iconv = require('iconv-lite');

/**
 * Execute a command
 * @param {String} cmd bat of shell command
 * @param {Boolean} showCmd whether to print the command
 * @returns the result of the command
 */
function exec(cmd, showCmd = true) {
    showCmd && console.log(cmd);
    return iconv.decode(subprocess.execSync(cmd), 'cp936').trimRight('\n');
}

/**
 * The main function
 */
async function main() {
    const rootDir = process.cwd(); // The root dir that contains `README.md`.
    const buildDir = path.join(rootDir, 'build'); // The build dir.
    const mongoDir = path.join(rootDir, 'utils', 'mongodb'); // Download and unzip mongodb here.

    console.log(`root dir: ${rootDir}`);
    console.log(`build dir: ${buildDir}`);
    console.log(`mongo dir: ${mongoDir}`);

    // check build
    if (!fs.existsSync(buildDir)) {
        console.warn('You should run `npm run build` first.');
        return;
    }

    // check mongodb
    const isWin32 = os.platform() === 'win32';
    const mongoPath = path.join(mongoDir, isWin32 ? 'mongo.exe' : 'mongo');
    const mongodPath = path.join(mongoDir, isWin32 ? 'mongod.exe' : 'mongod');
    if (!fs.existsSync(mongoPath) || !fs.existsSync(mongodPath)) {
        console.warn('You should download mongodb first. See `utils/mongodb/README.md` for detail.');
        return;
    }

    // copy files needed by desktop app
    fs.copySync(mongoDir, 'build/mongo');
    fs.copySync('scripts/electron/main.js', 'build/main.js');

    // Build desktop package
    console.log('enter build');
    process.chdir(buildDir);

    const package = JSON.parse(fs.readFileSync('../package.json').toString());
    const version = package.version;

    exec('electron-packager . ShadowEditor --platform=win32 ' +
        `--arch=x64 --icon=../web/favicon.ico --out=desktop --app-version=${version} ` +
        '--overwrite --no-prune --ignore="public/Upload" ' +
        '--electron-version 9.0.4 ' +
        '--download.mirrorOptions.mirror="http://npm.taobao.org/mirrors/electron/' // Only need in China
    );

    console.log('leave build');
    process.chdir(rootDir);

    console.log('Done!');
}

main();