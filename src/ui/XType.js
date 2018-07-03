/**
 * 使用字符串表示一个类
 */
function XTypeCls() {
    this.xtypes = {};
}

/**
 * 添加xtype
 * @param {*} name xtype字符串
 * @param {*} cls xtype对应类
 */
XTypeCls.prototype.add = function (name, cls) {
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
XTypeCls.prototype.remove = function (name) {
    delete this.xtypes[name];
};

/**
 * 通过配置将xtype转换为实例
 * @param {*} config xtype配置
 */
XTypeCls.prototype.get = function (config) {
    if (config == null || config.xtype == null) {
        throw 'XType: config or config.xtype is undefined.';
    }
    var cls = this.xtypes[config.xtype];
    if (cls == null) {
        throw `XType: xtype '${config.xtype}' is undefined.`;
    }
    return new cls(config);
};

/**
 * XTypeCls唯一一个实例
 */
const XType = new XTypeCls();

export default XType;