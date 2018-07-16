import Control from './Control';

/**
 * 使用json对象表示控件实例
 */
function XTypeCls() {
    this.xtypes = { // xtype缓存
        control: Control
    };
    this.objects = { // 实例缓存

    };
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
 * 获取xtype
 * @param {*} name xtype字符串
 */
XTypeCls.prototype.get = function (name) {
    return this.xtypes[name];
};

/**
 * 通过json配置将xtype转换为实例
 * @param {*} config xtype配置
 */
XTypeCls.prototype.create = function (config) {
    if (config instanceof Control) { // config是Control实例
        if (config.id) {
            this.objects[config.id] = config;
        }
        return config;
    }

    // config是json配置
    if (config == null || config.xtype == null) {
        throw 'XType: config or config.xtype is undefined.';
    }

    var cls = this.xtypes[config.xtype];
    if (cls == null) {
        throw `XType: xtype '${config.xtype}' is undefined.`;
    }

    var control = new cls(config);
    if (control.id && this.objects[control.id] !== undefined) {
        throw `XType: the control with id equals to ${control.id} has already created.`;
    } else if (control.id) {
        this.objects[control.id] = control;
    }

    return control;
};

/**
 * 根据id获取一个控件实例
 * @param {*} id 控件id
 */
XTypeCls.prototype.getControl = function (id) {
    return this.objects[id];
};

/**
 * XTypeCls唯一一个实例
 */
const XType = new XTypeCls();

export default XType;