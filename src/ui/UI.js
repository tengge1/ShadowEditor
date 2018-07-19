import Control from './Control';

/**
 * UI类
 */
function UICls() {
    this.xtypes = {};
    this.objects = {};
}

/**
 * 添加xtype
 * @param {*} name xtype字符串
 * @param {*} cls xtype对应类
 */
UICls.prototype.addXType = function (name, cls) {
    if (this.xtypes[name] === undefined) {
        this.xtypes[name] = cls;
    } else {
        console.warn(`UICls: xtype named ${name} has already been added.`);
    }
};

/**
 * 删除xtype
 * @param {*} name xtype字符串
 */
UICls.prototype.removeXType = function (name) {
    if (this.xtypes[name] !== undefined) {
        delete this.xtypes[name];
    } else {
        console.warn(`UICls: xtype named ${name} is not defined.`);
    }
};

/**
 * 获取xtype
 * @param {*} name xtype字符串
 */
UICls.prototype.getXType = function (name) {
    if (this.xtypes[name] === undefined) {
        console.warn(`UICls: xtype named ${name} is not defined.`);
    }
    return this.xtypes[name];
};

/**
 * 添加一个对象到缓存
 * @param {*} id 对象id
 * @param {*} obj 对象
 * @param {*} scope 对象作用域（默认为global）
 */
UICls.prototype.add = function (id, obj, scope = "global") {
    var key = `${scope}:${id}`;
    if (this.objects[key] !== undefined) {
        console.warn(`UICls: object named ${id} has already been added.`);
    }
    this.objects[key] = obj;
};

/**
 * 从缓存中移除一个对象
 * @param {*} id 对象id
 * @param {*} scope 对象作用域（默认为global）
 */
UICls.prototype.remove = function (id, scope = 'global') {
    var key = `${scope}:${id}`;
    if (this.objects[key] === undefined) {
        console.warn(`UICls: object named ${id} is not defined.`);
    } else {
        delete this.objects[key];
    }
};

/**
 * 从缓存中获取一个对象
 * @param {*} id 控件id
 * @param {*} scope 对象作用域（默认为global）
 */
UICls.prototype.get = function (id, scope = 'global') {
    var key = `${scope}:${id}`;
    if (this.objects[key] === undefined) {
        console.warn(`UICls: object named ${id} is not defined.`);
    }
    return this.objects[key];
};

/**
 * 通过json配置创建UI实例，并自动将包含id的控件添加到缓存
 * @param {*} config xtype配置
 * @param {*} scope 对象作用域（默认为global）
 */
UICls.prototype.create = function (config, scope = 'global') {
    if (config instanceof Control) { // config是Control实例
        if (config.id) {
            scope = config.scope || scope;
            this.objects[`${scope}:${config.id}`] = config;
        }
        return config;
    }

    // config是json配置
    if (config == null || config.xtype == null) {
        throw 'UICls: config is undefined.';
    }

    if (config.xtype === undefined) {
        throw 'UICls: config.xtype is undefined.';
    }

    var cls = this.xtypes[config.xtype];
    if (cls == null) {
        throw `UICls: xtype named ${config.xtype} is undefined.`;
    }

    var control = new cls(config);
    scope = config.scope || scope;
    if (config.id && this.objects[`${scope}:${config.id}`] !== undefined) {
        console.warn(`UICls: control named ${control.id} has already be added.`);
    } else if (control.id) {
        this.objects[`${scope}:${config.id}`] = control;
    }

    return control;
};

/**
 * UICls唯一一个实例
 */
const UI = new UICls();

export default UI;