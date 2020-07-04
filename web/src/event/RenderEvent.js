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
    app.on(`appStarted.${this.id}`, this.render);
    app.on(`viewChanged.${this.id}`, this.onViewChanged);
};

RenderEvent.prototype.stop = function () {
    this.running = false;
    app.on(`appStarted.${this.id}`, null);
    app.on(`viewChanged.${this.id}`, null);
};

RenderEvent.prototype.render = function () {
    if (app.options.sceneType === 'GIS') {
        return;
    }

    const { scene, sceneHelpers } = app.editor;

    this.clock._getDelta(); // see: ../polyfills.js

    const deltaTime = this.clock.getDelta();

    app.call('animate', this, this.clock, deltaTime);

    app.stats.begin();

    scene.updateMatrixWorld();
    sceneHelpers.updateMatrixWorld();

    app.editor.renderer.clear();

    app.call('beforeRender', this, this.clock, deltaTime);

    if (this.renderer === undefined) {
        this.createRenderer().then(() => {
            this.render();
        });
        app.on(`sceneLoaded.${this.id}`, this.createRenderer);
        app.on(`postProcessingChanged.${this.id}`, this.createRenderer);
        return;
    } else {
        this.renderer.render();
    }

    app.call('afterRender', this, this.clock, deltaTime);

    app.stats.end();

    if (this.running) {
        requestAnimationFrame(this.render);
    }
};

RenderEvent.prototype.createRenderer = function () {
    const { scene, sceneHelpers, camera, renderer } = app.editor;

    this.renderer = new EffectRenderer();

    return this.renderer.create(
        [scene, sceneHelpers],
        app.editor.view === 'perspective' ? camera : app.editor.orthCamera,
        renderer
    );
};

RenderEvent.prototype.onViewChanged = function () {
    this.createRenderer();
};

export default RenderEvent;