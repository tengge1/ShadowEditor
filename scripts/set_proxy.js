/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 *
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */

const os = require('os');
const exec = require('./exec');

// IMPORTANT: This script is for Chinese users only!

/**
 * The main function
 */
async function main() {
    // For some well-known reasons, we can not install packages from golang.org in china;
    // and install packages from github.com is extremely slow.
    // So, we can set a proxy to make it faster to install third-party dependencies.
    console.log('set go proxy');
    await exec('go', ['env', '-w', 'GO111MODULE=on']);
    await exec('go', ['env', '-w', 'GOPROXY=https://goproxy.cn']);

    // For some well-known reasons, it is slow to install packages from https://www.npmjs.com/ in china.
    // So, we can set a proxy to make it faster to install third-party dependencies.
    console.log('set nodejs proxy');
    const npm = os.platform() === 'win32' ? 'npm.cmd' : 'npm';
    await exec(npm, ['config', 'set', 'registry', 'https://registry.npm.taobao.org/']);
    await exec(npm, ['config', 'set', 'disturl', 'https://npm.taobao.org/mirrors/node']);
    await exec(npm, ['config', 'set', 'ELECTRON_MIRROR', 'http://npm.taobao.org/mirrors/electron/']);

    // output current config
    console.log('\ncurrent config:');
    await exec('go', ['env', 'GOPROXY'], {
        title: 'current GOPROXY',
        showCmd: false,
        trimSpace: true
    });
    // TODO: the output of `npm config get` is wrong
    await exec(npm, ['config', 'get', 'registry'], {
        title: 'current registry',
        showCmd: false,
        trimSpace: true
    });
    await exec(npm, ['config', 'get', 'disturl'], {
        title: 'current disturl',
        showCmd: false,
        trimSpace: true
    });
    await exec(npm, ['config', 'get', 'ELECTRON_MIRROR'], {
        title: 'current ELECTRON_MIRROR',
        showCmd: false,
        trimSpace: true
    });

    // done
    console.log('Done!');
}

main();