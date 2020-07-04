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
import Converter from '../serialization/Converter';
// import GISScene from '../gis/Scene';

/**
 * 加载场景事件
 * @author tengge / https://github.com/tengge1
 */
function LoadSceneEvent() {
    BaseEvent.call(this);
}

LoadSceneEvent.prototype = Object.create(BaseEvent.prototype);
LoadSceneEvent.prototype.constructor = LoadSceneEvent;

LoadSceneEvent.prototype.start = function () {
    app.on(`load.${this.id}`, this.onLoad.bind(this));
    app.on(`loadSceneList.${this.id}`, this.onLoadSceneList.bind(this));
};

LoadSceneEvent.prototype.stop = function () {
    app.on(`load.${this.id}`, null);
    app.on(`loadSceneObj.${this.id}`, null);
};

LoadSceneEvent.prototype.onLoad = function (url, name, id) { // id: MongoDB _id
    if (!name || name.trim() === '') {
        name = _t('No Name');
    }

    // 新增场景id为null，不需要创建；否则导致保存示例场景报错。
    // if (!id) {
    //     id = THREE.Math.generateUUID();
    // }

    app.editor.clear(false);
    document.title = name;

    app.mask(_t('Loading...'));

    fetch(url).then(response => {
        response.json().then(obj => {
            if (obj.Code !== 200) {
                app.toast(_t(obj.Msg), 'warn');
                return;
            }

            this.onLoadSceneList(obj.Data, name, id);
        });
    });
};

LoadSceneEvent.prototype.onLoadSceneList = function (list, name, id) {
    app.mask(_t('Loading...'));

    new Converter().fromJson(list, {
        server: app.options.server,
        camera: app.editor.camera,
        domWidth: app.editor.renderer.domElement.width,
        domHeight: app.editor.renderer.domElement.height
    }).then(obj => {
        this.onLoadScene(obj);

        app.editor.sceneID = id || 0;
        app.editor.sceneName = name || _t('No Name');
        document.title = app.editor.sceneName;

        if (obj.options) {
            app.call('optionsChanged', this);

            // if (obj.options.sceneType === 'GIS') {
            //     if (app.editor.gis) {
            //         app.editor.gis.stop();
            //     }
            //     app.editor.gis = new GISScene(app, {
            //         useCameraPosition: true
            //     });
            //     app.editor.gis.start();
            // }
        }

        if (obj.scripts) {
            app.call('scriptChanged', this);
        }

        if (obj.scene) {
            app.call('sceneGraphChanged', this);
        }

        app.unmask();
    });
};

LoadSceneEvent.prototype.onLoadScene = function (obj) {
    if (obj.options) {
        Object.assign(app.options, obj.options);
    }

    if (obj.camera) {
        app.editor.camera.remove(app.editor.audioListener);
        app.editor.camera.copy(obj.camera);

        let audioListener = app.editor.camera.children.filter(n => n instanceof THREE.AudioListener)[0];

        if (audioListener) {
            app.editor.audioListener = audioListener;
        }
    }

    if (obj.renderer) {
        var viewport = app.viewport;
        var oldRenderer = app.editor.renderer;

        viewport.removeChild(oldRenderer.domElement);
        viewport.appendChild(obj.renderer.domElement);
        app.editor.renderer = obj.renderer;
        app.editor.renderer.setSize(viewport.offsetWidth, viewport.offsetHeight);
        app.call('resize', this);
    }

    if (obj.scripts) {
        Object.assign(app.editor.scripts, obj.scripts);
    }

    if (obj.animations) {
        Object.assign(app.editor.animations, obj.animations);
    } else {
        app.editor.animations = [{
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

    if (obj.scene) {
        app.editor.setScene(obj.scene);
    }

    app.editor.camera.updateProjectionMatrix();

    if (obj.options.selected) {
        var selected = app.editor.objectByUuid(obj.options.selected);
        if (selected) {
            app.editor.select(selected);
        }
    }

    // 可视化
    // if (obj.visual) {
    //     app.editor.visual.fromJSON(obj.visual);
    // } else {
    // app.editor.visual.clear();
    // }
    // app.editor.visual.render(app.editor.svg);

    app.call('sceneLoaded', this);
    app.call('animationChanged', this);
};

export default LoadSceneEvent;