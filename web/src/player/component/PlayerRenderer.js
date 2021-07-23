/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import PlayerComponent from './PlayerComponent';
import EffectRenderer from '../../render/EffectRenderer';

/**
 * 播放器渲染器
 * @param {*} app 播放器
 */
class PlayerRenderer extends PlayerComponent {
    constructor(app) {
        super(app);
    }

    create(scene, camera, renderer) {
        this.renderer = new EffectRenderer();
        return this.renderer.create(scene, camera, renderer);
    }

    update(clock, deltaTime) { // eslint-disable-line
        this.renderer.render();
    }

    dispose() {
        this.renderer.dispose();
        this.renderer = null;
    }
}

export default PlayerRenderer;