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

	    this.manager = null; // Manager.create时自动赋值
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
	        this.children[index].manager = null;
	        this.children.splice(index, 1);
	    }
	};

	/**
	 * 渲染控件
	 */
	Control.prototype.render = function () {
	    this.children.forEach(n => {
	        var obj = this.manager.create(n);
	        obj.parent = this.parent;
	        obj.render();
	    });
	};

	/**
	 * 创建元素
	 * @param {*} tag 标签
	 */
	Control.prototype.createElement = function (tag) {
	    return document.createElement(tag);
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
	        var control = this.manager.create(n);
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
	                this.manager.remove(n.id, n.scope);
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
	        this.manager.remove(this._id, this._scope);
	    }
	    this.manager = null;
	};

	const svgNS = 'http://www.w3.org/2000/svg';
	const xlinkNS = "http://www.w3.org/1999/xlink";

	/**
	 * SVG控件
	 * @param {*} options 选项
	 */
	function SvgControl(options = {}) {
	    Control.call(this, options);
	}

	SvgControl.prototype = Object.create(Control.prototype);
	SvgControl.prototype.constructor = SvgControl;

	SvgControl.prototype.createElement = function (tag) {
	    return document.createElementNS(svgNS, tag);
	};

	SvgControl.prototype.renderDom = function (dom) {
	    this.dom = dom;
	    this.parent.appendChild(this.dom);

	    if (this.attr) {
	        Object.keys(this.attr).forEach(n => {
	            if (n.startsWith('xlink')) {
	                this.dom.setAttributeNS(xlinkNS, n, this.attr[n]);
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
	        var control = this.manager.create(n);
	        control.parent = this.dom;
	        control.render();
	    });
	};

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

	        this.add(config.id, this, config.scope);
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

	const SVG = new Manager();

	/**
	 * SVG文档
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function Dom(options = {}) {
	    SvgControl.call(this, options);
	}

	Dom.prototype = Object.create(SvgControl.prototype);
	Dom.prototype.constructor = Dom;

	Dom.prototype.render = function () {
	    this.renderDom(this.createElement('svg'));
	};

	SVG.addXType('dom', Dom);

	/**
	 * SVG圆
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function Circle(options = {}) {
	    SvgControl.call(this, options);
	}

	Circle.prototype = Object.create(SvgControl.prototype);
	Circle.prototype.constructor = Circle;

	Circle.prototype.render = function () {
	    this.renderDom(this.createElement('circle'));
	};

	SVG.addXType('circle', Circle);

	/**
	 * SVG椭圆
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function Ellipse(options = {}) {
	    SvgControl.call(this, options);
	}

	Ellipse.prototype = Object.create(SvgControl.prototype);
	Ellipse.prototype.constructor = Ellipse;

	Ellipse.prototype.render = function () {
	    this.renderDom(this.createElement('ellipse'));
	};

	SVG.addXType('ellipse', Ellipse);

	/**
	 * SVG线
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function Line(options = {}) {
	    SvgControl.call(this, options);
	}

	Line.prototype = Object.create(SvgControl.prototype);
	Line.prototype.constructor = Line;

	Line.prototype.render = function () {
	    this.renderDom(this.createElement('line'));
	};

	SVG.addXType('line', Line);

	/**
	 * SVG面
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function Polygon(options = {}) {
	    SvgControl.call(this, options);
	}

	Polygon.prototype = Object.create(SvgControl.prototype);
	Polygon.prototype.constructor = Polygon;

	Polygon.prototype.render = function () {
	    this.renderDom(this.createElement('polygon'));
	};

	SVG.addXType('polygon', Polygon);

	/**
	 * SVG曲线
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function Polyline(options = {}) {
	    SvgControl.call(this, options);
	}

	Polyline.prototype = Object.create(SvgControl.prototype);
	Polyline.prototype.constructor = Polyline;

	Polyline.prototype.render = function () {
	    this.renderDom(this.createElement('polyline'));
	};

	SVG.addXType('polyline', Polyline);

	/**
	 * SVG矩形
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function Rect(options = {}) {
	    SvgControl.call(this, options);
	}

	Rect.prototype = Object.create(SvgControl.prototype);
	Rect.prototype.constructor = Rect;

	Rect.prototype.render = function () {
	    this.renderDom(this.createElement('rect'));
	};

	SVG.addXType('rect', Rect);

	/**
	 * SVG链接
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function Anchor(options = {}) {
	    SvgControl.call(this, options);
	}

	Anchor.prototype = Object.create(SvgControl.prototype);
	Anchor.prototype.constructor = Anchor;

	Anchor.prototype.render = function () {
	    this.renderDom(this.createElement('a'));
	};

	SVG.addXType('a', Anchor);

	/**
	 * SVG定义
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function Defs(options = {}) {
	    SvgControl.call(this, options);
	}

	Defs.prototype = Object.create(SvgControl.prototype);
	Defs.prototype.constructor = Defs;

	Defs.prototype.render = function () {
	    this.renderDom(this.createElement('defs'));
	};

	SVG.addXType('defs', Defs);

	/**
	 * SVG线
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function Group(options = {}) {
	    SvgControl.call(this, options);
	}

	Group.prototype = Object.create(SvgControl.prototype);
	Group.prototype.constructor = Group;

	Group.prototype.render = function () {
	    this.renderDom(this.createElement('g'));
	};

	SVG.addXType('g', Group);

	/**
	 * 箭头
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function Marker(options = {}) {
	    SvgControl.call(this, options);
	}

	Marker.prototype = Object.create(SvgControl.prototype);
	Marker.prototype.constructor = Marker;

	Marker.prototype.render = function () {
	    this.renderDom(this.createElement('marker'));
	};

	SVG.addXType('marker', Marker);

	/**
	 * 蒙版
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function Mask(options = {}) {
	    SvgControl.call(this, options);
	}

	Mask.prototype = Object.create(SvgControl.prototype);
	Mask.prototype.constructor = Mask;

	Mask.prototype.render = function () {
	    this.renderDom(this.createElement('mask'));
	};

	SVG.addXType('mask', Mask);

	/**
	 * 模式
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function Pattern(options = {}) {
	    SvgControl.call(this, options);
	}

	Pattern.prototype = Object.create(SvgControl.prototype);
	Pattern.prototype.constructor = Pattern;

	Pattern.prototype.render = function () {
	    this.renderDom(this.createElement('pattern'));
	};

	SVG.addXType('pattern', Pattern);

	/**
	 * 选择
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function Switch(options = {}) {
	    SvgControl.call(this, options);
	}

	Switch.prototype = Object.create(SvgControl.prototype);
	Switch.prototype.constructor = Switch;

	Switch.prototype.render = function () {
	    this.renderDom(this.createElement('switch'));
	};

	SVG.addXType('switch', Switch);

	/**
	 * 标记
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function Symbol(options = {}) {
	    SvgControl.call(this, options);
	}

	Symbol.prototype = Object.create(SvgControl.prototype);
	Symbol.prototype.constructor = Symbol;

	Symbol.prototype.render = function () {
	    this.renderDom(this.createElement('symbol'));
	};

	SVG.addXType('symbol', Symbol);

	/**
	 * SVG融合滤镜
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function feBlend(options = {}) {
	    SvgControl.call(this, options);
	}

	feBlend.prototype = Object.create(SvgControl.prototype);
	feBlend.prototype.constructor = feBlend;

	feBlend.prototype.render = function () {
	    this.renderDom(this.createElement('feBlend'));
	};

	SVG.addXType('feblend', feBlend);

	/**
	 * SVG融合滤镜
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function feColorMatrix(options = {}) {
	    SvgControl.call(this, options);
	}

	feColorMatrix.prototype = Object.create(SvgControl.prototype);
	feColorMatrix.prototype.constructor = feColorMatrix;

	feColorMatrix.prototype.render = function () {
	    this.renderDom(this.createElement('feColorMatrix'));
	};

	SVG.addXType('fecolormatrix', feColorMatrix);

	/**
	 * feComponentTransfer
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function feComponentTransfer(options = {}) {
	    SvgControl.call(this, options);
	}

	feComponentTransfer.prototype = Object.create(SvgControl.prototype);
	feComponentTransfer.prototype.constructor = feComponentTransfer;

	feComponentTransfer.prototype.render = function () {
	    this.renderDom(this.createElement('feComponentTransfer'));
	};

	SVG.addXType('fecomponenttransfer', feComponentTransfer);

	/**
	 * feComposite
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function feComposite(options = {}) {
	    SvgControl.call(this, options);
	}

	feComposite.prototype = Object.create(SvgControl.prototype);
	feComposite.prototype.constructor = feComposite;

	feComposite.prototype.render = function () {
	    this.renderDom(this.createElement('feComposite'));
	};

	SVG.addXType('fecomposite', feComposite);

	/**
	 * feConvolveMatrix
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function feConvolveMatrix(options = {}) {
	    SvgControl.call(this, options);
	}

	feConvolveMatrix.prototype = Object.create(SvgControl.prototype);
	feConvolveMatrix.prototype.constructor = feConvolveMatrix;

	feConvolveMatrix.prototype.render = function () {
	    this.renderDom(this.createElement('feConvolveMatrix'));
	};

	SVG.addXType('feconvolvematrix', feConvolveMatrix);

	/**
	 * feDiffuseLighting
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function feDiffuseLighting(options = {}) {
	    SvgControl.call(this, options);
	}

	feDiffuseLighting.prototype = Object.create(SvgControl.prototype);
	feDiffuseLighting.prototype.constructor = feDiffuseLighting;

	feDiffuseLighting.prototype.render = function () {
	    this.renderDom(this.createElement('feDiffuseLighting'));
	};

	SVG.addXType('fediffuselighting', feDiffuseLighting);

	/**
	 * feDisplacementMap
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function feDisplacementMap(options = {}) {
	    SvgControl.call(this, options);
	}

	feDisplacementMap.prototype = Object.create(SvgControl.prototype);
	feDisplacementMap.prototype.constructor = feDisplacementMap;

	feDisplacementMap.prototype.render = function () {
	    this.renderDom(this.createElement('feDisplacementMap'));
	};

	SVG.addXType('fedisplacementmap', feDisplacementMap);

	/**
	 * feDropShadow
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function feDropShadow(options = {}) {
	    SvgControl.call(this, options);
	}

	feDropShadow.prototype = Object.create(SvgControl.prototype);
	feDropShadow.prototype.constructor = feDropShadow;

	feDropShadow.prototype.render = function () {
	    this.renderDom(this.createElement('feDropShadow'));
	};

	SVG.addXType('fedropshadow', feDropShadow);

	/**
	 * feFlood
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function feFlood(options = {}) {
	    SvgControl.call(this, options);
	}

	feFlood.prototype = Object.create(SvgControl.prototype);
	feFlood.prototype.constructor = feFlood;

	feFlood.prototype.render = function () {
	    this.renderDom(this.createElement('feFlood'));
	};

	SVG.addXType('feflood', feFlood);

	/**
	 * feFuncA
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function feFuncA(options = {}) {
	    SvgControl.call(this, options);
	}

	feFuncA.prototype = Object.create(SvgControl.prototype);
	feFuncA.prototype.constructor = feFuncA;

	feFuncA.prototype.render = function () {
	    this.renderDom(this.createElement('feFuncA'));
	};

	SVG.addXType('fefunca', feFuncA);

	/**
	 * feFuncB
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function feFuncB(options = {}) {
	    SvgControl.call(this, options);
	}

	feFuncB.prototype = Object.create(SvgControl.prototype);
	feFuncB.prototype.constructor = feFuncB;

	feFuncB.prototype.render = function () {
	    this.renderDom(this.createElement('feFuncB'));
	};

	SVG.addXType('fefuncb', feFuncB);

	/**
	 * feFuncG
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function feFuncG(options = {}) {
	    SvgControl.call(this, options);
	}

	feFuncG.prototype = Object.create(SvgControl.prototype);
	feFuncG.prototype.constructor = feFuncG;

	feFuncG.prototype.render = function () {
	    this.renderDom(this.createElement('feFuncG'));
	};

	SVG.addXType('fefuncg', feFuncG);

	/**
	 * feGaussianBlur
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function feGaussianBlur(options = {}) {
	    SvgControl.call(this, options);
	}

	feGaussianBlur.prototype = Object.create(SvgControl.prototype);
	feGaussianBlur.prototype.constructor = feGaussianBlur;

	feGaussianBlur.prototype.render = function () {
	    this.renderDom(this.createElement('feGaussianBlur'));
	};

	SVG.addXType('fegaussianblur', feGaussianBlur);

	/**
	 * feImage
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function feImage(options = {}) {
	    SvgControl.call(this, options);
	}

	feImage.prototype = Object.create(SvgControl.prototype);
	feImage.prototype.constructor = feImage;

	feImage.prototype.render = function () {
	    this.renderDom(this.createElement('feImage'));
	};

	SVG.addXType('feimage', feImage);

	/**
	 * feMerge
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function feMerge(options = {}) {
	    SvgControl.call(this, options);
	}

	feMerge.prototype = Object.create(SvgControl.prototype);
	feMerge.prototype.constructor = feMerge;

	feMerge.prototype.render = function () {
	    this.renderDom(this.createElement('feMerge'));
	};

	SVG.addXType('femerge', feMerge);

	/**
	 * feMergeNode
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function feMergeNode(options = {}) {
	    SvgControl.call(this, options);
	}

	feMergeNode.prototype = Object.create(SvgControl.prototype);
	feMergeNode.prototype.constructor = feMergeNode;

	feMergeNode.prototype.render = function () {
	    this.renderDom(this.createElement('feMergeNode'));
	};

	SVG.addXType('femergenode', feMergeNode);

	/**
	 * feMorphology
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function feMorphology(options = {}) {
	    SvgControl.call(this, options);
	}

	feMorphology.prototype = Object.create(SvgControl.prototype);
	feMorphology.prototype.constructor = feMorphology;

	feMorphology.prototype.render = function () {
	    this.renderDom(this.createElement('feMorphology'));
	};

	SVG.addXType('femorphology', feMorphology);

	/**
	 * SVG偏移滤镜
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function feOffset(options = {}) {
	    SvgControl.call(this, options);
	}

	feOffset.prototype = Object.create(SvgControl.prototype);
	feOffset.prototype.constructor = feOffset;

	feOffset.prototype.render = function () {
	    this.renderDom(this.createElement('feOffset'));
	};

	SVG.addXType('feoffset', feOffset);

	/**
	 * feSpecularLighting
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function feSpecularLighting(options = {}) {
	    SvgControl.call(this, options);
	}

	feSpecularLighting.prototype = Object.create(SvgControl.prototype);
	feSpecularLighting.prototype.constructor = feSpecularLighting;

	feSpecularLighting.prototype.render = function () {
	    this.renderDom(this.createElement('feSpecularLighting'));
	};

	SVG.addXType('fespecularlighting', feSpecularLighting);

	/**
	 * feTile
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function feTile(options = {}) {
	    SvgControl.call(this, options);
	}

	feTile.prototype = Object.create(SvgControl.prototype);
	feTile.prototype.constructor = feTile;

	feTile.prototype.render = function () {
	    this.renderDom(this.createElement('feTile'));
	};

	SVG.addXType('fetile', feTile);

	/**
	 * feTurbulence
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function feTurbulence(options = {}) {
	    SvgControl.call(this, options);
	}

	feTurbulence.prototype = Object.create(SvgControl.prototype);
	feTurbulence.prototype.constructor = feTurbulence;

	feTurbulence.prototype.render = function () {
	    this.renderDom(this.createElement('feTurbulence'));
	};

	SVG.addXType('feturbulence', feTurbulence);

	/**
	 * 图片
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function Image(options = {}) {
	    SvgControl.call(this, options);
	}

	Image.prototype = Object.create(SvgControl.prototype);
	Image.prototype.constructor = Image;

	Image.prototype.render = function () {
	    this.renderDom(this.createElement('image'));
	};

	SVG.addXType('image', Image);

	/**
	 * 线
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function Path(options = {}) {
	    SvgControl.call(this, options);
	}

	Path.prototype = Object.create(SvgControl.prototype);
	Path.prototype.constructor = Path;

	Path.prototype.render = function () {
	    this.renderDom(this.createElement('path'));
	};

	SVG.addXType('path', Path);

	/**
	 * SVG文本
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function Text(options = {}) {
	    SvgControl.call(this, options);
	}

	Text.prototype = Object.create(SvgControl.prototype);
	Text.prototype.constructor = Text;

	Text.prototype.render = function () {
	    this.renderDom(this.createElement('text'));
	};

	SVG.addXType('text', Text);

	/**
	 * SVG Use
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function Use(options = {}) {
	    SvgControl.call(this, options);
	}

	Use.prototype = Object.create(SvgControl.prototype);
	Use.prototype.constructor = Use;

	Use.prototype.render = function () {
	    this.renderDom(this.createElement('use'));
	};

	SVG.addXType('use', Use);

	/**
	 * 线性渐变
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function LinearGradient(options = {}) {
	    SvgControl.call(this, options);
	}

	LinearGradient.prototype = Object.create(SvgControl.prototype);
	LinearGradient.prototype.constructor = LinearGradient;

	LinearGradient.prototype.render = function () {
	    this.renderDom(this.createElement('linearGradient'));
	};

	SVG.addXType('lineargradient', LinearGradient);

	/**
	 * 径向渐变
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function RadialGradient(options = {}) {
	    SvgControl.call(this, options);
	}

	RadialGradient.prototype = Object.create(SvgControl.prototype);
	RadialGradient.prototype.constructor = RadialGradient;

	RadialGradient.prototype.render = function () {
	    this.renderDom(this.createElement('radialGradient'));
	};

	SVG.addXType('radialgradient', RadialGradient);

	/**
	 * 停止渐变
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function Stop(options = {}) {
	    SvgControl.call(this, options);
	}

	Stop.prototype = Object.create(SvgControl.prototype);
	Stop.prototype.constructor = Stop;

	Stop.prototype.render = function () {
	    this.renderDom(this.createElement('stop'));
	};

	SVG.addXType('stop', Stop);

	/**
	 * SVG文本路径
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function TextPath(options = {}) {
	    SvgControl.call(this, options);
	}

	TextPath.prototype = Object.create(SvgControl.prototype);
	TextPath.prototype.constructor = TextPath;

	TextPath.prototype.render = function () {
	    this.renderDom(this.createElement('textPath'));
	};

	SVG.addXType('textpath', TextPath);

	/**
	 * SVG滤镜
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function Filter(options = {}) {
	    SvgControl.call(this, options);
	}

	Filter.prototype = Object.create(SvgControl.prototype);
	Filter.prototype.constructor = Filter;

	Filter.prototype.render = function () {
	    this.renderDom(this.createElement('filter'));
	};

	SVG.addXType('filter', Filter);

	// dom

	exports.SvgControl = SvgControl;
	exports.SVG = SVG;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
