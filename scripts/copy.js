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

/**
 * The main function
 */
async function main() {
    const rootDir = process.cwd(); // The root dir that contains `README.md`.
    const webDir = path.join(rootDir, 'web'); // The web dir.

    process.chdir(webDir);
    console.log(`copy files...`);
    fs.copySync('./assets', '../build/public/assets');
    fs.copySync('./locales', '../build/public/locales');
    fs.copyFileSync('./favicon.ico', '../build/public/favicon.ico');
    fs.copyFileSync('./index.html', '../build/public/index.html');
    fs.copyFileSync('./manifest.json', '../build/public/manifest.json');
    fs.copyFileSync('./sw.js', '../build/public/sw.js');
    fs.copyFileSync('./view.html', '../build/public/view.html');
    console.log('Done!');
}

main();