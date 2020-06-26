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
const exec = require('./exec');

const cmds = [
    'go env -w GO111MODULE=on',

    'go get -u golang.org/x/tools/cmd/guru',
    'go get -u golang.org/x/tools/cmd/gorename',
    'go get -u golang.org/x/tools/cmd/goimports',
    'go get -u golang.org/x/lint/golint',
    'go get -u golang.org/x/tools/cmd/godoc',
    'go get -u golang.org/x/tools/gopls',

    'go get -u github.com/uudashr/gopkgs/v2/cmd/gopkgs',
    'go get -u github.com/acroca/go-symbols',
    'go get -u github.com/cweill/gotests/...',
    'go get -u github.com/fatih/gomodifytags',
    'go get -u github.com/josharian/impl',
    'go get -u github.com/davidrjenni/reftools/cmd/fillstruct',
    'go get -u github.com/haya14busa/goplay/cmd/goplay',
    'go get -u github.com/godoctor/godoctor',
    'go get -u github.com/go-delve/delve/cmd/dlv',
    'go get -u github.com/zmb3/gogetdoc',
    'go get -u github.com/rogpeppe/godef',
    'go get -u github.com/ramya-rao-a/go-outline',
    'go get -u github.com/sqs/goreturns',
    'go get -u github.com/tylerb/gotype-live',
    'go get -u github.com/sourcegraph/go-langserver',
    'go get -u github.com/stamblerre/gocode'
];

/**
 * The main function
 */
async function main() {
    const currentDir = process.cwd();
    const serverDir = path.join(currentDir, 'server');
    console.log(`enter ${serverDir}`);
    process.chdir(serverDir);

    // install the golang development dependencies
    for (let n of cmds) {
        let args = n.split(' ');
        let cmd = args.shift(0);
        try {
            await exec(cmd, args);
        } catch {
            console.warn(`${n} failed`);
        }
    }

    console.log(`leave ${serverDir}`);
    process.chdir(currentDir);

    console.log('Done!');
}

main();