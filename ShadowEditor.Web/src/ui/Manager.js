import Control from './Control';

/**
 * Manager类
 * @author tengge / https://github.com/tengge1
 */
function Manager() {
    this.xtypes = {};
    this.objects = {};
}

/**
 * 添加xtype
 * @param {*} name xtype字符串
 * @param {*} cls xtype对应类
 */
Manager.prototype.addXType = function (name, cls) {
    if (this.xtypes[name] === undefined) {
        this.xtypes[name] = cls;
    } else {
        console.warn(`Manager: xtype named ${name} has already been added.`);
    }
};

/**
 * 删除xtype
 * @param {*} name xtype字符串
 */
Manager.prototype.removeXType = function (name) {
    if (this.xtypes[name] !== undefined) {
        delete this.xtypes[name];
    } else {
        console.warn(`Manager: xtype named ${name} is not defined.`);
    }
};

/**
 * 获取xtype
 * @param {*} name xtype字符串
 */
Manager.prototype.getXType = function (name) {
    if (this.xtypes[name] === undefined) {
        console.warn(`Manager: xtype named ${name} is not defined.`);
    }
    return this.xtypes[name];
};

/**
 * 添加一个对象到缓存
 * @param {*} id 对象id
 * @param {*} obj 对象
 * @param {*} scope 对象作用域（默认为global）
 */
Manager.prototype.add = function (id, obj, scope = "global") {
    if (obj === this) {
        debugger
    }

    var key = `${scope}:${id}`;
    if (this.objects[key] !== undefined) {
        console.warn(`Manager: object named ${id} has already been added.`);
    }

    obj.manager = this;
    this.objects[key] = obj;
};

/**
 * 从缓存中移除一个对象
 * @param {*} id 对象id
 * @param {*} scope 对象作用域（默认为global）
 */
Manager.prototype.remove = function (id, scope = 'global') {
    var key = `${scope}:${id}`;
    if (this.objects[key] != undefined) {
        this.objects[key].manager = null;
        delete this.objects[key];
    } else {
        console.warn(`Manager: object named ${id} is not defined.`);
    }
};

/**
 * 从缓存中获取一个对象
 * @param {*} id 控件id
 * @param {*} scope 对象作用域（默认为global）
 */
Manager.prototype.get = function (id, scope = 'global') {
    var key = `${scope}:${id}`;
    return this.objects[key];
};

/**
 * 通过json配置创建Control实例，并自动将包含id的控件添加到缓存
 * @param {*} config xtype配置
 */
Manager.prototype.create = function (config) {
    if (config instanceof Control) { // config是Control实例
        this.add(config.id, config, config.scope);
        return config;
    }

    // config是json配置
    if (config == null || config.xtype == null) {
        console.warn('Manager: config is undefined.');
    }

    if (config.xtype === undefined) {
        console.warn('Manager: config.xtype is undefined.');
    }

    var cls = this.xtypes[config.xtype];
    if (cls == null) {
        console.warn(`Manager: xtype named ${config.xtype} is undefined.`);
    }

    var control = new cls(config);

    this.add(control.id, control, control.scope);

    return control;
};

export default new Manager();