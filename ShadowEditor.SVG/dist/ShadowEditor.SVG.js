(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Shadow = {})));
}(this, (function (exports) { 'use strict';

	var ID = -1;

	/**
	 * 所有SVG控件基类
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 选项
	 */
	function SvgControl(options) {
	    options = options || {};
	    this.parent = options.parent || document.body;
	    this.id = options.id || this.constructor.name + ID--;
	    this.scope = options.scope || 'global';

	    this.data = options.data || null; // 自定义数据，例如：{ name: '小米', age: 20 }

	    // 添加引用
	    // UI.add(this.id, this, this.scope);
	}

	/**
	 * 定义控件属性
	 */
	Object.defineProperties(SvgControl.prototype, {
	    /**
	     * 控件id（必须在options中设置，而且设置后无法改变）
	     */
	    id: {
	        get: function () {
	            return this._id;
	        },
	        set: function (id) {
	            if (this._id != null) {
	                console.warn(`SvgControl: It is not allowed to assign new value to id.`);
	            }
	            this._id = id;
	        }
	    },

	    /**
	     * 控件id作用域（必须在options中设置，而且设置后无法改变）
	     */
	    scope: {
	        get: function () {
	            return this._scope;
	        },
	        set: function (scope) {
	            if (this._scope != null) {
	                console.warn(`SvgControl: It is not allowed to assign new value to scope.`);
	            }
	            this._scope = scope;
	        }
	    }
	});

	/**
	 * 渲染SVG控件
	 */
	SvgControl.prototype.render = function () {

	};

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

	exports.SVG = SVG;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
