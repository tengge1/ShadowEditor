/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 *
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */

const process = require('child_process');

/**
 * Execute a command
 * @param {String} cmd bat of shell command
 * @param {Boolean} showCmd whether to print the command
 * @returns the result of the command
 */
function exec(cmd, showCmd = true) {
    showCmd && console.log(cmd);
    return process.execSync(cmd).toString().trimRight('\n');
}

/**
 * The main function
 */
function main() {
    // unset go proxy
    console.log('unset go proxy');
    exec('go env -u GOPROXY');

    // unset nodejs proxy
    console.log('unset nodejs proxy');
    console.log('npm config set registry https://registry.npmjs.org/');

    // Output the current `go_proxy` and `node_proxy`.
    console.log(`current go proxy: ${exec('go env GOPROXY', false)}`);
    console.log(`current nodejs proxy: ${exec('npm config get registry', false)}`);

    console.log('Done!');
}

main();