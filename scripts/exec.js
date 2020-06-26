/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 *
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */

const { spawn } = require('child_process');

/**
 * Execute a command
 * @param {String} cmd bat or shell command
 * @param {Array} args parameter array
 * @param {Object} options exec options
 * @param {String} options.title the title before the output
 * @param {Boolean} options.showCmd whether to print the command
 * @param {Boolean} options.trimSpace whether to trim the space of output
 * @param {String} options.cwd current work directory
 * @returns a promise that the command ended
 */
function exec(cmd, args = [], options = {}) {
    if (options.showCmd === undefined) {
        options.showCmd = true;
    }
    options.showCmd && console.log(`${cmd} ${args.join(' ')}`);
    const cp = spawn(cmd, args, {
        cwd: options.cwd
    });
    cp.stdout.on('data', data => {
        let result = data.toString()
        if (options.trimSpace) {
            result = result.trim(' ');
        }
        if (options.title) {
            result = `${options.title}: ${result}`;
        }
        console.log(result);
    });
    cp.stderr.on('data', data => {
        console.error(data.toString());
    });
    return new Promise(resolve => {
        cp.on('close', () => {
            resolve();
        });
    });
}

module.exports = exec;