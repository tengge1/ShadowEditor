/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseEvent from './BaseEvent';
import EffectRenderer from '../render/EffectRenderer';
import global from '../global';

/**
 * 渲染事件
 * @author tengge / https://github.com/tengge1
 */
function RenderEvent() {
    BaseEvent.call(this);

    this.clock = new THREE.Clock();

    this.running = true;

    this.render = this.render.bind(this);
    this.createRenderer = this.createRenderer.bind(this);
    this.onViewChanged = this.onViewChanged.bind(this);
}

RenderEvent.prototype = Object.create(BaseEvent.prototype);
RenderEvent.prototype.constructor = RenderEvent;

RenderEvent.prototype.start = function () {
    this.running = true;
    global.app.on(`appStarted.${this.id}`, this.render);
    global.app.on(`viewChanged.${this.id}`, this.onViewChanged);
};

RenderEvent.prototype.stop = function () {
    this.running = false;
    global.app.on(`appStarted.${this.id}`, null);
    global.app.on(`viewChanged.${this.id}`, null);
};

RenderEvent.prototype.render = function () {
    if (global.app.options.sceneType === 'GIS') {
        return;
    }

    const { scene, sceneHelpers } = global.app.editor;

    this.clock._getDelta(); // see: ../polyfills.js

    const deltaTime = this.clock.getDelta();

    global.app.call('animate', this, this.clock, deltaTime);

    global.app.stats.begin();

    scene.updateMatrixWorld();
    sceneHelpers.updateMatrixWorld();

    global.app.editor.renderer.clear();

    global.app.call('beforeRender', this, this.clock, deltaTime);

    if (this.renderer === undefined) {
        this.createRenderer().then(() => {
            this.render();
        });
        global.app.on(`sceneLoaded.${this.id}`, this.createRenderer);
        global.app.on(`postProcessingChanged.${this.id}`, this.createRenderer);
        return;
    } else {
        this.renderer.render();
    }

    global.app.call('afterRender', this, this.clock, deltaTime);

    global.app.stats.end();

    if (this.running) {
        requestAnimationFrame(this.render);
    }
};

RenderEvent.prototype.createRenderer = function () {
    const { scene, sceneHelpers, camera, renderer } = global.app.editor;

    this.renderer = new EffectRenderer();

    return this.renderer.create(
        [scene, sceneHelpers],
        global.app.editor.view === 'perspective' ? camera : global.app.editor.orthCamera,
        renderer
    );
};

RenderEvent.prototype.onViewChanged = function () {
    this.createRenderer();
};

export default RenderEvent;