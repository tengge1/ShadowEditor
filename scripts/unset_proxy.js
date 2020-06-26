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

/**
 * The main function
 */
async function main() {
    // unset go proxy
    console.log('unset go proxy');
    await exec('go', ['env', '-u', 'GOPROXY']);

    // unset nodejs proxy
    console.log('unset nodejs proxy');
    const npm = os.platform() === 'win32' ? 'npm.cmd' : 'npm';
    await exec(npm, ['config', 'delete', 'registry']);
    await exec(npm, ['config', 'delete', 'disturl']);
    await exec(npm, ['config', 'delete', 'ELECTRON_MIRROR']);

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