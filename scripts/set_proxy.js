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

// IMPORTANT: This script is for Chinese users only!

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
    // For some well-known reasons, we can not install packages from golang.org in china;
    // and install packages from github.com is extremely slow.
    // So, we can set a proxy to make it faster to install third-party dependencies.
    console.log('set go proxy');
    exec('go env -w GO111MODULE=on');
    exec('go env -w GOPROXY=https://goproxy.cn');

    // For some well-known reasons, it is slow to install packages from https://www.npmjs.com/ in china.
    // So, we can set a proxy to make it faster to install third-party dependencies.
    console.log('set nodejs proxy');
    console.log('npm config set registry https://registry.npm.taobao.org/');

    // Output the current `go_proxy` and `node_proxy`.
    console.log(`current go proxy: ${exec('go env GOPROXY', false)}`);
    console.log(`current nodejs proxy: ${exec('npm config get registry', false)}`);
}

main()