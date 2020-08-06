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
import VolumeDirectionalLightHelper from './VolumeDirectionalLightHelper';
import global from '../../global';

/**
 * 平行光帮助器
 * @author tengge / https://github.com/tengge1
 */
function DirectionalLightHelpers() {
    BaseHelper.call(this);

    this.helpers = [];
}

DirectionalLightHelpers.prototype = Object.create(BaseHelper.prototype);
DirectionalLightHelpers.prototype.constructor = DirectionalLightHelpers;

DirectionalLightHelpers.prototype.start = function () {
    global.app.on(`objectAdded.${this.id}`, this.onObjectAdded.bind(this));
    global.app.on(`objectRemoved.${this.id}`, this.onObjectRemoved.bind(this));
    global.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
    global.app.on(`storageChanged.${this.id}`, this.onStorageChanged.bind(this));
};

DirectionalLightHelpers.prototype.stop = function () {
    global.app.on(`objectAdded.${this.id}`, null);
    global.app.on(`objectRemoved.${this.id}`, null);
    global.app.on(`objectChanged.${this.id}`, null);
    global.app.on(`storageChanged.${this.id}`, null);
};

DirectionalLightHelpers.prototype.onObjectAdded = function (object) {
    if (!object.isDirectionalLight) {
        return;
    }

    var helper = new VolumeDirectionalLightHelper(object, 1);

    helper.visible = global.app.storage.showDirectionalLight;
    
    this.helpers.push(helper);

    global.app.editor.sceneHelpers.add(helper);
};

DirectionalLightHelpers.prototype.onObjectRemoved = function (object) {
    if (!object.isDirectionalLight) {
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

DirectionalLightHelpers.prototype.onObjectChanged = function (object) {
    if (!object.isDirectionalLight) {
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

DirectionalLightHelpers.prototype.onStorageChanged = function (key, value) {
    if (key !== 'showDirectionalLight') {
        return;
    }

    this.helpers.forEach(n => {
        n.visible = value;
    });
};

export default DirectionalLightHelpers;