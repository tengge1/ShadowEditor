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
import global from '../global';

/**
 * 网格帮助器
 * @author tengge / https://github.com/tengge1
 */
class GridHelper extends BaseHelper {
    constructor() {
        super();
    }

    start() {
        global.app.on(`storageChanged.${this.id}`, this.onStorageChanged.bind(this));
        this.update();
    }

    stop() {
        global.app.on(`appStarted.${this.id}`, null);

        if (this.helper) {
            var scene = global.app.editor.sceneHelpers;
            scene.remove(this.helper);
            delete this.helper;
        }
    }

    update() {
        var showGrid = global.app.storage.showGrid;

        if (!this.helper) {
            this.helper = new THREE.GridHelper(30, 30, 0x444444, 0x888888);

            var array = this.helper.geometry.attributes.color.array;

            for (let i = 0; i < array.length; i += 60) {
                for (let j = 0; j < 12; j++) {
                    array[i + j] = 0.26;
                }
            }
        }

        var scene = global.app.editor.sceneHelpers;

        if (showGrid && this.helper.parent !== scene) {
            scene.add(this.helper);
        } else if (!showGrid && this.helper.parent === scene) {
            scene.remove(this.helper);
        }
    }

    onStorageChanged(key) {
        if (key === 'showGrid') {
            this.update();
        }
    }
}

export default GridHelper;