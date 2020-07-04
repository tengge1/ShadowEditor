/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseSceneTemplate from './BaseSceneTemplate';

/**
 * 空场景模板
 */
class EmptySceneTemplate extends BaseSceneTemplate {
    create() {
        const editor = app.editor;

        // 添加场景物体
        const amlight = new THREE.AmbientLight(0xffffff, 0.24);
        amlight.name = _t('Ambient');
        editor.addObject(amlight);

        const dirlight = new THREE.DirectionalLight(0xffffff, 0.56);
        dirlight.name = _t('Directional');
        dirlight.castShadow = true;
        dirlight.position.set(5, 10, 7.5);
        dirlight.shadow.radius = 0;
        dirlight.shadow.mapSize.x = 2048;
        dirlight.shadow.mapSize.y = 2048;
        dirlight.shadow.camera.left = -20;
        dirlight.shadow.camera.right = 20;
        dirlight.shadow.camera.top = 20;
        dirlight.shadow.camera.bottom = -20;
        dirlight.shadow.camera.near = 0.1;
        dirlight.shadow.camera.far = 500;

        editor.addObject(dirlight);

        // 添加场景动画
        editor.animations = [{
            id: null,
            uuid: THREE.Math.generateUUID(),
            layer: 0,
            layerName: _t('AnimLayer1'),
            animations: []
        }, {
            id: null,
            uuid: THREE.Math.generateUUID(),
            layer: 1,
            layerName: _t('AnimLayer2'),
            animations: []
        }, {
            id: null,
            uuid: THREE.Math.generateUUID(),
            layer: 2,
            layerName: _t('AnimLayer3'),
            animations: []
        }];
    }
}

export default EmptySceneTemplate;