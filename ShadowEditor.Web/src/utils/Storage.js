/**
 * 存储类
 */
function Storage() {

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
    if (typeof (configs) !== 'object') {
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