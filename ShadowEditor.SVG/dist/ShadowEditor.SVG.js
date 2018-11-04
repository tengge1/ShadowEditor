(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Shadow = {})));
}(this, (function (exports) { 'use strict';

	var ID = -1;

	/**
	 * 所有控件基类
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function Control(options = {}) {
	    this.parent = options.parent || document.body;
	    this._id = options.id || this.constructor.name + ID--;
	    this._scope = options.scope || 'global';

	    this.children = options.children || [];
	    this.html = options.html || null;

	    this.attr = options.attr || null; // 控件属性
	    this.cls = options.cls || null; // class属性
	    this.data = options.data || null; // 控件数据
	    this.style = options.style || null; // 控件样式
	    this.listeners = options.listeners || null; // 监听器
	    this.userData = options.userData || null; // 自定义数据

	    window.UI.add(this._id, this, this._scope);
	}

	Object.defineProperties(Control.prototype, {
	    /**
	     * 控件id
	     */
	    id: {
	        get: function () {
	            return this._id;
	        },
	        set: function (id) {
	            console.warn(`Control: It is not allowed to assign new value to id.`);
	            this._id = id;
	        }
	    },

	    /**
	     * 命名空间
	     */
	    scope: {
	        get: function () {
	            return this._scope;
	        },
	        set: function (scope) {
	            console.warn(`Control: It is not allowed to assign new value to scope.`);
	            this._scope = scope;
	        }
	    }
	});

	/**
	 * 添加子控件
	 * @param {*} obj 
	 */
	Control.prototype.add = function (obj) {
	    this.children.push(obj);
	};

	/**
	 * 插入子控件
	 * @param {*} index 
	 * @param {*} obj 
	 */
	Control.prototype.insert = function (index, obj) {
	    this.children.splice(index, 0, obj);
	};

	/**
	 * 移除子控件
	 * @param {*} obj 
	 */
	Control.prototype.remove = function (obj) {
	    var index = this.children.indexOf(obj);
	    if (index > -1) {
	        this.children.splice(index, 1);
	    }
	};

	/**
	 * 渲染控件
	 */
	Control.prototype.render = function () {
	    this.children.forEach(n => {
	        var obj = window.UI.create(n);
	        obj.parent = this.parent;
	        obj.render();
	    });
	};

	/**
	 * 渲染dom，将dom添加到父dom并给dom赋值，然后循环渲染子dom
	 * @param {*} dom 
	 */
	Control.prototype.renderDom = function (dom) {
	    this.dom = dom;
	    this.parent.appendChild(this.dom);

	    // 属性，通过setAttribute给节点赋值
	    if (this.attr) {
	        Object.keys(this.attr).forEach(n => {
	            this.dom.setAttribute(n, this.attr[n]);
	        });
	    }

	    // class属性
	    if (this.cls) {
	        this.dom.className = this.cls;
	    }

	    // 数据，直接赋值给dom
	    if (this.data) {
	        Object.assign(this.dom, this.data);
	    }

	    // 样式，赋值给dom.style
	    if (this.style) {
	        Object.assign(this.dom.style, this.style);
	    }

	    // 监听器，赋值给dom
	    if (this.listeners) {
	        Object.keys(this.listeners).forEach(n => {
	            this.dom['on' + n] = this.listeners[n];
	        });
	    }

	    // 自定义数据，赋值给dom.userData
	    if (this.userData) {
	        this.dom.userData = {};
	        Object.assign(this.dom.userData, this.userData);
	    }

	    // innerHTML属性
	    if (this.html) {
	        this.dom.innerHTML = this.html;
	    }

	    // 渲染子节点
	    this.children.forEach(n => {
	        var control = window.UI.create(n);
	        control.parent = this.dom;
	        control.render();
	    });
	};

	/**
	 * 清空控件（可调用render函数重新渲染）
	 */
	Control.prototype.clear = function () {
	    (function remove(items) {
	        if (items == null || items.length === 0) {
	            return;
	        }

	        items.forEach(n => {
	            if (n.id) {
	                window.UI.remove(n.id, n.scope);
	            }
	            if (n.listeners) {
	                Object.keys(n.listeners).forEach(m => {
	                    if (n.dom) {
	                        n.dom['on' + m] = null;
	                    }
	                });
	            }
	            remove(n.children);
	        });
	    })(this.children);

	    this.children.length = 0;

	    if (this.dom) {
	        this.parent.removeChild(this.dom);

	        if (this.listeners) {
	            this.listeners.forEach(n => {
	                this.dom['on' + n] = null;
	            });
	        }

	        this.dom = null;
	    }
	};

	/**
	 * 摧毁控件
	 */
	Control.prototype.destroy = function () {
	    this.clear();
	    if (this.parent) {
	        this.parent = null;
	    }
	    if (this.id) {
	        window.UI.remove(this._id, this._scope);
	    }
	};

	/**
	 * UI类
	 * @author tengge / https://github.com/tengge1
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
	    if (this.objects[key] != undefined) {
	        delete this.objects[key];
	    } else {
	        console.warn(`UICls: object named ${id} is not defined.`);
	    }
	};

	/**
	 * 从缓存中获取一个对象
	 * @param {*} id 控件id
	 * @param {*} scope 对象作用域（默认为global）
	 */
	UICls.prototype.get = function (id, scope = 'global') {
	    var key = `${scope}:${id}`;
	    return this.objects[key];
	};

	/**
	 * 通过json配置创建UI实例，并自动将包含id的控件添加到缓存
	 * @param {*} config xtype配置
	 */
	UICls.prototype.create = function (config) {
	    if (config instanceof Control) { // config是Control实例
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

	    return new cls(config);
	};

	/**
	 * UICls
	 */
	const UI = new UICls();

	window.UI = UI;

	const xlinkns = "http://www.w3.org/1999/xlink";

	/**
	* 渲染dom
	* @param {*} dom 
	*/
	Control.prototype.renderDom = function (dom) {
	    this.dom = dom;
	    this.parent.appendChild(this.dom);

	    if (this.attr) {
	        Object.keys(this.attr).forEach(n => {
	            // 对于类似`xlink:href`的属性，需要使用setAttributeNS设置属性，否则svg显示不出来
	            if (n.startsWith('xlink')) {
	                this.dom.setAttributeNS(xlinkns, n, this.attr[n]);
	            } else {
	                this.dom.setAttribute(n, this.attr[n]);
	            }
	        });
	    }

	    if (this.cls) {
	        this.dom.className = this.cls;
	    }

	    if (this.data) {
	        Object.assign(this.dom, this.data);
	    }

	    if (this.style) {
	        Object.assign(this.dom.style, this.style);
	    }

	    if (this.listeners) {
	        Object.keys(this.listeners).forEach(n => {
	            this.dom['on' + n] = this.listeners[n];
	        });
	    }

	    if (this.userData) {
	        this.dom.userData = {};
	        Object.assign(this.dom.userData, this.userData);
	    }

	    if (this.html) {
	        this.dom.innerHTML = this.html;
	    }

	    this.children.forEach(n => {
	        var control = window.UI.create(n);
	        control.parent = this.dom;
	        control.render();
	    });
	};

	/**
	 * SVG文档
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgDom(options = {}) {
	    Control.call(this, options);
	}

	SvgDom.prototype = Object.create(Control.prototype);
	SvgDom.prototype.constructor = SvgDom;

	SvgDom.prototype.render = function () {
	    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	    this.renderDom(dom);
	};

	UI.addXType('svgdom', SvgDom);

	/**
	 * SVG圆
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgCircle(options = {}) {
	    Control.call(this, options);
	}

	SvgCircle.prototype = Object.create(Control.prototype);
	SvgCircle.prototype.constructor = SvgCircle;

	SvgCircle.prototype.render = function () {
	    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	    this.renderDom(dom);
	};

	UI.addXType('svgcircle', SvgCircle);

	/**
	 * SVG矩形
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgRect(options = {}) {
	    Control.call(this, options);
	}

	SvgRect.prototype = Object.create(Control.prototype);
	SvgRect.prototype.constructor = SvgRect;

	SvgRect.prototype.render = function () {
	    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	    this.renderDom(dom);
	};

	UI.addXType('svgrect', SvgRect);

	/**
	 * SVG椭圆
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgEllipse(options = {}) {
	    Control.call(this, options);
	}

	SvgEllipse.prototype = Object.create(Control.prototype);
	SvgEllipse.prototype.constructor = SvgEllipse;

	SvgEllipse.prototype.render = function () {
	    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
	    this.renderDom(dom);
	};

	UI.addXType('svgellipse', SvgEllipse);

	/**
	 * SVG线
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgLine(options = {}) {
	    Control.call(this, options);
	}

	SvgLine.prototype = Object.create(Control.prototype);
	SvgLine.prototype.constructor = SvgLine;

	SvgLine.prototype.render = function () {
	    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	    this.renderDom(dom);
	};

	UI.addXType('svgline', SvgLine);

	/**
	 * SVG曲线
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgPolyline(options = {}) {
	    Control.call(this, options);
	}

	SvgPolyline.prototype = Object.create(Control.prototype);
	SvgPolyline.prototype.constructor = SvgPolyline;

	SvgPolyline.prototype.render = function () {
	    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
	    this.renderDom(dom);
	};

	UI.addXType('svgpolyline', SvgPolyline);

	/**
	 * SVG面
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgPolygon(options = {}) {
	    Control.call(this, options);
	}

	SvgPolygon.prototype = Object.create(Control.prototype);
	SvgPolygon.prototype.constructor = SvgPolygon;

	SvgPolygon.prototype.render = function () {
	    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	    this.renderDom(dom);
	};

	UI.addXType('svgpolygon', SvgPolygon);

	/**
	 * SVG线
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgPath(options = {}) {
	    Control.call(this, options);
	}

	SvgPath.prototype = Object.create(Control.prototype);
	SvgPath.prototype.constructor = SvgPath;

	SvgPath.prototype.render = function () {
	    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	    this.renderDom(dom);
	};

	UI.addXType('svgpath', SvgPath);

	/**
	 * SVG文本
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgText(options = {}) {
	    Control.call(this, options);

	    this.text = options.text || null;
	}

	SvgText.prototype = Object.create(Control.prototype);
	SvgText.prototype.constructor = SvgText;

	SvgText.prototype.render = function () {
	    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	    this.renderDom(dom);
	};

	UI.addXType('svgtext', SvgText);

	/**
	 * SVG文本路径
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgTextPath(options = {}) {
	    Control.call(this, options);

	    this.text = options.text || null;
	}

	SvgTextPath.prototype = Object.create(Control.prototype);
	SvgTextPath.prototype.constructor = SvgTextPath;

	SvgTextPath.prototype.render = function () {
	    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
	    this.renderDom(dom);
	};

	UI.addXType('svgtextpath', SvgTextPath);

	/**
	 * SVG链接
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgAnchor(options = {}) {
	    Control.call(this, options);
	}

	SvgAnchor.prototype = Object.create(Control.prototype);
	SvgAnchor.prototype.constructor = SvgAnchor;

	SvgAnchor.prototype.render = function () {
	    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'a');
	    this.renderDom(dom);
	};

	UI.addXType('svga', SvgAnchor);

	/**
	 * SVG定义
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgDefs(options = {}) {
	    Control.call(this, options);
	}

	SvgDefs.prototype = Object.create(Control.prototype);
	SvgDefs.prototype.constructor = SvgDefs;

	SvgDefs.prototype.render = function () {
	    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
	    this.renderDom(dom);
	};

	UI.addXType('svgdefs', SvgDefs);

	/**
	 * SVG Use
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgUse(options = {}) {
	    Control.call(this, options);
	}

	SvgUse.prototype = Object.create(Control.prototype);
	SvgUse.prototype.constructor = SvgUse;

	SvgUse.prototype.render = function () {
	    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'use');
	    this.renderDom(dom);
	};

	UI.addXType('svguse', SvgUse);

	/**
	 * SVG滤镜
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgFilter(options = {}) {
	    Control.call(this, options);
	}

	SvgFilter.prototype = Object.create(Control.prototype);
	SvgFilter.prototype.constructor = SvgFilter;

	SvgFilter.prototype.render = function () {
	    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
	    this.renderDom(dom);
	};

	UI.addXType('svgfilter', SvgFilter);

	/**
	 * SVG高斯滤镜
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function feGaussianBlur(options = {}) {
	    Control.call(this, options);
	}

	feGaussianBlur.prototype = Object.create(Control.prototype);
	feGaussianBlur.prototype.constructor = feGaussianBlur;

	feGaussianBlur.prototype.render = function () {
	    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
	    this.renderDom(dom);
	};

	UI.addXType('svgfegaussianblur', feGaussianBlur);

	/**
	 * SVG偏移滤镜
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function feOffset(options = {}) {
	    Control.call(this, options);
	}

	feOffset.prototype = Object.create(Control.prototype);
	feOffset.prototype.constructor = feOffset;

	feOffset.prototype.render = function () {
	    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'feOffset');
	    this.renderDom(dom);
	};

	UI.addXType('svgfeoffset', feOffset);

	/**
	 * SVG融合滤镜
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function feBlend(options = {}) {
	    Control.call(this, options);
	}

	feBlend.prototype = Object.create(Control.prototype);
	feBlend.prototype.constructor = feBlend;

	feBlend.prototype.render = function () {
	    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'feBlend');
	    this.renderDom(dom);
	};

	UI.addXType('svgfeblend', feBlend);

	exports.Control = Control;
	exports.UI = UI;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
