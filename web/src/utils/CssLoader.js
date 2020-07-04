/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
/**
 * CSS下载器
 * @author tengge / https://github.com/tengge1
 */
function CssLoader() {

}

CssLoader.prototype.load = function (url) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    head.appendChild(link);

    return new Promise(resolve => {
        link.onload = event => {
            link.onload = link.onerror = null;
            resolve(link, event);
        };
        link.onerror = event => {
            link.onload = link.onerror = null;
            console.warn(`CssLoader: ${url} loaded failed.`);
            resolve(null, event);
        };
    });
};

export default CssLoader;