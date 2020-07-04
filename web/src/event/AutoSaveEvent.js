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
import TimeUtils from '../utils/TimeUtils';

/**
 * 自动保存事件
 * @author tengge / https://github.com/tengge1
 */
class AutoSaveEvent extends BaseEvent {
    constructor() {
        super();

        this.autoSave = true;
        this.autoSaveTime = 10000; // 自动保存时间
        this.saveProcess = null;
        this.queryLoad = false; // 是否正在询问加载自动保存场景

        this.handleSave = this.handleSave.bind(this);
        this.handleLoad = this.handleLoad.bind(this);

        this.handleStorageChange = this.handleStorageChange.bind(this);
    }

    start() {
        this.autoSave = app.storage.autoSave;
        app.on(`storageChanged.${this.id}`, this.handleStorageChange);
        app.on(`queryLoadAutoSceneScene.${this.id}`, this.handleLoad);

        if (this.autoSave) {
            this.saveProcess = setTimeout(this.handleSave, this.autoSaveTime);
        }
    }

    stop() {
        app.on(`storageChanged.${this.id}`, null);
    }

    handleSave() {
        if (this.saveProcess) {
            clearTimeout(this.saveProcess);
        }

        // 正在询问是否加载自动保存的场景，避免自动保存功能将原来的场景覆盖。
        if (this.queryLoad) {
            if (this.autoSave) {
                this.saveProcess = setTimeout(this.handleSave, this.autoSaveTime);
            }
            return;
        }

        const editor = app.editor;
        const obj = new Converter().toJSON({
            options: app.options,
            camera: editor.camera,
            renderer: editor.renderer,
            scripts: editor.scripts,
            animations: editor.animations,
            scene: editor.scene,
            visual: editor.visual
        });

        const now = TimeUtils.getDateTime('yyyy-MM-dd HH:mm:ss');

        window.localStorage.setItem('autoSaveData', JSON.stringify(obj));
        window.localStorage.setItem('autoSaveTime', now);
        window.localStorage.setItem('autoSaveSceneID', app.editor.sceneID);
        window.localStorage.setItem('autoSaveSceneName', app.editor.sceneName);

        console.log(`${now}, scene auto saved.`);

        if (this.autoSave) {
            this.saveProcess = setTimeout(this.handleSave, this.autoSaveTime);
        }
    }

    handleLoad() {
        const autoSaveTime = window.localStorage.getItem('autoSaveTime');
        const autoSaveData = window.localStorage.getItem('autoSaveData');
        const autoSaveSceneID = window.localStorage.getItem('autoSaveSceneID');
        const autoSaveSceneName = window.localStorage.getItem('autoSaveSceneName');

        if (!autoSaveData) {
            return;
        }

        this.queryLoad = true;

        app.confirm({
            title: _t('Load Scene'),
            content: _t('An auto-save scene was detected. Load?') + ` (${autoSaveTime})`,
            cancelText: _t('Clear'),
            onOK: () => {
                this.queryLoad = false;
                this.commitLoadScene(autoSaveData, autoSaveSceneName, autoSaveSceneID);
            },
            onCancel: () => {
                window.localStorage.removeItem('autoSaveTime');
                window.localStorage.removeItem('autoSaveData');
                window.localStorage.removeItem('autoSaveSceneID');
                window.localStorage.removeItem('autoSaveSceneName');
                app.toast(_t('Auto-save scene is cleared.'));
                this.queryLoad = false;
            }
        });
    }

    commitLoadScene(data, name, id) {
        var obj = JSON.parse(data);
        if (obj) {
            app.call(`loadSceneList`, this, obj, name, id);
        }
    }

    handleStorageChange(name, value) {
        if (name !== 'autoSave') {
            return;
        }
        this.autoSave = value;

        if (this.autoSave) {
            if (this.saveProcess) {
                clearTimeout(this.saveProcess);
            }
            this.saveProcess = setTimeout(this.handleSave, this.autoSaveTime);
        }
    }
}

export default AutoSaveEvent;