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
import VolumeHemisphereLightHelper from './VolumeHemisphereLightHelper';

/**
 * 半球光帮助器
 * @author tengge / https://github.com/tengge1
 */
function HemisphereLightHelpers() {
    BaseHelper.call(this);

    this.helpers = [];
}

HemisphereLightHelpers.prototype = Object.create(BaseHelper.prototype);
HemisphereLightHelpers.prototype.constructor = HemisphereLightHelpers;

HemisphereLightHelpers.prototype.start = function () {
    app.on(`objectAdded.${this.id}`, this.onObjectAdded.bind(this));
    app.on(`objectRemoved.${this.id}`, this.onObjectRemoved.bind(this));
    app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
    app.on(`storageChanged.${this.id}`, this.onStorageChanged.bind(this));
};

HemisphereLightHelpers.prototype.stop = function () {
    app.on(`objectAdded.${this.id}`, null);
    app.on(`objectRemoved.${this.id}`, null);
    app.on(`objectChanged.${this.id}`, null);
    app.on(`storageChanged.${this.id}`, null);
};

HemisphereLightHelpers.prototype.onObjectAdded = function (object) {
    if (!object.isHemisphereLight) {
        return;
    }

    var helper = new VolumeHemisphereLightHelper(object, 1);

    helper.visible = app.storage.showHemisphereLight;

    this.helpers.push(helper);

    app.editor.sceneHelpers.add(helper);
};

HemisphereLightHelpers.prototype.onObjectRemoved = function (object) {
    if (!object.isHemisphereLight) {
        return;
    }

    var index = this.helpers.findIndex(n => {
        return n.light === object;
    });

    if (index === -1) {
        return;
    }

    app.editor.sceneHelpers.remove(this.helpers[index]);
    this.helpers[index].dispose();

    this.helpers.splice(index, 1);
};

HemisphereLightHelpers.prototype.onObjectChanged = function (object) {
    if (!object.isHemisphereLight) {
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

HemisphereLightHelpers.prototype.onStorageChanged = function (key, value) {
    if (key !== 'showHemisphereLight') {
        return;
    }

    this.helpers.forEach(n => {
        n.visible = value;
    });
};

export default HemisphereLightHelpers;