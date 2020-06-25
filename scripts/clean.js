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
const fs = require('fs-extra');

/**
 * Execute a command
 * @param {String} cmd bat of shell command
 * @param {Boolean} showCmd whether to print the command
 * @returns the result of the command
 */
function exec(cmd, showCmd = true) {
    showCmd && console.log(cmd);
    return subprocess.execSync(cmd).toString().trimRight('\n');
}

/**
 * The main function
 */
function main() {
    const list = [
        'build/logs',
        'build/public/assets',
        'build/public/build',
        'build/public/locales',
        'build/public/temp',
        'build/public/favicon.ico',
        'build/public/index.html',
        'build/public/manifest.json',
        'build/public/sw.js',
        'build/public/view.html',
        'build/config.toml',
        'build/ShadowEditor',
        'build/ShadowEditor.exe'
    ];

    list.forEach(n => {
        if (!fs.existsSync(n)) {
            return;
        }
        fs.removeSync(n);
    });

    console.log('Done!');
}

main();