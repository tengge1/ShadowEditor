/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
window.URL = window.URL || window.webkitURL;
window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;

Number.prototype.format = function () {
    return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

String.prototype.format = function () {
    var str = this;
    for (var i = 0; i < arguments.length; i++) {
        str = str.replace('{' + i + '}', arguments[i]);
    }
    return str;
};

// 在一个渲染循环中，getDelta和getElapsedTime只能调用一次，否则会导致动画异常。
// 这里改成可以调用多次，避免产生各种奇怪的bug。

THREE.Clock.prototype._getDelta = function () {
    var diff = 0;

    if (this.autoStart && !this.running) {

        this.start();
        return 0;

    }

    if (this.running) {

        var newTime = (typeof performance === 'undefined' ? Date : performance).now();

        diff = (newTime - this.oldTime) / 1000;
        this.oldTime = newTime;

        this.elapsedTime += diff;

    }

    this.deltaTime = diff;

    return diff;
};

THREE.Clock.prototype.getDelta = function () {
    return this.deltaTime ? this.deltaTime : 0;
};

THREE.Clock.prototype.getElapsedTime = function () {
    return this.elapsedTime;
};