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
import VolumeSpotLightHelper from './VolumeSpotLightHelper';
import global from '../../global';

/**
 * 聚光灯帮助器
 * @author tengge / https://github.com/tengge1
 */
function SpotLightHelpers() {
    BaseHelper.call(this);

    this.helpers = [];
}

SpotLightHelpers.prototype = Object.create(BaseHelper.prototype);
SpotLightHelpers.prototype.constructor = SpotLightHelpers;

SpotLightHelpers.prototype.start = function () {
    global.app.on(`objectAdded.${this.id}`, this.onObjectAdded.bind(this));
    global.app.on(`objectRemoved.${this.id}`, this.onObjectRemoved.bind(this));
    global.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
    global.app.on(`storageChanged.${this.id}`, this.onStorageChanged.bind(this));
};

SpotLightHelpers.prototype.stop = function () {
    global.app.on(`objectAdded.${this.id}`, null);
    global.app.on(`objectRemoved.${this.id}`, null);
    global.app.on(`objectChanged.${this.id}`, null);
    global.app.on(`storageChanged.${this.id}`, null);
};

SpotLightHelpers.prototype.onObjectAdded = function (object) {
    if (!object.isSpotLight) {
        return;
    }

    var helper = new VolumeSpotLightHelper(object, 0xffffff);

    helper.visible = global.app.storage.showSpotLight;

    this.helpers.push(helper);

    global.app.editor.sceneHelpers.add(helper);
};

SpotLightHelpers.prototype.onObjectRemoved = function (object) {
    if (!object.isSpotLight) {
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

SpotLightHelpers.prototype.onObjectChanged = function (object) {
    if (!object.isSpotLight) {
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

SpotLightHelpers.prototype.onStorageChanged = function (key, value) {
    if (key !== 'showSpotLight') {
        return;
    }

    this.helpers.forEach(n => {
        n.visible = value;
    });
};

export default SpotLightHelpers;