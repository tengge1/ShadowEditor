/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
let ID = -1;

/**
 * 场景模板基类
 */
class BaseSceneTemplate {
    constructor() {
        this.id = `${this.constructor.name}${ID--}`;
    }

    /**
     * 用于子类初始化场景
     */
    create() {

    }

    /**
     * 清空场景
     */
    clear() {
        const editor = app.editor;

        editor.history.clear();
        editor.camera.copy(editor.DEFAULT_CAMERA);

        if (editor.audioListener && editor.camera.children.findIndex(o => o instanceof THREE.AudioListener) === -1) {
            editor.camera.add(editor.audioListener);
        }

        if (editor.scene.background instanceof THREE.Texture) {
            editor.scene.background = new THREE.Color(0xaaaaaa);
        } else if (editor.scene.background instanceof THREE.Color) {
            editor.scene.background.setHex(0xaaaaaa);
        }

        editor.scene.fog = null;

        editor.deselect();

        // 移除场景物体
        let objects = editor.scene.children;

        while (objects.length > 0) {
            editor.removeObject(objects[0]);
        }

        editor.scripts.length = 0;

        editor.animations.length = 0;

        // 场景信息
        editor.sceneID = null;
        editor.sceneName = null;
        app.options.sceneType = 'Empty';
        document.title = _t('No Name');
        app.editor.camera.userData.control = 'OrbitControls';
    }
}

export default BaseSceneTemplate;