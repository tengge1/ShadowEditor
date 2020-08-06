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
import global from '../global';

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
    global.app.on(`load.${this.id}`, this.onLoad.bind(this));
    global.app.on(`loadSceneList.${this.id}`, this.onLoadSceneList.bind(this));
};

LoadSceneEvent.prototype.stop = function () {
    global.app.on(`load.${this.id}`, null);
    global.app.on(`loadSceneObj.${this.id}`, null);
};

LoadSceneEvent.prototype.onLoad = function (url, name, id) { // id: MongoDB _id
    if (!name || name.trim() === '') {
        name = _t('No Name');
    }

    // 新增场景id为null，不需要创建；否则导致保存示例场景报错。
    // if (!id) {
    //     id = THREE.Math.generateUUID();
    // }

    global.app.editor.clear(false);
    document.title = name;

    global.app.mask(_t('Loading...'));

    fetch(url).then(response => {
        response.json().then(obj => {
            if (obj.Code !== 200) {
                global.app.toast(_t(obj.Msg), 'warn');
                return;
            }

            this.onLoadSceneList(obj.Data, name, id);
        });
    });
};

LoadSceneEvent.prototype.onLoadSceneList = function (list, name, id) {
    global.app.mask(_t('Loading...'));

    new Converter().fromJson(list, {
        server: global.app.options.server,
        camera: global.app.editor.camera,
        domWidth: global.app.editor.renderer.domElement.width,
        domHeight: global.app.editor.renderer.domElement.height
    }).then(obj => {
        this.onLoadScene(obj);

        global.app.editor.sceneID = id || 0;
        global.app.editor.sceneName = name || _t('No Name');
        document.title = global.app.editor.sceneName;

        if (obj.options) {
            global.app.call('optionsChanged', this);

            // if (obj.options.sceneType === 'GIS') {
            //     if (global.app.editor.gis) {
            //         global.app.editor.gis.stop();
            //     }
            //     global.app.editor.gis = new GISScene(global.app, {
            //         useCameraPosition: true
            //     });
            //     global.app.editor.gis.start();
            // }
        }

        if (obj.scripts) {
            global.app.call('scriptChanged', this);
        }

        if (obj.scene) {
            global.app.call('sceneGraphChanged', this);
        }

        global.app.unmask();
    });
};

LoadSceneEvent.prototype.onLoadScene = function (obj) {
    if (obj.options) {
        Object.assign(global.app.options, obj.options);
    }

    if (obj.camera) {
        global.app.editor.camera.remove(global.app.editor.audioListener);
        global.app.editor.camera.copy(obj.camera);

        let audioListener = global.app.editor.camera.children.filter(n => n instanceof THREE.AudioListener)[0];

        if (audioListener) {
            global.app.editor.audioListener = audioListener;
        }
    }

    if (obj.renderer) {
        var viewport = global.app.viewport;
        var oldRenderer = global.app.editor.renderer;

        viewport.removeChild(oldRenderer.domElement);
        viewport.appendChild(obj.renderer.domElement);
        global.app.editor.renderer = obj.renderer;
        global.app.editor.renderer.setSize(viewport.offsetWidth, viewport.offsetHeight);
        global.app.call('resize', this);
    }

    if (obj.scripts) {
        Object.assign(global.app.editor.scripts, obj.scripts);
    }

    if (obj.animations) {
        Object.assign(global.app.editor.animations, obj.animations);
    } else {
        global.app.editor.animations = [{
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
        global.app.editor.setScene(obj.scene);
    }

    global.app.editor.camera.updateProjectionMatrix();

    if (obj.options.selected) {
        var selected = global.app.editor.objectByUuid(obj.options.selected);
        if (selected) {
            global.app.editor.select(selected);
        }
    }

    // 可视化
    // if (obj.visual) {
    //     global.app.editor.visual.fromJSON(obj.visual);
    // } else {
    // global.app.editor.visual.clear();
    // }
    // global.app.editor.visual.render(global.app.editor.svg);

    global.app.call('sceneLoaded', this);
    global.app.call('animationChanged', this);
};

export default LoadSceneEvent;