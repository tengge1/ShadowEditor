/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseHelper from './BaseHelper';

/**
 * 网格帮助器
 * @author tengge / https://github.com/tengge1
 */
function GridHelper() {
    BaseHelper.call(this);
}

GridHelper.prototype = Object.create(BaseHelper.prototype);
GridHelper.prototype.constructor = GridHelper;

GridHelper.prototype.start = function () {
    app.on(`storageChanged.${this.id}`, this.onStorageChanged.bind(this));
    this.update();
};

GridHelper.prototype.stop = function () {
    app.on(`appStarted.${this.id}`, null);

    if (this.helper) {
        var scene = app.editor.sceneHelpers;
        scene.remove(this.helper);
        delete this.helper;
    }
};

GridHelper.prototype.update = function () {
    var showGrid = app.storage.showGrid;

    if (!this.helper) {
        this.helper = new THREE.GridHelper(30, 30, 0x444444, 0x888888);

        var array = this.helper.geometry.attributes.color.array;

        for (let i = 0; i < array.length; i += 60) {
            for (let j = 0; j < 12; j++) {
                array[i + j] = 0.26;
            }
        }
    }

    var scene = app.editor.sceneHelpers;

    if (showGrid && this.helper.parent !== scene) {
        scene.add(this.helper);
    } else if (!showGrid && this.helper.parent === scene) {
        scene.remove(this.helper);
    }
};

GridHelper.prototype.onStorageChanged = function (key) {
    if (key === 'showGrid') {
        this.update();
    }
};

export default GridHelper;