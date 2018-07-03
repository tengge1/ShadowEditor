/**
 * 使用字符串表示一个类
 */
function XType() {
    this.xtypes = {};
}

/**
 * 添加xtype
 * @param {*} name xtype字符串
 * @param {*} cls xtype对应类
 */
XType.prototype.add = function (name, cls) {
    if (this.xtypes[name] == null) {
        this.xtypes[name] = cls;
    } else {
        throw 'XType: name has already added.';
    }
};

/**
 * 删除xtype
 * @param {*} name xtype字符串
 */
XType.prototype.remove = function (name) {
    delete this.xtypes[name];
};

/**
 * 通过配置将xtype转换为实例
 * @param {*} config xtype配置
 */
XType.prototype.get = function (config) {
    if (config == null || config.xtype == null) {
        throw 'XType: config or config.xtype is undefined.';
    }
    var cls = this.xtypes[config.xtype];
    if (cls == null) {
        throw `XType: xtype '${config.xtype}' is undefined.`;
    }
    return new cls(config);
};

export default XType;