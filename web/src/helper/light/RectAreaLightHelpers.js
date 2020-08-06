/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseHelper from '../BaseHelper';
import VolumeRectAreaLightHelper from './VolumeRectAreaLightHelper';
import global from '../../global';

/**
 * 矩形光帮助器
 * @author tengge / https://github.com/tengge1
 */
function RectAreaLightHelpers() {
    BaseHelper.call(this);

    this.helpers = [];
}

RectAreaLightHelpers.prototype = Object.create(BaseHelper.prototype);
RectAreaLightHelpers.prototype.constructor = RectAreaLightHelpers;

RectAreaLightHelpers.prototype.start = function () {
    global.app.on(`objectAdded.${this.id}`, this.onObjectAdded.bind(this));
    global.app.on(`objectRemoved.${this.id}`, this.onObjectRemoved.bind(this));
    global.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
    global.app.on(`storageChanged.${this.id}`, this.onStorageChanged.bind(this));
};

RectAreaLightHelpers.prototype.stop = function () {
    global.app.on(`objectAdded.${this.id}`, null);
    global.app.on(`objectRemoved.${this.id}`, null);
    global.app.on(`objectChanged.${this.id}`, null);
    global.app.on(`storageChanged.${this.id}`, null);
};

RectAreaLightHelpers.prototype.onObjectAdded = function (object) {
    if (!object.isRectAreaLight) {
        return;
    }

    var helper = new VolumeRectAreaLightHelper(object, 0xffffff);

    helper.visible = global.app.storage.showRectAreaLight;

    this.helpers.push(helper);

    global.app.editor.sceneHelpers.add(helper);
};

RectAreaLightHelpers.prototype.onObjectRemoved = function (object) {
    if (!object.isRectAreaLight) {
        return;
    }

    var index = this.helpers.findIndex(n => {
        return n.light === object;
    });

    if (index === -1) {
        return;
    }

    global.app.editor.sceneHelpers.remove(this.helpers[index]);

    this.helpers[index].dispose();

    this.helpers.splice(index, 1);
};

RectAreaLightHelpers.prototype.onObjectChanged = function (object) {
    if (!object.isRectAreaLight) {
        return;
    }

    var index = this.helpers.findIndex(n => {
        return n.light === object;
    });

    if (index === -1) {
        return;
    }

    this.helpers[index].update();
};

RectAreaLightHelpers.prototype.onStorageChanged = function (key, value) {
    if (key !== 'showRectAreaLight') {
        return;
    }

    this.helpers.forEach(n => {
        n.visible = value;
    });
};

export default RectAreaLightHelpers;