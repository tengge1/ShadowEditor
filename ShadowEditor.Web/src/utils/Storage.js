/**
 * 存储类
 */
function Storage() {
    if (this.get('showGrid') === undefined) {
        this.set('showGrid', true);
    }

    if (this.get('showCamera') === undefined) {
        this.set('showCamera', false);
    }

    if (this.get('showPointLight') === undefined) {
        this.set('showPointLight', true);
    }

    if (this.get('showDirectionalLight') === undefined) {
        this.set('showDirectionalLight', true);
    }

    if (this.get('showSpotLight') === undefined) {
        this.set('showSpotLight', true);
    }

    if (this.get('showHemisphereLight') === undefined) {
        this.set('showHemisphereLight', true);
    }

    if (this.get('showRectAreaLight') === undefined) {
        this.set('showRectAreaLight', true);
    }

    if (this.get('showSkeleton') === undefined) {
        this.set('showSkeleton', false);
    }

    // 选中效果
    if (this.get('selectMode') === undefined) {
        this.set('selectMode', 'whole'); // whole: 选择整体；part: 选择部分。
    }

    if (this.get('selectedColor') === undefined) {
        this.set('selectedColor', '#ff6600'); // unity3d: #ff6600
    }

    if (this.get('selectedThickness') === undefined) {
        this.set('selectedThickness', 4);
    }

    // 高亮效果
    if (this.get('hoverEnabled') === undefined) {
        this.set('hoverEnabled', false);
    }

    if (this.get('hoveredColor') === undefined) {
        this.set('hoveredColor', '#ffff00');
    }

    // 添加模式
    if (this.get('addMode') === undefined) {
        this.set('addMode', 'center'); // center: 添加到场景中心；click: 点击场景添加。
    }

    // 控制器模式
    if (this.get('controlMode') === undefined) {
        this.set('controlMode', 'EditorControls'); // EditorControls: 编辑器控制器；FreeControls: 自由控制器。
    }
}

Storage.prototype.get = function (key) {
    var configs = this._getConfigs();
    return configs[key];
};

Storage.prototype.set = function (key, value) {
    var configs = this._getConfigs();
    configs[key] = value;
    this._setConfigs(configs);
};

Storage.prototype.setConfigs = function (configs) {
    if (typeof configs !== 'object') {
        console.warn(`Storage: configs should be an object.`);
        return;
    }

    var _configs = this._getConfigs();

    Object.keys(configs).forEach(n => {
        _configs[n] = configs[n];
    });

    this._setConfigs(_configs);
};

Storage.prototype.remove = function (key) {
    var configs = this._getConfigs();
    delete configs[key];
    this._setConfigs(configs);
};

Storage.prototype.clear = function () {
    window.localStorage.removeItem('configs');
};

Storage.prototype._getConfigs = function () {
    var configs = window.localStorage.getItem('configs');

    if (!configs) {
        configs = '{}';
    }

    return JSON.parse(configs);
};

Storage.prototype._setConfigs = function (configs) {
    window.localStorage.setItem('configs', JSON.stringify(configs));
};

export default Storage;