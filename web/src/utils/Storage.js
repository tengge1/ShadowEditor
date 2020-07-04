/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
/**
 * 存储类
 */
class Storage {
    constructor() {
        // 向本地存储写入默认配置，并提供快捷访问方法
        const defaultConfigs = {
            debug: false, // 调试模式
            autoSave: false, // 自动保存

            // 视图相关
            assetsPanelShow: true,
            sidebarShow: true,
            toolbarShow: true,
            timelinePanelShow: true,
            statusBarShow: true,

            // 帮助器
            showStats: true, // 性能监视器
            showGrid: true, // 网格
            showViewHelper: true, // 视角帮助器
            showCamera: false,
            showPointLight: true,
            showDirectionalLight: true,
            showSpotLight: true,
            showHemisphereLight: true,
            showRectAreaLight: true,
            showSkeleton: false,

            // 选中效果
            selectMode: 'whole', // whole: 选择整体；part: 选择部分。
            selectedColor: '#ff6600', // unity3d: #ff6600
            selectedThickness: 4,

            // 高亮效果
            hoverEnabled: false, // 高亮效果
            hoveredColor: '#ffff00',

            // 编辑模式
            addMode: 'center', // 添加模式：center: 添加到场景中心；click: 点击场景添加。
            controlMode: 'EditorControls' // 控制器模式：EditorControls: 编辑器控制器；FreeControls: 自由控制器。
        };

        let configs = this._getConfigs();

        Object.entries(defaultConfigs).forEach(n => {
            if (configs[n[0]] === undefined) {
                configs[n[0]] = n[1];
            }

            Object.defineProperty(this, n[0], {
                get: () => {
                    return this.get(n[0]);
                },
                set: value => {
                    return this.set(n[0], value);
                }
            });
        });

        this._setConfigs(configs);
    }

    /**
     * 获取本地存储键值
     * @param {String} key 键
     * @returns {Object} 值，不存储返回undefined
     */
    get(key) {
        let configs = this._getConfigs();
        return configs[key];
    }

    /**
     * 设置本地存储
     * @param {String} key 键
     * @param {String} value 值
     */
    set(key, value) {
        let configs = this._getConfigs();
        configs[key] = value;
        this._setConfigs(configs);
        if (app.call) {
            app.call(`storageChanged`, this, key, value);
        } else {
            console.warn(`Storage: EventDispatcher has not been created.`);
        }
    }

    setConfigs(configs) {
        if (typeof configs !== 'object') {
            console.warn(`Storage: configs should be an object.`);
            return;
        }
        let _configs = this._getConfigs();
        Object.keys(configs).forEach(n => {
            _configs[n] = configs[n];
        });
        this._setConfigs(_configs);
    }

    remove(key) {
        let configs = this._getConfigs();
        delete configs[key];
        this._setConfigs(configs);
    }

    clear() {
        window.localStorage.removeItem('configs');
    }

    _getConfigs() {
        let configs = window.localStorage.getItem('configs');
        if (!configs) {
            configs = '{}';
        }
        return JSON.parse(configs);
    }

    _setConfigs(configs) {
        window.localStorage.setItem('configs', JSON.stringify(configs));
    }
}

export default Storage;