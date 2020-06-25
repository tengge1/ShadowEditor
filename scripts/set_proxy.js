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

const cmds = [
    // For some well-known reasons, we can not install packages from golang.org in china;
    // and install packages from github.com is extremely slow.
    // So, we can set a proxy to make it faster to install third-party dependencies.
    'echo set go proxy',
    'go env -w GO111MODULE=on',
    'go env -w GOPROXY=https://goproxy.cn',

    // For some well-known reasons, it is slow to install packages from https://www.npmjs.com/ in china.
    // So, we can set a proxy to make it faster to install third-party dependencies.
    'echo set nodejs proxy',
    'npm config set registry https://registry.npm.taobao.org/',

    // Output the current `go_proxy` and `node_proxy`.
    'echo current go proxy: $(go env GOPROXY)',
    'echo current nodejs proxy: $(npm config get registry)'
];

var buf = process.execSync('go env GOPROXY');
console.log(buf.toString());
