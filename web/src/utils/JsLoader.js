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
 * JS下载器
 * @author tengge / https://github.com/tengge1
 */
function JsLoader() {
    this.assets = [];
}

JsLoader.prototype.load = function (url) {
    var data = {
        url,
        script: null
    };
    this.assets.push(data);
    return new Promise(resolve => {
        fetch(url).then(response => {
            if (response.ok) {
                response.text().then(text => {
                    data.script = text;
                    resolve(data);
                });
            } else {
                console.warn(`JsLoader: ${url} loaded failed.`);
                resolve(null);
            }
        }).catch(() => {
            console.warn(`JsLoader: ${url} loaded failed.`);
            resolve(null);
        });
    });
};

JsLoader.prototype.eval = function () {
    var eval2 = eval;

    var script = '';

    this.assets.forEach(n => {
        if (n.script) {
            script += n.script + '\n';
        }
    });

    if (script) {
        eval2.call(window, script);
    }
};

export default JsLoader;