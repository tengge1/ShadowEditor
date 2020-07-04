/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseControls from './BaseControls';

/**
 * 编辑器控制器
 * @author tengge1 / https://github.com/tengge1
 */
class EditorControls extends BaseControls {
    constructor(camera, domElement) {
        super(camera, domElement);
        this.controls = new THREE.EditorControls(camera, domElement);
    }

    enable() {
        this.enabled = true;
        this.controls.enabled = true;
    }

    disable() {
        this.enabled = false;
        this.controls.enabled = false;
    }

    focus(target) {
        this.controls.focus(target);
    }

    dispose() {
        this.controls.dispose();
        this.camera = null;
        this.domElement = null;
    }
}

export default EditorControls;