import SvgControl from './SvgControl';

/**
 * SVG类
 * @author tengge / https://github.com/tengge1
 */
function SVGCls() {
    this.xtypes = {};
    this.objects = {};
}

/**
 * 添加xtype
 * @param {*} name xtype字符串
 * @param {*} cls xtype对应类
 */
SVGCls.prototype.addXType = function (name, cls) {
    if (this.xtypes[name] === undefined) {
        this.xtypes[name] = cls;
    } else {
        console.warn(`SVGCls: xtype named ${name} has already been added.`);
    }
};

/**
 * 删除xtype
 * @param {*} name xtype字符串
 */
SVGCls.prototype.removeXType = function (name) {
    if (this.xtypes[name] !== undefined) {
        delete this.xtypes[name];
    } else {
        console.warn(`SVGCls: xtype named ${name} is not defined.`);
    }
};

/**
 * 获取xtype
 * @param {*} name xtype字符串
 */
SVGCls.prototype.getXType = function (name) {
    if (this.xtypes[name] === undefined) {
        console.warn(`SVGCls: xtype named ${name} is not defined.`);
    }
    return this.xtypes[name];
};

/**
 * 添加一个对象到缓存
 * @param {*} id 对象id
 * @param {*} obj 对象
 * @param {*} scope 对象作用域（默认为global）
 */
SVGCls.prototype.add = function (id, obj, scope = "global") {
    var key = `${scope}:${id}`;
    if (this.objects[key] !== undefined) {
        console.warn(`SVGCls: object named ${id} has already been added.`);
    }
    this.objects[key] = obj;
};

/**
 * 从缓存中移除一个对象
 * @param {*} id 对象id
 * @param {*} scope 对象作用域（默认为global）
 */
SVGCls.prototype.remove = function (id, scope = 'global') {
    var key = `${scope}:${id}`;
    if (this.objects[key] != undefined) {
        delete this.objects[key];
    } else {
        console.warn(`SVGCls: object named ${id} is not defined.`);
    }
};

/**
 * 从缓存中获取一个对象
 * @param {*} id 控件id
 * @param {*} scope 对象作用域（默认为global）
 */
SVGCls.prototype.get = function (id, scope = 'global') {
    var key = `${scope}:${id}`;
    // 经常需要通过该方法判断是否已经注册某个元素，所以不能产生警告。
    // if (this.objects[key] === undefined) {
    //     console.warn(`SVGCls: object named ${id} is not defined.`);
    // }
    return this.objects[key];
};

/**
 * 通过json配置创建UI实例，并自动将包含id的控件添加到缓存
 * @param {*} config xtype配置
 */
SVGCls.prototype.create = function (config) {
    if (config instanceof Control) { // config是Control实例
        return config;
    }

    // config是json配置
    if (config == null || config.xtype == null) {
        throw 'SVGCls: config is undefined.';
    }

    if (config.xtype === undefined) {
        throw 'SVGCls: config.xtype is undefined.';
    }

    var cls = this.xtypes[config.xtype];
    if (cls == null) {
        throw `SVGCls: xtype named ${config.xtype} is undefined.`;
    }

    return new cls(config);
};

/**
 * SVGCls
 */
const SVG = new SVGCls();

// 添加所有SVG控件
Object.assign(SVG, {
    SvgControl: SvgControl,
});

// 添加所有SVG控件的XType
SVG.addXType('svgcontrol', SvgControl);

export default SVG;