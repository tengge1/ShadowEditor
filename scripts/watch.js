/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 *
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */

const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs-extra');

const rootDir = process.cwd(); // The root dir that contains `README.md`.
const webDir = path.join(rootDir, 'web'); // The web dir.

process.chdir(webDir);

chokidar.watch('./index.html').on('change', function (){
    fs.copyFileSync('./index.html', '../build/public/index.html');
    console.log('Copy index.html to ../build/public/index.html');
});

chokidar.watch('./assets').on('change', function (){
    fs.copySync('./assets', '../build/public/assets');
    console.log('Copy ./assets to ../build/public/assets');
});

chokidar.watch('./locales').on('change', function (){
    fs.copySync('./locales', '../build/public/locales');
    console.log('Copy ./locales to ../build/public/locales');
});

chokidar.watch('./favicon.ico').on('change', function (){
    fs.copyFileSync('./favicon.ico', '../build/public/favicon.ico');
    console.log('Copy ./favicon.ico to ../build/public/favicon.ico');
});

chokidar.watch('./manifest.json').on('change', function (){
    fs.copyFileSync('./manifest.json', '../build/public/manifest.json');
    console.log('Copy ./manifest.json ../build/public/manifest.json');
});

chokidar.watch('./sw.js').on('change', function (){
    fs.copyFileSync('./sw.js', '../build/public/sw.js');
    console.log('Copy ./sw.js to  ../build/public/sw.js');
});

chokidar.watch('./view.html').on('change', function (){
    fs.copyFileSync('./view.html', '../build/public/view.html');
    console.log('Copy ./view.html to  ../build/public/view.html');
});