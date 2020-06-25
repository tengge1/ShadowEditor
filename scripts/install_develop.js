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

const cmds = [
    'go env -w GO111MODULE=on',

    'go get -u golang.org/x/tools/cmd/guru',
    'go get -u golang.org/x/tools/cmd/gorename',
    'go get -u golang.org/x/tools/cmd/goimports',
    'go get -u golang.org/x/lint/golint',
    'go get -u golang.org/x/tools/cmd/godoc',
    'go get -u -v golang.org/x/tools/gopls',

    'go get -u -v github.com/uudashr/gopkgs/v2/cmd/gopkgs',
    'go get -u -v github.com/acroca/go-symbols',
    'go get -u -v github.com/cweill/gotests/...',
    'go get -u -v github.com/fatih/gomodifytags',
    'go get -u -v github.com/josharian/impl',
    'go get -u -v github.com/davidrjenni/reftools/cmd/fillstruct',
    'go get -u -v github.com/haya14busa/goplay/cmd/goplay',
    'go get -u -v github.com/godoctor/godoctor',
    'go get -u -v github.com/go-delve/delve/cmd/dlv',
    'go get -u -v github.com/zmb3/gogetdoc',
    'go get -u -v github.com/rogpeppe/godef',
    'go get -u -v github.com/ramya-rao-a/go-outline',
    'go get -u -v github.com/sqs/goreturns',
    'go get -u -v github.com/tylerb/gotype-live',
    'go get -u -v github.com/sourcegraph/go-langserver',
    'go get -u -v github.com/stamblerre/gocode'
];

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
    const currentDir = process.cwd();
    const serverDir = path.join(currentDir, 'server');
    console.log(`enter ${serverDir}`);
    process.chdir(serverDir);

    // install the golang development dependencies
    cmds.forEach(n => {
        console.log(exec(n));
    });

    console.log(`leave ${serverDir}`);
    process.chdir(currentDir);

    console.log('Done!');
}

main();