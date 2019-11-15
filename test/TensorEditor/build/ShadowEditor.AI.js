(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.AI = {}));
}(this, function (exports) { 'use strict';

	/**
	 * 配置选项
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 配置选项
	 */
	function Options(options = {}) {
	  this.server = options.server === undefined ? location.origin : options.server; // 服务端地址

	  if (!this.server.startsWith('http')) {
	    this.server = `http://${this.server}`;
	  }
	}

	/**
	 * 自定义事件列表
	 * @author tengge / https://github.com/tengge1
	 */
	var EventList = [// dom事件
	'click', // 点击
	'contextmenu', // 右键
	'dblclick', // 双击
	'keydown', // 按下键盘按键
	'keyup', // 抬起键盘按键
	'mousedown', // 按下鼠标按键
	'mousemove', // 鼠标移动
	'mouseup', // 抬起鼠标按键
	'mousewheel', // 鼠标滚轮
	'resize', // 窗口大小改变
	'dragover', // 拖动到某元素上
	'drop', // 放置到某元素上
	// app事件
	'appStart', // 应用程序开始前调用
	'appStarted', // 应用程序开始后调用
	'appStop', // 程序开始结束前调用
	'appStoped', // 程序结束后调用
	'showMask', // 是否显示加载器
	// 配置
	'optionsChanged', // 配置改变事件（参数：无）
	'storageChanged', // 存储改变事件（参数：key, value）
	// 工具栏事件
	'changeMode', // 改变模式（select, translate, rotate, scale, delete）
	'changeView', // 改变视图（perspective, front, side, top）
	'viewChanged', // 视图已经改变
	// editor事件
	'sceneSaved', // 场景保存成功
	'select', // 选中事件
	'clear', // 清空场景
	'load', // 加载场景
	'log', // 日志事件
	'intersect', // 碰撞事件
	'editScript', // 编辑脚本事件 uuid, name, type, source
	'editorCleared', // 编辑器已经清空事件
	'snapChanged', // 对齐单元格事件
	'spaceChanged', // 空间坐标系改变事件
	'sceneGraphChanged', // 场景内容改变事件
	'cameraChanged', // 相机改变事件
	'rendererChanged', // 渲染器改变
	'geometryChanged', // 几何体改变事件
	'objectSelected', // 物体选中改变
	'objectFocused', // 物体交点改变事件
	'objectAdded', // 添加物体事件
	'objectChanged', // 物体改变事件
	'objectRemoved', // 物体移除事件
	'scriptAdded', // 添加脚本事件
	'scriptChanged', // 脚本改变事件
	'scriptRemoved', // 脚本移除事件
	'historyChanged', // 历史改变事件
	'refreshScriptEditor', // 刷新脚本编辑器事件
	'sceneLoaded', // 场景载入
	'postProcessingChanged', // 后期处理设置改变
	// 场景编辑区
	'transformControlsChange', // 变形控件改变
	'transformControlsMouseDown', // 变形控件按下鼠标键
	'transformControlsMouseUp', // 变形控件抬起鼠标键
	'raycast', // 光线投射事件
	'beforeRender', // 渲染前执行
	'afterRender', // 渲染后执行
	'animate', // 进行动画
	// 侧边栏
	'animationSelected', // 动画选中事件
	'animationChanged', // 动画发生改变事件
	'resetAnimation', // 重制动画时间轴
	'startAnimation', // 开始播放动画
	'animationTime', // 时间轴发送当前动画时间
	// 底部面板事件
	'selectBottomPanel', // 点击选择某个面板
	'showBottomPanel', // 显示某个底部面板以后
	'selectModel', // 选择模型
	'selectMap', // 选择贴图
	'selectMaterial', // 选择材质
	'selectAudio', // 选择音频
	'selectAnimation', // 选择动画
	'selectParticle', // 选择粒子
	// 状态栏事件
	'enableThrowBall'];

	var ID = -1;
	/**
	 * 事件基类
	 * @author tengge / https://github.com/tengge1
	 */

	function BaseEvent(app) {
	  this.id = `${this.constructor.name}${ID--}`;
	}

	BaseEvent.prototype.start = function () {};

	BaseEvent.prototype.stop = function () {};

	/**
	 * 事件执行器
	 * @author tengge / https://github.com/tengge1
	 */

	function EventDispatcher(app) {
	  this.dispatch = d3.dispatch.apply(d3.dispatch, EventList);
	  this.addDomEventListener();
	  this.events = [];
	}

	EventDispatcher.prototype = Object.create(BaseEvent.prototype);
	EventDispatcher.prototype.constructor = EventDispatcher;
	/**
	 * 启动
	 */

	EventDispatcher.prototype.start = function () {
	  this.events.forEach(n => {
	    n.start();
	  });
	};
	/**
	 * 停止
	 */


	EventDispatcher.prototype.stop = function () {
	  this.events.forEach(n => {
	    n.stop();
	  });
	};
	/**
	 * 执行事件
	 * @param {*} eventName 
	 * @param {*} _this 
	 * @param {*} others 
	 */


	EventDispatcher.prototype.call = function (eventName, _this, ...others) {
	  this.dispatch.call(eventName, _this, ...others);
	};
	/**
	 * 监听事件
	 * @param {*} eventName 
	 * @param {*} callback 
	 */


	EventDispatcher.prototype.on = function (eventName, callback) {
	  this.dispatch.on(eventName, callback);
	};
	/**
	 * 监听dom事件
	 */


	EventDispatcher.prototype.addDomEventListener = function () {
	  var container = app.container;
	  container.addEventListener('click', event => {
	    this.dispatch.call('click', this, event);
	  });
	  container.addEventListener('contextmenu', event => {
	    this.dispatch.call('contextmenu', this, event);
	    event.preventDefault();
	    return false;
	  });
	  container.addEventListener('dblclick', event => {
	    this.dispatch.call('dblclick', this, event);
	  });
	  document.addEventListener('keydown', event => {
	    this.dispatch.call('keydown', this, event);
	  });
	  document.addEventListener('keyup', event => {
	    this.dispatch.call('keyup', this, event);
	  });
	  container.addEventListener('mousedown', event => {
	    this.dispatch.call('mousedown', this, event);
	  });
	  container.addEventListener('mousemove', event => {
	    this.dispatch.call('mousemove', this, event);
	  });
	  container.addEventListener('mouseup', event => {
	    this.dispatch.call('mouseup', this, event);
	  });
	  container.addEventListener('mousewheel', event => {
	    this.dispatch.call('mousewheel', this, event);
	  });
	  window.addEventListener('resize', event => {
	    this.dispatch.call('resize', this, event);
	  }, false);
	  document.addEventListener('dragover', event => {
	    this.dispatch.call('dragover', this, event);
	  }, false);
	  document.addEventListener('drop', event => {
	    this.dispatch.call('drop', this, event);
	  }, false);
	};

	function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

	function _typeof(obj) {
	  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
	    _typeof = function _typeof(obj) {
	      return _typeof2(obj);
	    };
	  } else {
	    _typeof = function _typeof(obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
	    };
	  }

	  return _typeof(obj);
	}

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty(target, key, source[key]);
	    });
	  }

	  return target;
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	function _assertThisInitialized(self) {
	  if (self === void 0) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return self;
	}

	function _possibleConstructorReturn(self, call) {
	  if (call && (_typeof(call) === "object" || typeof call === "function")) {
	    return call;
	  }

	  return _assertThisInitialized(self);
	}

	function _getPrototypeOf(o) {
	  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	    return o.__proto__ || Object.getPrototypeOf(o);
	  };
	  return _getPrototypeOf(o);
	}

	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function");
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf(subClass, superClass);
	}

	function _arrayWithoutHoles(arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
	      arr2[i] = arr[i];
	    }

	    return arr2;
	  }
	}

	function _iterableToArray(iter) {
	  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
	}

	function _nonIterableSpread() {
	  throw new TypeError("Invalid attempt to spread non-iterable instance");
	}

	function _toConsumableArray(arr) {
	  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
	}

	function _arrayWithHoles(arr) {
	  if (Array.isArray(arr)) return arr;
	}

	function _iterableToArrayLimit(arr, i) {
	  var _arr = [];
	  var _n = true;
	  var _d = false;
	  var _e = undefined;

	  try {
	    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	      _arr.push(_s.value);

	      if (i && _arr.length === i) break;
	    }
	  } catch (err) {
	    _d = true;
	    _e = err;
	  } finally {
	    try {
	      if (!_n && _i["return"] != null) _i["return"]();
	    } finally {
	      if (_d) throw _e;
	    }
	  }

	  return _arr;
	}

	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance");
	}

	function _slicedToArray(arr, i) {
	  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
	}

	var consoleLogger = {
	  type: 'logger',
	  log: function log(args) {
	    this.output('log', args);
	  },
	  warn: function warn(args) {
	    this.output('warn', args);
	  },
	  error: function error(args) {
	    this.output('error', args);
	  },
	  output: function output(type, args) {
	    var _console;

	    /* eslint no-console: 0 */
	    if (console && console[type]) (_console = console)[type].apply(_console, _toConsumableArray(args));
	  }
	};

	var Logger =
	/*#__PURE__*/
	function () {
	  function Logger(concreteLogger) {
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	    _classCallCheck(this, Logger);

	    this.init(concreteLogger, options);
	  }

	  _createClass(Logger, [{
	    key: "init",
	    value: function init(concreteLogger) {
	      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      this.prefix = options.prefix || 'i18next:';
	      this.logger = concreteLogger || consoleLogger;
	      this.options = options;
	      this.debug = options.debug;
	    }
	  }, {
	    key: "setDebug",
	    value: function setDebug(bool) {
	      this.debug = bool;
	    }
	  }, {
	    key: "log",
	    value: function log() {
	      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      return this.forward(args, 'log', '', true);
	    }
	  }, {
	    key: "warn",
	    value: function warn() {
	      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        args[_key2] = arguments[_key2];
	      }

	      return this.forward(args, 'warn', '', true);
	    }
	  }, {
	    key: "error",
	    value: function error() {
	      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	        args[_key3] = arguments[_key3];
	      }

	      return this.forward(args, 'error', '');
	    }
	  }, {
	    key: "deprecate",
	    value: function deprecate() {
	      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
	        args[_key4] = arguments[_key4];
	      }

	      return this.forward(args, 'warn', 'WARNING DEPRECATED: ', true);
	    }
	  }, {
	    key: "forward",
	    value: function forward(args, lvl, prefix, debugOnly) {
	      if (debugOnly && !this.debug) return null;
	      if (typeof args[0] === 'string') args[0] = "".concat(prefix).concat(this.prefix, " ").concat(args[0]);
	      return this.logger[lvl](args);
	    }
	  }, {
	    key: "create",
	    value: function create(moduleName) {
	      return new Logger(this.logger, _objectSpread({}, {
	        prefix: "".concat(this.prefix, ":").concat(moduleName, ":")
	      }, this.options));
	    }
	  }]);

	  return Logger;
	}();

	var baseLogger = new Logger();

	var EventEmitter =
	/*#__PURE__*/
	function () {
	  function EventEmitter() {
	    _classCallCheck(this, EventEmitter);

	    this.observers = {};
	  }

	  _createClass(EventEmitter, [{
	    key: "on",
	    value: function on(events, listener) {
	      var _this = this;

	      events.split(' ').forEach(function (event) {
	        _this.observers[event] = _this.observers[event] || [];

	        _this.observers[event].push(listener);
	      });
	      return this;
	    }
	  }, {
	    key: "off",
	    value: function off(event, listener) {
	      var _this2 = this;

	      if (!this.observers[event]) {
	        return;
	      }

	      this.observers[event].forEach(function () {
	        if (!listener) {
	          delete _this2.observers[event];
	        } else {
	          var index = _this2.observers[event].indexOf(listener);

	          if (index > -1) {
	            _this2.observers[event].splice(index, 1);
	          }
	        }
	      });
	    }
	  }, {
	    key: "emit",
	    value: function emit(event) {
	      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      if (this.observers[event]) {
	        var cloned = [].concat(this.observers[event]);
	        cloned.forEach(function (observer) {
	          observer.apply(void 0, args);
	        });
	      }

	      if (this.observers['*']) {
	        var _cloned = [].concat(this.observers['*']);

	        _cloned.forEach(function (observer) {
	          observer.apply(observer, [event].concat(args));
	        });
	      }
	    }
	  }]);

	  return EventEmitter;
	}();

	// http://lea.verou.me/2016/12/resolve-promises-externally-with-this-one-weird-trick/
	function defer() {
	  var res;
	  var rej;
	  var promise = new Promise(function (resolve, reject) {
	    res = resolve;
	    rej = reject;
	  });
	  promise.resolve = res;
	  promise.reject = rej;
	  return promise;
	}
	function makeString(object) {
	  if (object == null) return '';
	  /* eslint prefer-template: 0 */

	  return '' + object;
	}
	function copy(a, s, t) {
	  a.forEach(function (m) {
	    if (s[m]) t[m] = s[m];
	  });
	}

	function getLastOfPath(object, path, Empty) {
	  function cleanKey(key) {
	    return key && key.indexOf('###') > -1 ? key.replace(/###/g, '.') : key;
	  }

	  function canNotTraverseDeeper() {
	    return !object || typeof object === 'string';
	  }

	  var stack = typeof path !== 'string' ? [].concat(path) : path.split('.');

	  while (stack.length > 1) {
	    if (canNotTraverseDeeper()) return {};
	    var key = cleanKey(stack.shift());
	    if (!object[key] && Empty) object[key] = new Empty();
	    object = object[key];
	  }

	  if (canNotTraverseDeeper()) return {};
	  return {
	    obj: object,
	    k: cleanKey(stack.shift())
	  };
	}

	function setPath(object, path, newValue) {
	  var _getLastOfPath = getLastOfPath(object, path, Object),
	      obj = _getLastOfPath.obj,
	      k = _getLastOfPath.k;

	  obj[k] = newValue;
	}
	function pushPath(object, path, newValue, concat) {
	  var _getLastOfPath2 = getLastOfPath(object, path, Object),
	      obj = _getLastOfPath2.obj,
	      k = _getLastOfPath2.k;

	  obj[k] = obj[k] || [];
	  if (concat) obj[k] = obj[k].concat(newValue);
	  if (!concat) obj[k].push(newValue);
	}
	function getPath(object, path) {
	  var _getLastOfPath3 = getLastOfPath(object, path),
	      obj = _getLastOfPath3.obj,
	      k = _getLastOfPath3.k;

	  if (!obj) return undefined;
	  return obj[k];
	}
	function deepExtend(target, source, overwrite) {
	  /* eslint no-restricted-syntax: 0 */
	  for (var prop in source) {
	    if (prop in target) {
	      // If we reached a leaf string in target or source then replace with source or skip depending on the 'overwrite' switch
	      if (typeof target[prop] === 'string' || target[prop] instanceof String || typeof source[prop] === 'string' || source[prop] instanceof String) {
	        if (overwrite) target[prop] = source[prop];
	      } else {
	        deepExtend(target[prop], source[prop], overwrite);
	      }
	    } else {
	      target[prop] = source[prop];
	    }
	  }

	  return target;
	}
	function regexEscape(str) {
	  /* eslint no-useless-escape: 0 */
	  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
	}
	/* eslint-disable */

	var _entityMap = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;',
	  "'": '&#39;',
	  '/': '&#x2F;'
	};
	/* eslint-enable */

	function escape(data) {
	  if (typeof data === 'string') {
	    return data.replace(/[&<>"'\/]/g, function (s) {
	      return _entityMap[s];
	    });
	  }

	  return data;
	}

	var ResourceStore =
	/*#__PURE__*/
	function (_EventEmitter) {
	  _inherits(ResourceStore, _EventEmitter);

	  function ResourceStore(data) {
	    var _this;

	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
	      ns: ['translation'],
	      defaultNS: 'translation'
	    };

	    _classCallCheck(this, ResourceStore);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(ResourceStore).call(this));
	    EventEmitter.call(_assertThisInitialized(_this)); // <=IE10 fix (unable to call parent constructor)

	    _this.data = data || {};
	    _this.options = options;

	    if (_this.options.keySeparator === undefined) {
	      _this.options.keySeparator = '.';
	    }

	    return _this;
	  }

	  _createClass(ResourceStore, [{
	    key: "addNamespaces",
	    value: function addNamespaces(ns) {
	      if (this.options.ns.indexOf(ns) < 0) {
	        this.options.ns.push(ns);
	      }
	    }
	  }, {
	    key: "removeNamespaces",
	    value: function removeNamespaces(ns) {
	      var index = this.options.ns.indexOf(ns);

	      if (index > -1) {
	        this.options.ns.splice(index, 1);
	      }
	    }
	  }, {
	    key: "getResource",
	    value: function getResource(lng, ns, key) {
	      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	      var keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
	      var path = [lng, ns];
	      if (key && typeof key !== 'string') path = path.concat(key);
	      if (key && typeof key === 'string') path = path.concat(keySeparator ? key.split(keySeparator) : key);

	      if (lng.indexOf('.') > -1) {
	        path = lng.split('.');
	      }

	      return getPath(this.data, path);
	    }
	  }, {
	    key: "addResource",
	    value: function addResource(lng, ns, key, value) {
	      var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
	        silent: false
	      };
	      var keySeparator = this.options.keySeparator;
	      if (keySeparator === undefined) keySeparator = '.';
	      var path = [lng, ns];
	      if (key) path = path.concat(keySeparator ? key.split(keySeparator) : key);

	      if (lng.indexOf('.') > -1) {
	        path = lng.split('.');
	        value = ns;
	        ns = path[1];
	      }

	      this.addNamespaces(ns);
	      setPath(this.data, path, value);
	      if (!options.silent) this.emit('added', lng, ns, key, value);
	    }
	  }, {
	    key: "addResources",
	    value: function addResources(lng, ns, resources) {
	      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
	        silent: false
	      };

	      /* eslint no-restricted-syntax: 0 */
	      for (var m in resources) {
	        if (typeof resources[m] === 'string' || Object.prototype.toString.apply(resources[m]) === '[object Array]') this.addResource(lng, ns, m, resources[m], {
	          silent: true
	        });
	      }

	      if (!options.silent) this.emit('added', lng, ns, resources);
	    }
	  }, {
	    key: "addResourceBundle",
	    value: function addResourceBundle(lng, ns, resources, deep, overwrite) {
	      var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {
	        silent: false
	      };
	      var path = [lng, ns];

	      if (lng.indexOf('.') > -1) {
	        path = lng.split('.');
	        deep = resources;
	        resources = ns;
	        ns = path[1];
	      }

	      this.addNamespaces(ns);
	      var pack = getPath(this.data, path) || {};

	      if (deep) {
	        deepExtend(pack, resources, overwrite);
	      } else {
	        pack = _objectSpread({}, pack, resources);
	      }

	      setPath(this.data, path, pack);
	      if (!options.silent) this.emit('added', lng, ns, resources);
	    }
	  }, {
	    key: "removeResourceBundle",
	    value: function removeResourceBundle(lng, ns) {
	      if (this.hasResourceBundle(lng, ns)) {
	        delete this.data[lng][ns];
	      }

	      this.removeNamespaces(ns);
	      this.emit('removed', lng, ns);
	    }
	  }, {
	    key: "hasResourceBundle",
	    value: function hasResourceBundle(lng, ns) {
	      return this.getResource(lng, ns) !== undefined;
	    }
	  }, {
	    key: "getResourceBundle",
	    value: function getResourceBundle(lng, ns) {
	      if (!ns) ns = this.options.defaultNS; // COMPATIBILITY: remove extend in v2.1.0

	      if (this.options.compatibilityAPI === 'v1') return _objectSpread({}, {}, this.getResource(lng, ns));
	      return this.getResource(lng, ns);
	    }
	  }, {
	    key: "getDataByLanguage",
	    value: function getDataByLanguage(lng) {
	      return this.data[lng];
	    }
	  }, {
	    key: "toJSON",
	    value: function toJSON() {
	      return this.data;
	    }
	  }]);

	  return ResourceStore;
	}(EventEmitter);

	var postProcessor = {
	  processors: {},
	  addPostProcessor: function addPostProcessor(module) {
	    this.processors[module.name] = module;
	  },
	  handle: function handle(processors, value, key, options, translator) {
	    var _this = this;

	    processors.forEach(function (processor) {
	      if (_this.processors[processor]) value = _this.processors[processor].process(value, key, options, translator);
	    });
	    return value;
	  }
	};

	var Translator =
	/*#__PURE__*/
	function (_EventEmitter) {
	  _inherits(Translator, _EventEmitter);

	  function Translator(services) {
	    var _this;

	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	    _classCallCheck(this, Translator);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(Translator).call(this));
	    EventEmitter.call(_assertThisInitialized(_this)); // <=IE10 fix (unable to call parent constructor)

	    copy(['resourceStore', 'languageUtils', 'pluralResolver', 'interpolator', 'backendConnector', 'i18nFormat'], services, _assertThisInitialized(_this));
	    _this.options = options;

	    if (_this.options.keySeparator === undefined) {
	      _this.options.keySeparator = '.';
	    }

	    _this.logger = baseLogger.create('translator');
	    return _this;
	  }

	  _createClass(Translator, [{
	    key: "changeLanguage",
	    value: function changeLanguage(lng) {
	      if (lng) this.language = lng;
	    }
	  }, {
	    key: "exists",
	    value: function exists(key) {
	      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
	        interpolation: {}
	      };
	      var resolved = this.resolve(key, options);
	      return resolved && resolved.res !== undefined;
	    }
	  }, {
	    key: "extractFromKey",
	    value: function extractFromKey(key, options) {
	      var nsSeparator = options.nsSeparator || this.options.nsSeparator;
	      if (nsSeparator === undefined) nsSeparator = ':';
	      var keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
	      var namespaces = options.ns || this.options.defaultNS;

	      if (nsSeparator && key.indexOf(nsSeparator) > -1) {
	        var parts = key.split(nsSeparator);
	        if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1) namespaces = parts.shift();
	        key = parts.join(keySeparator);
	      }

	      if (typeof namespaces === 'string') namespaces = [namespaces];
	      return {
	        key: key,
	        namespaces: namespaces
	      };
	    }
	  }, {
	    key: "translate",
	    value: function translate(keys, options) {
	      var _this2 = this;

	      if (_typeof(options) !== 'object' && this.options.overloadTranslationOptionHandler) {
	        /* eslint prefer-rest-params: 0 */
	        options = this.options.overloadTranslationOptionHandler(arguments);
	      }

	      if (!options) options = {}; // non valid keys handling

	      if (keys === undefined || keys === null) return '';
	      if (!Array.isArray(keys)) keys = [String(keys)]; // separators

	      var keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator; // get namespace(s)

	      var _this$extractFromKey = this.extractFromKey(keys[keys.length - 1], options),
	          key = _this$extractFromKey.key,
	          namespaces = _this$extractFromKey.namespaces;

	      var namespace = namespaces[namespaces.length - 1]; // return key on CIMode

	      var lng = options.lng || this.language;
	      var appendNamespaceToCIMode = options.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;

	      if (lng && lng.toLowerCase() === 'cimode') {
	        if (appendNamespaceToCIMode) {
	          var nsSeparator = options.nsSeparator || this.options.nsSeparator;
	          return namespace + nsSeparator + key;
	        }

	        return key;
	      } // resolve from store


	      var resolved = this.resolve(keys, options);
	      var res = resolved && resolved.res;
	      var resUsedKey = resolved && resolved.usedKey || key;
	      var resExactUsedKey = resolved && resolved.exactUsedKey || key;
	      var resType = Object.prototype.toString.apply(res);
	      var noObject = ['[object Number]', '[object Function]', '[object RegExp]'];
	      var joinArrays = options.joinArrays !== undefined ? options.joinArrays : this.options.joinArrays; // object

	      var handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
	      var handleAsObject = typeof res !== 'string' && typeof res !== 'boolean' && typeof res !== 'number';

	      if (handleAsObjectInI18nFormat && res && handleAsObject && noObject.indexOf(resType) < 0 && !(typeof joinArrays === 'string' && resType === '[object Array]')) {
	        if (!options.returnObjects && !this.options.returnObjects) {
	          this.logger.warn('accessing an object - but returnObjects options is not enabled!');
	          return this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, res, options) : "key '".concat(key, " (").concat(this.language, ")' returned an object instead of string.");
	        } // if we got a separator we loop over children - else we just return object as is
	        // as having it set to false means no hierarchy so no lookup for nested values


	        if (keySeparator) {
	          var resTypeIsArray = resType === '[object Array]';
	          var copy$$1 = resTypeIsArray ? [] : {}; // apply child translation on a copy

	          /* eslint no-restricted-syntax: 0 */

	          var newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;

	          for (var m in res) {
	            if (Object.prototype.hasOwnProperty.call(res, m)) {
	              var deepKey = "".concat(newKeyToUse).concat(keySeparator).concat(m);
	              copy$$1[m] = this.translate(deepKey, _objectSpread({}, options, {
	                joinArrays: false,
	                ns: namespaces
	              }));
	              if (copy$$1[m] === deepKey) copy$$1[m] = res[m]; // if nothing found use orginal value as fallback
	            }
	          }

	          res = copy$$1;
	        }
	      } else if (handleAsObjectInI18nFormat && typeof joinArrays === 'string' && resType === '[object Array]') {
	        // array special treatment
	        res = res.join(joinArrays);
	        if (res) res = this.extendTranslation(res, keys, options);
	      } else {
	        // string, empty or null
	        var usedDefault = false;
	        var usedKey = false; // fallback value

	        if (!this.isValidLookup(res) && options.defaultValue !== undefined) {
	          usedDefault = true;

	          if (options.count !== undefined) {
	            var suffix = this.pluralResolver.getSuffix(lng, options.count);
	            res = options["defaultValue".concat(suffix)];
	          }

	          if (!res) res = options.defaultValue;
	        }

	        if (!this.isValidLookup(res)) {
	          usedKey = true;
	          res = key;
	        } // save missing


	        var updateMissing = options.defaultValue && options.defaultValue !== res && this.options.updateMissing;

	        if (usedKey || usedDefault || updateMissing) {
	          this.logger.log(updateMissing ? 'updateKey' : 'missingKey', lng, namespace, key, updateMissing ? options.defaultValue : res);
	          var lngs = [];
	          var fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, options.lng || this.language);

	          if (this.options.saveMissingTo === 'fallback' && fallbackLngs && fallbackLngs[0]) {
	            for (var i = 0; i < fallbackLngs.length; i++) {
	              lngs.push(fallbackLngs[i]);
	            }
	          } else if (this.options.saveMissingTo === 'all') {
	            lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
	          } else {
	            lngs.push(options.lng || this.language);
	          }

	          var send = function send(l, k) {
	            if (_this2.options.missingKeyHandler) {
	              _this2.options.missingKeyHandler(l, namespace, k, updateMissing ? options.defaultValue : res, updateMissing, options);
	            } else if (_this2.backendConnector && _this2.backendConnector.saveMissing) {
	              _this2.backendConnector.saveMissing(l, namespace, k, updateMissing ? options.defaultValue : res, updateMissing, options);
	            }

	            _this2.emit('missingKey', l, namespace, k, res);
	          };

	          if (this.options.saveMissing) {
	            var needsPluralHandling = options.count !== undefined && typeof options.count !== 'string';

	            if (this.options.saveMissingPlurals && needsPluralHandling) {
	              lngs.forEach(function (l) {
	                var plurals = _this2.pluralResolver.getPluralFormsOfKey(l, key);

	                plurals.forEach(function (p) {
	                  return send([l], p);
	                });
	              });
	            } else {
	              send(lngs, key);
	            }
	          }
	        } // extend


	        res = this.extendTranslation(res, keys, options, resolved); // append namespace if still key

	        if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = "".concat(namespace, ":").concat(key); // parseMissingKeyHandler

	        if (usedKey && this.options.parseMissingKeyHandler) res = this.options.parseMissingKeyHandler(res);
	      } // return


	      return res;
	    }
	  }, {
	    key: "extendTranslation",
	    value: function extendTranslation(res, key, options, resolved) {
	      var _this3 = this;

	      if (this.i18nFormat && this.i18nFormat.parse) {
	        res = this.i18nFormat.parse(res, options, resolved.usedLng, resolved.usedNS, resolved.usedKey, {
	          resolved: resolved
	        });
	      } else if (!options.skipInterpolation) {
	        // i18next.parsing
	        if (options.interpolation) this.interpolator.init(_objectSpread({}, options, {
	          interpolation: _objectSpread({}, this.options.interpolation, options.interpolation)
	        })); // interpolate

	        var data = options.replace && typeof options.replace !== 'string' ? options.replace : options;
	        if (this.options.interpolation.defaultVariables) data = _objectSpread({}, this.options.interpolation.defaultVariables, data);
	        res = this.interpolator.interpolate(res, data, options.lng || this.language, options); // nesting

	        if (options.nest !== false) res = this.interpolator.nest(res, function () {
	          return _this3.translate.apply(_this3, arguments);
	        }, options);
	        if (options.interpolation) this.interpolator.reset();
	      } // post process


	      var postProcess = options.postProcess || this.options.postProcess;
	      var postProcessorNames = typeof postProcess === 'string' ? [postProcess] : postProcess;

	      if (res !== undefined && res !== null && postProcessorNames && postProcessorNames.length && options.applyPostProcessor !== false) {
	        res = postProcessor.handle(postProcessorNames, res, key, options, this);
	      }

	      return res;
	    }
	  }, {
	    key: "resolve",
	    value: function resolve(keys) {
	      var _this4 = this;

	      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      var found;
	      var usedKey; // plain key

	      var exactUsedKey; // key with context / plural

	      var usedLng;
	      var usedNS;
	      if (typeof keys === 'string') keys = [keys]; // forEach possible key

	      keys.forEach(function (k) {
	        if (_this4.isValidLookup(found)) return;

	        var extracted = _this4.extractFromKey(k, options);

	        var key = extracted.key;
	        usedKey = key;
	        var namespaces = extracted.namespaces;
	        if (_this4.options.fallbackNS) namespaces = namespaces.concat(_this4.options.fallbackNS);
	        var needsPluralHandling = options.count !== undefined && typeof options.count !== 'string';
	        var needsContextHandling = options.context !== undefined && typeof options.context === 'string' && options.context !== '';
	        var codes = options.lngs ? options.lngs : _this4.languageUtils.toResolveHierarchy(options.lng || _this4.language, options.fallbackLng);
	        namespaces.forEach(function (ns) {
	          if (_this4.isValidLookup(found)) return;
	          usedNS = ns;
	          codes.forEach(function (code) {
	            if (_this4.isValidLookup(found)) return;
	            usedLng = code;
	            var finalKey = key;
	            var finalKeys = [finalKey];

	            if (_this4.i18nFormat && _this4.i18nFormat.addLookupKeys) {
	              _this4.i18nFormat.addLookupKeys(finalKeys, key, code, ns, options);
	            } else {
	              var pluralSuffix;
	              if (needsPluralHandling) pluralSuffix = _this4.pluralResolver.getSuffix(code, options.count); // fallback for plural if context not found

	              if (needsPluralHandling && needsContextHandling) finalKeys.push(finalKey + pluralSuffix); // get key for context if needed

	              if (needsContextHandling) finalKeys.push(finalKey += "".concat(_this4.options.contextSeparator).concat(options.context)); // get key for plural if needed

	              if (needsPluralHandling) finalKeys.push(finalKey += pluralSuffix);
	            } // iterate over finalKeys starting with most specific pluralkey (-> contextkey only) -> singularkey only


	            var possibleKey;
	            /* eslint no-cond-assign: 0 */

	            while (possibleKey = finalKeys.pop()) {
	              if (!_this4.isValidLookup(found)) {
	                exactUsedKey = possibleKey;
	                found = _this4.getResource(code, ns, possibleKey, options);
	              }
	            }
	          });
	        });
	      });
	      return {
	        res: found,
	        usedKey: usedKey,
	        exactUsedKey: exactUsedKey,
	        usedLng: usedLng,
	        usedNS: usedNS
	      };
	    }
	  }, {
	    key: "isValidLookup",
	    value: function isValidLookup(res) {
	      return res !== undefined && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === '');
	    }
	  }, {
	    key: "getResource",
	    value: function getResource(code, ns, key) {
	      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	      if (this.i18nFormat && this.i18nFormat.getResource) return this.i18nFormat.getResource(code, ns, key, options);
	      return this.resourceStore.getResource(code, ns, key, options);
	    }
	  }]);

	  return Translator;
	}(EventEmitter);

	function capitalize(string) {
	  return string.charAt(0).toUpperCase() + string.slice(1);
	}

	var LanguageUtil =
	/*#__PURE__*/
	function () {
	  function LanguageUtil(options) {
	    _classCallCheck(this, LanguageUtil);

	    this.options = options;
	    this.whitelist = this.options.whitelist || false;
	    this.logger = baseLogger.create('languageUtils');
	  }

	  _createClass(LanguageUtil, [{
	    key: "getScriptPartFromCode",
	    value: function getScriptPartFromCode(code) {
	      if (!code || code.indexOf('-') < 0) return null;
	      var p = code.split('-');
	      if (p.length === 2) return null;
	      p.pop();
	      return this.formatLanguageCode(p.join('-'));
	    }
	  }, {
	    key: "getLanguagePartFromCode",
	    value: function getLanguagePartFromCode(code) {
	      if (!code || code.indexOf('-') < 0) return code;
	      var p = code.split('-');
	      return this.formatLanguageCode(p[0]);
	    }
	  }, {
	    key: "formatLanguageCode",
	    value: function formatLanguageCode(code) {
	      // http://www.iana.org/assignments/language-tags/language-tags.xhtml
	      if (typeof code === 'string' && code.indexOf('-') > -1) {
	        var specialCases = ['hans', 'hant', 'latn', 'cyrl', 'cans', 'mong', 'arab'];
	        var p = code.split('-');

	        if (this.options.lowerCaseLng) {
	          p = p.map(function (part) {
	            return part.toLowerCase();
	          });
	        } else if (p.length === 2) {
	          p[0] = p[0].toLowerCase();
	          p[1] = p[1].toUpperCase();
	          if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
	        } else if (p.length === 3) {
	          p[0] = p[0].toLowerCase(); // if lenght 2 guess it's a country

	          if (p[1].length === 2) p[1] = p[1].toUpperCase();
	          if (p[0] !== 'sgn' && p[2].length === 2) p[2] = p[2].toUpperCase();
	          if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
	          if (specialCases.indexOf(p[2].toLowerCase()) > -1) p[2] = capitalize(p[2].toLowerCase());
	        }

	        return p.join('-');
	      }

	      return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
	    }
	  }, {
	    key: "isWhitelisted",
	    value: function isWhitelisted(code) {
	      if (this.options.load === 'languageOnly' || this.options.nonExplicitWhitelist) {
	        code = this.getLanguagePartFromCode(code);
	      }

	      return !this.whitelist || !this.whitelist.length || this.whitelist.indexOf(code) > -1;
	    }
	  }, {
	    key: "getFallbackCodes",
	    value: function getFallbackCodes(fallbacks, code) {
	      if (!fallbacks) return [];
	      if (typeof fallbacks === 'string') fallbacks = [fallbacks];
	      if (Object.prototype.toString.apply(fallbacks) === '[object Array]') return fallbacks;
	      if (!code) return fallbacks["default"] || []; // asume we have an object defining fallbacks

	      var found = fallbacks[code];
	      if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
	      if (!found) found = fallbacks[this.formatLanguageCode(code)];
	      if (!found) found = fallbacks["default"];
	      return found || [];
	    }
	  }, {
	    key: "toResolveHierarchy",
	    value: function toResolveHierarchy(code, fallbackCode) {
	      var _this = this;

	      var fallbackCodes = this.getFallbackCodes(fallbackCode || this.options.fallbackLng || [], code);
	      var codes = [];

	      var addCode = function addCode(c) {
	        if (!c) return;

	        if (_this.isWhitelisted(c)) {
	          codes.push(c);
	        } else {
	          _this.logger.warn("rejecting non-whitelisted language code: ".concat(c));
	        }
	      };

	      if (typeof code === 'string' && code.indexOf('-') > -1) {
	        if (this.options.load !== 'languageOnly') addCode(this.formatLanguageCode(code));
	        if (this.options.load !== 'languageOnly' && this.options.load !== 'currentOnly') addCode(this.getScriptPartFromCode(code));
	        if (this.options.load !== 'currentOnly') addCode(this.getLanguagePartFromCode(code));
	      } else if (typeof code === 'string') {
	        addCode(this.formatLanguageCode(code));
	      }

	      fallbackCodes.forEach(function (fc) {
	        if (codes.indexOf(fc) < 0) addCode(_this.formatLanguageCode(fc));
	      });
	      return codes;
	    }
	  }]);

	  return LanguageUtil;
	}();

	/* eslint-disable */

	var sets = [{
	  lngs: ['ach', 'ak', 'am', 'arn', 'br', 'fil', 'gun', 'ln', 'mfe', 'mg', 'mi', 'oc', 'pt', 'pt-BR', 'tg', 'ti', 'tr', 'uz', 'wa'],
	  nr: [1, 2],
	  fc: 1
	}, {
	  lngs: ['af', 'an', 'ast', 'az', 'bg', 'bn', 'ca', 'da', 'de', 'dev', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fi', 'fo', 'fur', 'fy', 'gl', 'gu', 'ha', 'hi', 'hu', 'hy', 'ia', 'it', 'kn', 'ku', 'lb', 'mai', 'ml', 'mn', 'mr', 'nah', 'nap', 'nb', 'ne', 'nl', 'nn', 'no', 'nso', 'pa', 'pap', 'pms', 'ps', 'pt-PT', 'rm', 'sco', 'se', 'si', 'so', 'son', 'sq', 'sv', 'sw', 'ta', 'te', 'tk', 'ur', 'yo'],
	  nr: [1, 2],
	  fc: 2
	}, {
	  lngs: ['ay', 'bo', 'cgg', 'fa', 'id', 'ja', 'jbo', 'ka', 'kk', 'km', 'ko', 'ky', 'lo', 'ms', 'sah', 'su', 'th', 'tt', 'ug', 'vi', 'wo', 'zh'],
	  nr: [1],
	  fc: 3
	}, {
	  lngs: ['be', 'bs', 'cnr', 'dz', 'hr', 'ru', 'sr', 'uk'],
	  nr: [1, 2, 5],
	  fc: 4
	}, {
	  lngs: ['ar'],
	  nr: [0, 1, 2, 3, 11, 100],
	  fc: 5
	}, {
	  lngs: ['cs', 'sk'],
	  nr: [1, 2, 5],
	  fc: 6
	}, {
	  lngs: ['csb', 'pl'],
	  nr: [1, 2, 5],
	  fc: 7
	}, {
	  lngs: ['cy'],
	  nr: [1, 2, 3, 8],
	  fc: 8
	}, {
	  lngs: ['fr'],
	  nr: [1, 2],
	  fc: 9
	}, {
	  lngs: ['ga'],
	  nr: [1, 2, 3, 7, 11],
	  fc: 10
	}, {
	  lngs: ['gd'],
	  nr: [1, 2, 3, 20],
	  fc: 11
	}, {
	  lngs: ['is'],
	  nr: [1, 2],
	  fc: 12
	}, {
	  lngs: ['jv'],
	  nr: [0, 1],
	  fc: 13
	}, {
	  lngs: ['kw'],
	  nr: [1, 2, 3, 4],
	  fc: 14
	}, {
	  lngs: ['lt'],
	  nr: [1, 2, 10],
	  fc: 15
	}, {
	  lngs: ['lv'],
	  nr: [1, 2, 0],
	  fc: 16
	}, {
	  lngs: ['mk'],
	  nr: [1, 2],
	  fc: 17
	}, {
	  lngs: ['mnk'],
	  nr: [0, 1, 2],
	  fc: 18
	}, {
	  lngs: ['mt'],
	  nr: [1, 2, 11, 20],
	  fc: 19
	}, {
	  lngs: ['or'],
	  nr: [2, 1],
	  fc: 2
	}, {
	  lngs: ['ro'],
	  nr: [1, 2, 20],
	  fc: 20
	}, {
	  lngs: ['sl'],
	  nr: [5, 1, 2, 3],
	  fc: 21
	}, {
	  lngs: ['he'],
	  nr: [1, 2, 20, 21],
	  fc: 22
	}];
	var _rulesPluralsTypes = {
	  1: function _(n) {
	    return Number(n > 1);
	  },
	  2: function _(n) {
	    return Number(n != 1);
	  },
	  3: function _(n) {
	    return 0;
	  },
	  4: function _(n) {
	    return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
	  },
	  5: function _(n) {
	    return Number(n === 0 ? 0 : n == 1 ? 1 : n == 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5);
	  },
	  6: function _(n) {
	    return Number(n == 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2);
	  },
	  7: function _(n) {
	    return Number(n == 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
	  },
	  8: function _(n) {
	    return Number(n == 1 ? 0 : n == 2 ? 1 : n != 8 && n != 11 ? 2 : 3);
	  },
	  9: function _(n) {
	    return Number(n >= 2);
	  },
	  10: function _(n) {
	    return Number(n == 1 ? 0 : n == 2 ? 1 : n < 7 ? 2 : n < 11 ? 3 : 4);
	  },
	  11: function _(n) {
	    return Number(n == 1 || n == 11 ? 0 : n == 2 || n == 12 ? 1 : n > 2 && n < 20 ? 2 : 3);
	  },
	  12: function _(n) {
	    return Number(n % 10 != 1 || n % 100 == 11);
	  },
	  13: function _(n) {
	    return Number(n !== 0);
	  },
	  14: function _(n) {
	    return Number(n == 1 ? 0 : n == 2 ? 1 : n == 3 ? 2 : 3);
	  },
	  15: function _(n) {
	    return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
	  },
	  16: function _(n) {
	    return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n !== 0 ? 1 : 2);
	  },
	  17: function _(n) {
	    return Number(n == 1 || n % 10 == 1 ? 0 : 1);
	  },
	  18: function _(n) {
	    return Number(n == 0 ? 0 : n == 1 ? 1 : 2);
	  },
	  19: function _(n) {
	    return Number(n == 1 ? 0 : n === 0 || n % 100 > 1 && n % 100 < 11 ? 1 : n % 100 > 10 && n % 100 < 20 ? 2 : 3);
	  },
	  20: function _(n) {
	    return Number(n == 1 ? 0 : n === 0 || n % 100 > 0 && n % 100 < 20 ? 1 : 2);
	  },
	  21: function _(n) {
	    return Number(n % 100 == 1 ? 1 : n % 100 == 2 ? 2 : n % 100 == 3 || n % 100 == 4 ? 3 : 0);
	  },
	  22: function _(n) {
	    return Number(n === 1 ? 0 : n === 2 ? 1 : (n < 0 || n > 10) && n % 10 == 0 ? 2 : 3);
	  }
	};
	/* eslint-enable */

	function createRules() {
	  var rules = {};
	  sets.forEach(function (set) {
	    set.lngs.forEach(function (l) {
	      rules[l] = {
	        numbers: set.nr,
	        plurals: _rulesPluralsTypes[set.fc]
	      };
	    });
	  });
	  return rules;
	}

	var PluralResolver =
	/*#__PURE__*/
	function () {
	  function PluralResolver(languageUtils) {
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	    _classCallCheck(this, PluralResolver);

	    this.languageUtils = languageUtils;
	    this.options = options;
	    this.logger = baseLogger.create('pluralResolver');
	    this.rules = createRules();
	  }

	  _createClass(PluralResolver, [{
	    key: "addRule",
	    value: function addRule(lng, obj) {
	      this.rules[lng] = obj;
	    }
	  }, {
	    key: "getRule",
	    value: function getRule(code) {
	      return this.rules[code] || this.rules[this.languageUtils.getLanguagePartFromCode(code)];
	    }
	  }, {
	    key: "needsPlural",
	    value: function needsPlural(code) {
	      var rule = this.getRule(code);
	      return rule && rule.numbers.length > 1;
	    }
	  }, {
	    key: "getPluralFormsOfKey",
	    value: function getPluralFormsOfKey(code, key) {
	      var _this = this;

	      var ret = [];
	      var rule = this.getRule(code);
	      if (!rule) return ret;
	      rule.numbers.forEach(function (n) {
	        var suffix = _this.getSuffix(code, n);

	        ret.push("".concat(key).concat(suffix));
	      });
	      return ret;
	    }
	  }, {
	    key: "getSuffix",
	    value: function getSuffix(code, count) {
	      var _this2 = this;

	      var rule = this.getRule(code);

	      if (rule) {
	        // if (rule.numbers.length === 1) return ''; // only singular
	        var idx = rule.noAbs ? rule.plurals(count) : rule.plurals(Math.abs(count));
	        var suffix = rule.numbers[idx]; // special treatment for lngs only having singular and plural

	        if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
	          if (suffix === 2) {
	            suffix = 'plural';
	          } else if (suffix === 1) {
	            suffix = '';
	          }
	        }

	        var returnSuffix = function returnSuffix() {
	          return _this2.options.prepend && suffix.toString() ? _this2.options.prepend + suffix.toString() : suffix.toString();
	        }; // COMPATIBILITY JSON
	        // v1


	        if (this.options.compatibilityJSON === 'v1') {
	          if (suffix === 1) return '';
	          if (typeof suffix === 'number') return "_plural_".concat(suffix.toString());
	          return returnSuffix();
	        } else if (
	        /* v2 */
	        this.options.compatibilityJSON === 'v2') {
	          return returnSuffix();
	        } else if (
	        /* v3 - gettext index */
	        this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
	          return returnSuffix();
	        }

	        return this.options.prepend && idx.toString() ? this.options.prepend + idx.toString() : idx.toString();
	      }

	      this.logger.warn("no plural rule found for: ".concat(code));
	      return '';
	    }
	  }]);

	  return PluralResolver;
	}();

	var Interpolator =
	/*#__PURE__*/
	function () {
	  function Interpolator() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    _classCallCheck(this, Interpolator);

	    this.logger = baseLogger.create('interpolator');
	    this.init(options, true);
	  }
	  /* eslint no-param-reassign: 0 */


	  _createClass(Interpolator, [{
	    key: "init",
	    value: function init() {
	      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      var reset = arguments.length > 1 ? arguments[1] : undefined;

	      if (reset) {
	        this.options = options;

	        this.format = options.interpolation && options.interpolation.format || function (value) {
	          return value;
	        };
	      }

	      if (!options.interpolation) options.interpolation = {
	        escapeValue: true
	      };
	      var iOpts = options.interpolation;
	      this.escape = iOpts.escape !== undefined ? iOpts.escape : escape;
	      this.escapeValue = iOpts.escapeValue !== undefined ? iOpts.escapeValue : true;
	      this.useRawValueToEscape = iOpts.useRawValueToEscape !== undefined ? iOpts.useRawValueToEscape : false;
	      this.prefix = iOpts.prefix ? regexEscape(iOpts.prefix) : iOpts.prefixEscaped || '{{';
	      this.suffix = iOpts.suffix ? regexEscape(iOpts.suffix) : iOpts.suffixEscaped || '}}';
	      this.formatSeparator = iOpts.formatSeparator ? iOpts.formatSeparator : iOpts.formatSeparator || ',';
	      this.unescapePrefix = iOpts.unescapeSuffix ? '' : iOpts.unescapePrefix || '-';
	      this.unescapeSuffix = this.unescapePrefix ? '' : iOpts.unescapeSuffix || '';
	      this.nestingPrefix = iOpts.nestingPrefix ? regexEscape(iOpts.nestingPrefix) : iOpts.nestingPrefixEscaped || regexEscape('$t(');
	      this.nestingSuffix = iOpts.nestingSuffix ? regexEscape(iOpts.nestingSuffix) : iOpts.nestingSuffixEscaped || regexEscape(')');
	      this.maxReplaces = iOpts.maxReplaces ? iOpts.maxReplaces : 1000; // the regexp

	      this.resetRegExp();
	    }
	  }, {
	    key: "reset",
	    value: function reset() {
	      if (this.options) this.init(this.options);
	    }
	  }, {
	    key: "resetRegExp",
	    value: function resetRegExp() {
	      // the regexp
	      var regexpStr = "".concat(this.prefix, "(.+?)").concat(this.suffix);
	      this.regexp = new RegExp(regexpStr, 'g');
	      var regexpUnescapeStr = "".concat(this.prefix).concat(this.unescapePrefix, "(.+?)").concat(this.unescapeSuffix).concat(this.suffix);
	      this.regexpUnescape = new RegExp(regexpUnescapeStr, 'g');
	      var nestingRegexpStr = "".concat(this.nestingPrefix, "(.+?)").concat(this.nestingSuffix);
	      this.nestingRegexp = new RegExp(nestingRegexpStr, 'g');
	    }
	  }, {
	    key: "interpolate",
	    value: function interpolate(str, data, lng, options) {
	      var _this = this;

	      var match;
	      var value;
	      var replaces;

	      function regexSafe(val) {
	        return val.replace(/\$/g, '$$$$');
	      }

	      var handleFormat = function handleFormat(key) {
	        if (key.indexOf(_this.formatSeparator) < 0) return getPath(data, key);
	        var p = key.split(_this.formatSeparator);
	        var k = p.shift().trim();
	        var f = p.join(_this.formatSeparator).trim();
	        return _this.format(getPath(data, k), f, lng);
	      };

	      this.resetRegExp();
	      var missingInterpolationHandler = options && options.missingInterpolationHandler || this.options.missingInterpolationHandler;
	      replaces = 0; // unescape if has unescapePrefix/Suffix

	      /* eslint no-cond-assign: 0 */

	      while (match = this.regexpUnescape.exec(str)) {
	        value = handleFormat(match[1].trim());

	        if (value === undefined) {
	          if (typeof missingInterpolationHandler === 'function') {
	            var temp = missingInterpolationHandler(str, match, options);
	            value = typeof temp === 'string' ? temp : '';
	          } else {
	            this.logger.warn("missed to pass in variable ".concat(match[1], " for interpolating ").concat(str));
	            value = '';
	          }
	        }

	        str = str.replace(match[0], regexSafe(value));
	        this.regexpUnescape.lastIndex = 0;
	        replaces++;

	        if (replaces >= this.maxReplaces) {
	          break;
	        }
	      }

	      replaces = 0; // regular escape on demand

	      while (match = this.regexp.exec(str)) {
	        value = handleFormat(match[1].trim());

	        if (value === undefined) {
	          if (typeof missingInterpolationHandler === 'function') {
	            var _temp = missingInterpolationHandler(str, match, options);

	            value = typeof _temp === 'string' ? _temp : '';
	          } else {
	            this.logger.warn("missed to pass in variable ".concat(match[1], " for interpolating ").concat(str));
	            value = '';
	          }
	        } else if (typeof value !== 'string' && !this.useRawValueToEscape) {
	          value = makeString(value);
	        }

	        value = this.escapeValue ? regexSafe(this.escape(value)) : regexSafe(value);
	        str = str.replace(match[0], value);
	        this.regexp.lastIndex = 0;
	        replaces++;

	        if (replaces >= this.maxReplaces) {
	          break;
	        }
	      }

	      return str;
	    }
	  }, {
	    key: "nest",
	    value: function nest(str, fc) {
	      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	      var match;
	      var value;

	      var clonedOptions = _objectSpread({}, options);

	      clonedOptions.applyPostProcessor = false; // avoid post processing on nested lookup
	      // if value is something like "myKey": "lorem $(anotherKey, { "count": {{aValueInOptions}} })"

	      function handleHasOptions(key, inheritedOptions) {
	        if (key.indexOf(',') < 0) return key;
	        var p = key.split(',');
	        key = p.shift();
	        var optionsString = p.join(',');
	        optionsString = this.interpolate(optionsString, clonedOptions);
	        optionsString = optionsString.replace(/'/g, '"');

	        try {
	          clonedOptions = JSON.parse(optionsString);
	          if (inheritedOptions) clonedOptions = _objectSpread({}, inheritedOptions, clonedOptions);
	        } catch (e) {
	          this.logger.error("failed parsing options string in nesting for key ".concat(key), e);
	        }

	        return key;
	      } // regular escape on demand


	      while (match = this.nestingRegexp.exec(str)) {
	        value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions); // is only the nesting key (key1 = '$(key2)') return the value without stringify

	        if (value && match[0] === str && typeof value !== 'string') return value; // no string to include or empty

	        if (typeof value !== 'string') value = makeString(value);

	        if (!value) {
	          this.logger.warn("missed to resolve ".concat(match[1], " for nesting ").concat(str));
	          value = '';
	        } // Nested keys should not be escaped by default #854
	        // value = this.escapeValue ? regexSafe(utils.escape(value)) : regexSafe(value);


	        str = str.replace(match[0], value);
	        this.regexp.lastIndex = 0;
	      }

	      return str;
	    }
	  }]);

	  return Interpolator;
	}();

	function remove(arr, what) {
	  var found = arr.indexOf(what);

	  while (found !== -1) {
	    arr.splice(found, 1);
	    found = arr.indexOf(what);
	  }
	}

	var Connector =
	/*#__PURE__*/
	function (_EventEmitter) {
	  _inherits(Connector, _EventEmitter);

	  function Connector(backend, store, services) {
	    var _this;

	    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

	    _classCallCheck(this, Connector);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(Connector).call(this));
	    EventEmitter.call(_assertThisInitialized(_this)); // <=IE10 fix (unable to call parent constructor)

	    _this.backend = backend;
	    _this.store = store;
	    _this.languageUtils = services.languageUtils;
	    _this.options = options;
	    _this.logger = baseLogger.create('backendConnector');
	    _this.state = {};
	    _this.queue = [];

	    if (_this.backend && _this.backend.init) {
	      _this.backend.init(services, options.backend, options);
	    }

	    return _this;
	  }

	  _createClass(Connector, [{
	    key: "queueLoad",
	    value: function queueLoad(languages, namespaces, options, callback) {
	      var _this2 = this;

	      // find what needs to be loaded
	      var toLoad = [];
	      var pending = [];
	      var toLoadLanguages = [];
	      var toLoadNamespaces = [];
	      languages.forEach(function (lng) {
	        var hasAllNamespaces = true;
	        namespaces.forEach(function (ns) {
	          var name = "".concat(lng, "|").concat(ns);

	          if (!options.reload && _this2.store.hasResourceBundle(lng, ns)) {
	            _this2.state[name] = 2; // loaded
	          } else if (_this2.state[name] < 0) ; else if (_this2.state[name] === 1) {
	            if (pending.indexOf(name) < 0) pending.push(name);
	          } else {
	            _this2.state[name] = 1; // pending

	            hasAllNamespaces = false;
	            if (pending.indexOf(name) < 0) pending.push(name);
	            if (toLoad.indexOf(name) < 0) toLoad.push(name);
	            if (toLoadNamespaces.indexOf(ns) < 0) toLoadNamespaces.push(ns);
	          }
	        });
	        if (!hasAllNamespaces) toLoadLanguages.push(lng);
	      });

	      if (toLoad.length || pending.length) {
	        this.queue.push({
	          pending: pending,
	          loaded: {},
	          errors: [],
	          callback: callback
	        });
	      }

	      return {
	        toLoad: toLoad,
	        pending: pending,
	        toLoadLanguages: toLoadLanguages,
	        toLoadNamespaces: toLoadNamespaces
	      };
	    }
	  }, {
	    key: "loaded",
	    value: function loaded(name, err, data) {
	      var _name$split = name.split('|'),
	          _name$split2 = _slicedToArray(_name$split, 2),
	          lng = _name$split2[0],
	          ns = _name$split2[1];

	      if (err) this.emit('failedLoading', lng, ns, err);

	      if (data) {
	        this.store.addResourceBundle(lng, ns, data);
	      } // set loaded


	      this.state[name] = err ? -1 : 2; // consolidated loading done in this run - only emit once for a loaded namespace

	      var loaded = {}; // callback if ready

	      this.queue.forEach(function (q) {
	        pushPath(q.loaded, [lng], ns);
	        remove(q.pending, name);
	        if (err) q.errors.push(err);

	        if (q.pending.length === 0 && !q.done) {
	          // only do once per loaded -> this.emit('loaded', q.loaded);
	          Object.keys(q.loaded).forEach(function (l) {
	            if (!loaded[l]) loaded[l] = [];

	            if (q.loaded[l].length) {
	              q.loaded[l].forEach(function (ns) {
	                if (loaded[l].indexOf(ns) < 0) loaded[l].push(ns);
	              });
	            }
	          });
	          /* eslint no-param-reassign: 0 */

	          q.done = true;

	          if (q.errors.length) {
	            q.callback(q.errors);
	          } else {
	            q.callback();
	          }
	        }
	      }); // emit consolidated loaded event

	      this.emit('loaded', loaded); // remove done load requests

	      this.queue = this.queue.filter(function (q) {
	        return !q.done;
	      });
	    }
	  }, {
	    key: "read",
	    value: function read(lng, ns, fcName) {
	      var _this3 = this;

	      var tried = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
	      var wait = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 250;
	      var callback = arguments.length > 5 ? arguments[5] : undefined;
	      if (!lng.length) return callback(null, {}); // noting to load

	      return this.backend[fcName](lng, ns, function (err, data) {
	        if (err && data
	        /* = retryFlag */
	        && tried < 5) {
	          setTimeout(function () {
	            _this3.read.call(_this3, lng, ns, fcName, tried + 1, wait * 2, callback);
	          }, wait);
	          return;
	        }

	        callback(err, data);
	      });
	    }
	    /* eslint consistent-return: 0 */

	  }, {
	    key: "prepareLoading",
	    value: function prepareLoading(languages, namespaces) {
	      var _this4 = this;

	      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	      var callback = arguments.length > 3 ? arguments[3] : undefined;

	      if (!this.backend) {
	        this.logger.warn('No backend was added via i18next.use. Will not load resources.');
	        return callback && callback();
	      }

	      if (typeof languages === 'string') languages = this.languageUtils.toResolveHierarchy(languages);
	      if (typeof namespaces === 'string') namespaces = [namespaces];
	      var toLoad = this.queueLoad(languages, namespaces, options, callback);

	      if (!toLoad.toLoad.length) {
	        if (!toLoad.pending.length) callback(); // nothing to load and no pendings...callback now

	        return null; // pendings will trigger callback
	      }

	      toLoad.toLoad.forEach(function (name) {
	        _this4.loadOne(name);
	      });
	    }
	  }, {
	    key: "load",
	    value: function load(languages, namespaces, callback) {
	      this.prepareLoading(languages, namespaces, {}, callback);
	    }
	  }, {
	    key: "reload",
	    value: function reload(languages, namespaces, callback) {
	      this.prepareLoading(languages, namespaces, {
	        reload: true
	      }, callback);
	    }
	  }, {
	    key: "loadOne",
	    value: function loadOne(name) {
	      var _this5 = this;

	      var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	      var _name$split3 = name.split('|'),
	          _name$split4 = _slicedToArray(_name$split3, 2),
	          lng = _name$split4[0],
	          ns = _name$split4[1];

	      this.read(lng, ns, 'read', null, null, function (err, data) {
	        if (err) _this5.logger.warn("".concat(prefix, "loading namespace ").concat(ns, " for language ").concat(lng, " failed"), err);
	        if (!err && data) _this5.logger.log("".concat(prefix, "loaded namespace ").concat(ns, " for language ").concat(lng), data);

	        _this5.loaded(name, err, data);
	      });
	    }
	  }, {
	    key: "saveMissing",
	    value: function saveMissing(languages, namespace, key, fallbackValue, isUpdate) {
	      var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

	      if (this.backend && this.backend.create) {
	        this.backend.create(languages, namespace, key, fallbackValue, null
	        /* unused callback */
	        , _objectSpread({}, options, {
	          isUpdate: isUpdate
	        }));
	      } // write to store to avoid resending


	      if (!languages || !languages[0]) return;
	      this.store.addResource(languages[0], namespace, key, fallbackValue);
	    }
	  }]);

	  return Connector;
	}(EventEmitter);

	function get() {
	  return {
	    debug: false,
	    initImmediate: true,
	    ns: ['translation'],
	    defaultNS: ['translation'],
	    fallbackLng: ['dev'],
	    fallbackNS: false,
	    // string or array of namespaces
	    whitelist: false,
	    // array with whitelisted languages
	    nonExplicitWhitelist: false,
	    load: 'all',
	    // | currentOnly | languageOnly
	    preload: false,
	    // array with preload languages
	    simplifyPluralSuffix: true,
	    keySeparator: '.',
	    nsSeparator: ':',
	    pluralSeparator: '_',
	    contextSeparator: '_',
	    partialBundledLanguages: false,
	    // allow bundling certain languages that are not remotely fetched
	    saveMissing: false,
	    // enable to send missing values
	    updateMissing: false,
	    // enable to update default values if different from translated value (only useful on initial development, or when keeping code as source of truth)
	    saveMissingTo: 'fallback',
	    // 'current' || 'all'
	    saveMissingPlurals: true,
	    // will save all forms not only singular key
	    missingKeyHandler: false,
	    // function(lng, ns, key, fallbackValue) -> override if prefer on handling
	    missingInterpolationHandler: false,
	    // function(str, match)
	    postProcess: false,
	    // string or array of postProcessor names
	    returnNull: true,
	    // allows null value as valid translation
	    returnEmptyString: true,
	    // allows empty string value as valid translation
	    returnObjects: false,
	    joinArrays: false,
	    // or string to join array
	    returnedObjectHandler: false,
	    // function(key, value, options) triggered if key returns object but returnObjects is set to false
	    parseMissingKeyHandler: false,
	    // function(key) parsed a key that was not found in t() before returning
	    appendNamespaceToMissingKey: false,
	    appendNamespaceToCIMode: false,
	    overloadTranslationOptionHandler: function handle(args) {
	      var ret = {};
	      if (_typeof(args[1]) === 'object') ret = args[1];
	      if (typeof args[1] === 'string') ret.defaultValue = args[1];
	      if (typeof args[2] === 'string') ret.tDescription = args[2];

	      if (_typeof(args[2]) === 'object' || _typeof(args[3]) === 'object') {
	        var options = args[3] || args[2];
	        Object.keys(options).forEach(function (key) {
	          ret[key] = options[key];
	        });
	      }

	      return ret;
	    },
	    interpolation: {
	      escapeValue: true,
	      format: function format(value, _format, lng) {
	        return value;
	      },
	      prefix: '{{',
	      suffix: '}}',
	      formatSeparator: ',',
	      // prefixEscaped: '{{',
	      // suffixEscaped: '}}',
	      // unescapeSuffix: '',
	      unescapePrefix: '-',
	      nestingPrefix: '$t(',
	      nestingSuffix: ')',
	      // nestingPrefixEscaped: '$t(',
	      // nestingSuffixEscaped: ')',
	      // defaultVariables: undefined // object that can have values to interpolate on - extends passed in interpolation data
	      maxReplaces: 1000 // max replaces to prevent endless loop

	    }
	  };
	}
	/* eslint no-param-reassign: 0 */

	function transformOptions(options) {
	  // create namespace object if namespace is passed in as string
	  if (typeof options.ns === 'string') options.ns = [options.ns];
	  if (typeof options.fallbackLng === 'string') options.fallbackLng = [options.fallbackLng];
	  if (typeof options.fallbackNS === 'string') options.fallbackNS = [options.fallbackNS]; // extend whitelist with cimode

	  if (options.whitelist && options.whitelist.indexOf('cimode') < 0) {
	    options.whitelist = options.whitelist.concat(['cimode']);
	  }

	  return options;
	}

	function noop() {}

	var I18n =
	/*#__PURE__*/
	function (_EventEmitter) {
	  _inherits(I18n, _EventEmitter);

	  function I18n() {
	    var _this;

	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    var callback = arguments.length > 1 ? arguments[1] : undefined;

	    _classCallCheck(this, I18n);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(I18n).call(this));
	    EventEmitter.call(_assertThisInitialized(_this)); // <=IE10 fix (unable to call parent constructor)

	    _this.options = transformOptions(options);
	    _this.services = {};
	    _this.logger = baseLogger;
	    _this.modules = {
	      external: []
	    };

	    if (callback && !_this.isInitialized && !options.isClone) {
	      // https://github.com/i18next/i18next/issues/879
	      if (!_this.options.initImmediate) {
	        _this.init(options, callback);

	        return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
	      }

	      setTimeout(function () {
	        _this.init(options, callback);
	      }, 0);
	    }

	    return _this;
	  }

	  _createClass(I18n, [{
	    key: "init",
	    value: function init() {
	      var _this2 = this;

	      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      var callback = arguments.length > 1 ? arguments[1] : undefined;

	      if (typeof options === 'function') {
	        callback = options;
	        options = {};
	      }

	      this.options = _objectSpread({}, get(), this.options, transformOptions(options));
	      this.format = this.options.interpolation.format;
	      if (!callback) callback = noop;

	      function createClassOnDemand(ClassOrObject) {
	        if (!ClassOrObject) return null;
	        if (typeof ClassOrObject === 'function') return new ClassOrObject();
	        return ClassOrObject;
	      } // init services


	      if (!this.options.isClone) {
	        if (this.modules.logger) {
	          baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
	        } else {
	          baseLogger.init(null, this.options);
	        }

	        var lu = new LanguageUtil(this.options);
	        this.store = new ResourceStore(this.options.resources, this.options);
	        var s = this.services;
	        s.logger = baseLogger;
	        s.resourceStore = this.store;
	        s.languageUtils = lu;
	        s.pluralResolver = new PluralResolver(lu, {
	          prepend: this.options.pluralSeparator,
	          compatibilityJSON: this.options.compatibilityJSON,
	          simplifyPluralSuffix: this.options.simplifyPluralSuffix
	        });
	        s.interpolator = new Interpolator(this.options);
	        s.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options); // pipe events from backendConnector

	        s.backendConnector.on('*', function (event) {
	          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	            args[_key - 1] = arguments[_key];
	          }

	          _this2.emit.apply(_this2, [event].concat(args));
	        });

	        if (this.modules.languageDetector) {
	          s.languageDetector = createClassOnDemand(this.modules.languageDetector);
	          s.languageDetector.init(s, this.options.detection, this.options);
	        }

	        if (this.modules.i18nFormat) {
	          s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
	          if (s.i18nFormat.init) s.i18nFormat.init(this);
	        }

	        this.translator = new Translator(this.services, this.options); // pipe events from translator

	        this.translator.on('*', function (event) {
	          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	            args[_key2 - 1] = arguments[_key2];
	          }

	          _this2.emit.apply(_this2, [event].concat(args));
	        });
	        this.modules.external.forEach(function (m) {
	          if (m.init) m.init(_this2);
	        });
	      } // append api


	      var storeApi = ['getResource', 'addResource', 'addResources', 'addResourceBundle', 'removeResourceBundle', 'hasResourceBundle', 'getResourceBundle', 'getDataByLanguage'];
	      storeApi.forEach(function (fcName) {
	        _this2[fcName] = function () {
	          var _this2$store;

	          return (_this2$store = _this2.store)[fcName].apply(_this2$store, arguments);
	        };
	      });
	      var deferred = defer();

	      var load = function load() {
	        _this2.changeLanguage(_this2.options.lng, function (err, t) {
	          _this2.isInitialized = true;

	          _this2.logger.log('initialized', _this2.options);

	          _this2.emit('initialized', _this2.options);

	          deferred.resolve(t); // not rejecting on err (as err is only a loading translation failed warning)

	          callback(err, t);
	        });
	      };

	      if (this.options.resources || !this.options.initImmediate) {
	        load();
	      } else {
	        setTimeout(load, 0);
	      }

	      return deferred;
	    }
	    /* eslint consistent-return: 0 */

	  }, {
	    key: "loadResources",
	    value: function loadResources() {
	      var _this3 = this;

	      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;

	      if (!this.options.resources || this.options.partialBundledLanguages) {
	        if (this.language && this.language.toLowerCase() === 'cimode') return callback(); // avoid loading resources for cimode

	        var toLoad = [];

	        var append = function append(lng) {
	          if (!lng) return;

	          var lngs = _this3.services.languageUtils.toResolveHierarchy(lng);

	          lngs.forEach(function (l) {
	            if (toLoad.indexOf(l) < 0) toLoad.push(l);
	          });
	        };

	        if (!this.language) {
	          // at least load fallbacks in this case
	          var fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
	          fallbacks.forEach(function (l) {
	            return append(l);
	          });
	        } else {
	          append(this.language);
	        }

	        if (this.options.preload) {
	          this.options.preload.forEach(function (l) {
	            return append(l);
	          });
	        }

	        this.services.backendConnector.load(toLoad, this.options.ns, callback);
	      } else {
	        callback(null);
	      }
	    }
	  }, {
	    key: "reloadResources",
	    value: function reloadResources(lngs, ns, callback) {
	      var deferred = defer();
	      if (!lngs) lngs = this.languages;
	      if (!ns) ns = this.options.ns;
	      if (!callback) callback = noop;
	      this.services.backendConnector.reload(lngs, ns, function (err) {
	        deferred.resolve(); // not rejecting on err (as err is only a loading translation failed warning)

	        callback(err);
	      });
	      return deferred;
	    }
	  }, {
	    key: "use",
	    value: function use(module) {
	      if (module.type === 'backend') {
	        this.modules.backend = module;
	      }

	      if (module.type === 'logger' || module.log && module.warn && module.error) {
	        this.modules.logger = module;
	      }

	      if (module.type === 'languageDetector') {
	        this.modules.languageDetector = module;
	      }

	      if (module.type === 'i18nFormat') {
	        this.modules.i18nFormat = module;
	      }

	      if (module.type === 'postProcessor') {
	        postProcessor.addPostProcessor(module);
	      }

	      if (module.type === '3rdParty') {
	        this.modules.external.push(module);
	      }

	      return this;
	    }
	  }, {
	    key: "changeLanguage",
	    value: function changeLanguage(lng, callback) {
	      var _this4 = this;

	      var deferred = defer();
	      this.emit('languageChanging', lng);

	      var done = function done(err, l) {
	        _this4.translator.changeLanguage(l);

	        if (l) {
	          _this4.emit('languageChanged', l);

	          _this4.logger.log('languageChanged', l);
	        }

	        deferred.resolve(function () {
	          return _this4.t.apply(_this4, arguments);
	        });
	        if (callback) callback(err, function () {
	          return _this4.t.apply(_this4, arguments);
	        });
	      };

	      var setLng = function setLng(l) {
	        if (l) {
	          _this4.language = l;
	          _this4.languages = _this4.services.languageUtils.toResolveHierarchy(l);
	          if (!_this4.translator.language) _this4.translator.changeLanguage(l);
	          if (_this4.services.languageDetector) _this4.services.languageDetector.cacheUserLanguage(l);
	        }

	        _this4.loadResources(function (err) {
	          done(err, l);
	        });
	      };

	      if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
	        setLng(this.services.languageDetector.detect());
	      } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
	        this.services.languageDetector.detect(setLng);
	      } else {
	        setLng(lng);
	      }

	      return deferred;
	    }
	  }, {
	    key: "getFixedT",
	    value: function getFixedT(lng, ns) {
	      var _this5 = this;

	      var fixedT = function fixedT(key, opts) {
	        var options = _objectSpread({}, opts);

	        if (_typeof(opts) !== 'object') {
	          for (var _len3 = arguments.length, rest = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
	            rest[_key3 - 2] = arguments[_key3];
	          }

	          options = _this5.options.overloadTranslationOptionHandler([key, opts].concat(rest));
	        }

	        options.lng = options.lng || fixedT.lng;
	        options.lngs = options.lngs || fixedT.lngs;
	        options.ns = options.ns || fixedT.ns;
	        return _this5.t(key, options);
	      };

	      if (typeof lng === 'string') {
	        fixedT.lng = lng;
	      } else {
	        fixedT.lngs = lng;
	      }

	      fixedT.ns = ns;
	      return fixedT;
	    }
	  }, {
	    key: "t",
	    value: function t() {
	      var _this$translator;

	      return this.translator && (_this$translator = this.translator).translate.apply(_this$translator, arguments);
	    }
	  }, {
	    key: "exists",
	    value: function exists() {
	      var _this$translator2;

	      return this.translator && (_this$translator2 = this.translator).exists.apply(_this$translator2, arguments);
	    }
	  }, {
	    key: "setDefaultNamespace",
	    value: function setDefaultNamespace(ns) {
	      this.options.defaultNS = ns;
	    }
	  }, {
	    key: "loadNamespaces",
	    value: function loadNamespaces(ns, callback) {
	      var _this6 = this;

	      var deferred = defer();

	      if (!this.options.ns) {
	        callback && callback();
	        return Promise.resolve();
	      }

	      if (typeof ns === 'string') ns = [ns];
	      ns.forEach(function (n) {
	        if (_this6.options.ns.indexOf(n) < 0) _this6.options.ns.push(n);
	      });
	      this.loadResources(function (err) {
	        deferred.resolve();
	        if (callback) callback(err);
	      });
	      return deferred;
	    }
	  }, {
	    key: "loadLanguages",
	    value: function loadLanguages(lngs, callback) {
	      var deferred = defer();
	      if (typeof lngs === 'string') lngs = [lngs];
	      var preloaded = this.options.preload || [];
	      var newLngs = lngs.filter(function (lng) {
	        return preloaded.indexOf(lng) < 0;
	      }); // Exit early if all given languages are already preloaded

	      if (!newLngs.length) {
	        if (callback) callback();
	        return Promise.resolve();
	      }

	      this.options.preload = preloaded.concat(newLngs);
	      this.loadResources(function (err) {
	        deferred.resolve();
	        if (callback) callback(err);
	      });
	      return deferred;
	    }
	  }, {
	    key: "dir",
	    value: function dir(lng) {
	      if (!lng) lng = this.languages && this.languages.length > 0 ? this.languages[0] : this.language;
	      if (!lng) return 'rtl';
	      var rtlLngs = ['ar', 'shu', 'sqr', 'ssh', 'xaa', 'yhd', 'yud', 'aao', 'abh', 'abv', 'acm', 'acq', 'acw', 'acx', 'acy', 'adf', 'ads', 'aeb', 'aec', 'afb', 'ajp', 'apc', 'apd', 'arb', 'arq', 'ars', 'ary', 'arz', 'auz', 'avl', 'ayh', 'ayl', 'ayn', 'ayp', 'bbz', 'pga', 'he', 'iw', 'ps', 'pbt', 'pbu', 'pst', 'prp', 'prd', 'ur', 'ydd', 'yds', 'yih', 'ji', 'yi', 'hbo', 'men', 'xmn', 'fa', 'jpr', 'peo', 'pes', 'prs', 'dv', 'sam'];
	      return rtlLngs.indexOf(this.services.languageUtils.getLanguagePartFromCode(lng)) >= 0 ? 'rtl' : 'ltr';
	    }
	    /* eslint class-methods-use-this: 0 */

	  }, {
	    key: "createInstance",
	    value: function createInstance() {
	      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      var callback = arguments.length > 1 ? arguments[1] : undefined;
	      return new I18n(options, callback);
	    }
	  }, {
	    key: "cloneInstance",
	    value: function cloneInstance() {
	      var _this7 = this;

	      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

	      var mergedOptions = _objectSpread({}, this.options, options, {
	        isClone: true
	      });

	      var clone = new I18n(mergedOptions);
	      var membersToCopy = ['store', 'services', 'language'];
	      membersToCopy.forEach(function (m) {
	        clone[m] = _this7[m];
	      });
	      clone.translator = new Translator(clone.services, clone.options);
	      clone.translator.on('*', function (event) {
	        for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
	          args[_key4 - 1] = arguments[_key4];
	        }

	        clone.emit.apply(clone, [event].concat(args));
	      });
	      clone.init(mergedOptions, callback);
	      clone.translator.options = clone.options; // sync options

	      return clone;
	    }
	  }]);

	  return I18n;
	}(EventEmitter);

	var i18next = new I18n();

	var arr = [];
	var each = arr.forEach;
	var slice = arr.slice;
	function defaults(obj) {
	  each.call(slice.call(arguments, 1), function (source) {
	    if (source) {
	      for (var prop in source) {
	        if (obj[prop] === undefined) obj[prop] = source[prop];
	      }
	    }
	  });
	  return obj;
	}

	function addQueryString(url, params) {
	  if (params && _typeof(params) === 'object') {
	    var queryString = '',
	        e = encodeURIComponent; // Must encode data

	    for (var paramName in params) {
	      queryString += '&' + e(paramName) + '=' + e(params[paramName]);
	    }

	    if (!queryString) {
	      return url;
	    }

	    url = url + (url.indexOf('?') !== -1 ? '&' : '?') + queryString.slice(1);
	  }

	  return url;
	} // https://gist.github.com/Xeoncross/7663273


	function ajax(url, options, callback, data, cache) {
	  if (data && _typeof(data) === 'object') {
	    if (!cache) {
	      data['_t'] = new Date();
	    } // URL encoded form data must be in querystring format


	    data = addQueryString('', data).slice(1);
	  }

	  if (options.queryStringParams) {
	    url = addQueryString(url, options.queryStringParams);
	  }

	  try {
	    var x;

	    if (XMLHttpRequest) {
	      x = new XMLHttpRequest();
	    } else {
	      x = new ActiveXObject('MSXML2.XMLHTTP.3.0');
	    }

	    x.open(data ? 'POST' : 'GET', url, 1);

	    if (!options.crossDomain) {
	      x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	    }

	    x.withCredentials = !!options.withCredentials;

	    if (data) {
	      x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	    }

	    if (x.overrideMimeType) {
	      x.overrideMimeType("application/json");
	    }

	    var h = options.customHeaders;
	    h = typeof h === 'function' ? h() : h;

	    if (h) {
	      for (var i in h) {
	        x.setRequestHeader(i, h[i]);
	      }
	    }

	    x.onreadystatechange = function () {
	      x.readyState > 3 && callback && callback(x.responseText, x);
	    };

	    x.send(data);
	  } catch (e) {
	    console && console.log(e);
	  }
	}

	function getDefaults() {
	  return {
	    loadPath: '/locales/{{lng}}/{{ns}}.json',
	    addPath: '/locales/add/{{lng}}/{{ns}}',
	    allowMultiLoading: false,
	    parse: JSON.parse,
	    crossDomain: false,
	    ajax: ajax
	  };
	}

	var Backend =
	/*#__PURE__*/
	function () {
	  function Backend(services) {
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	    _classCallCheck(this, Backend);

	    this.init(services, options);
	    this.type = 'backend';
	  }

	  _createClass(Backend, [{
	    key: "init",
	    value: function init(services) {
	      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      this.services = services;
	      this.options = defaults(options, this.options || {}, getDefaults());
	    }
	  }, {
	    key: "readMulti",
	    value: function readMulti(languages, namespaces, callback) {
	      var loadPath = this.options.loadPath;

	      if (typeof this.options.loadPath === 'function') {
	        loadPath = this.options.loadPath(languages, namespaces);
	      }

	      var url = this.services.interpolator.interpolate(loadPath, {
	        lng: languages.join('+'),
	        ns: namespaces.join('+')
	      });
	      this.loadUrl(url, callback);
	    }
	  }, {
	    key: "read",
	    value: function read(language, namespace, callback) {
	      var loadPath = this.options.loadPath;

	      if (typeof this.options.loadPath === 'function') {
	        loadPath = this.options.loadPath([language], [namespace]);
	      }

	      var url = this.services.interpolator.interpolate(loadPath, {
	        lng: language,
	        ns: namespace
	      });
	      this.loadUrl(url, callback);
	    }
	  }, {
	    key: "loadUrl",
	    value: function loadUrl(url, callback) {
	      var _this = this;

	      this.options.ajax(url, this.options, function (data, xhr) {
	        if (xhr.status >= 500 && xhr.status < 600) return callback('failed loading ' + url, true
	        /* retry */
	        );
	        if (xhr.status >= 400 && xhr.status < 500) return callback('failed loading ' + url, false
	        /* no retry */
	        );
	        var ret, err;

	        try {
	          ret = _this.options.parse(data, url);
	        } catch (e) {
	          err = 'failed parsing ' + url + ' to json';
	        }

	        if (err) return callback(err, false);
	        callback(null, ret);
	      });
	    }
	  }, {
	    key: "create",
	    value: function create(languages, namespace, key, fallbackValue) {
	      var _this2 = this;

	      if (typeof languages === 'string') languages = [languages];
	      var payload = {};
	      payload[key] = fallbackValue || '';
	      languages.forEach(function (lng) {
	        var url = _this2.services.interpolator.interpolate(_this2.options.addPath, {
	          lng: lng,
	          ns: namespace
	        });

	        _this2.options.ajax(url, _this2.options, function (data, xhr) {//const statusCode = xhr.status.toString();
	          // TODO: if statusCode === 4xx do log
	        }, payload);
	      });
	    }
	  }]);

	  return Backend;
	}();

	Backend.type = 'backend';

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var bind = createCommonjsModule(function (module) {
	/*!
	  Copyright (c) 2017 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
	/* global define */

	(function () {

		var hasOwn = {}.hasOwnProperty;

		function classNames () {
			var classes = [];

			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;

				var argType = typeof arg;

				if (argType === 'string' || argType === 'number') {
					classes.push(this && this[arg] || arg);
				} else if (Array.isArray(arg)) {
					classes.push(classNames.apply(this, arg));
				} else if (argType === 'object') {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(this && this[key] || key);
						}
					}
				}
			}

			return classes.join(' ');
		}

		if (module.exports) {
			classNames.default = classNames;
			module.exports = classNames;
		} else {
			window.classNames = classNames;
		}
	}());
	});

	var reactIs_production_min = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports,"__esModule",{value:!0});
	var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?Symbol.for("react.memo"):
	60115,r=b?Symbol.for("react.lazy"):60116;function t(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case h:return a;default:return u}}case r:case q:case d:return u}}}function v(a){return t(a)===m}exports.typeOf=t;exports.AsyncMode=l;exports.ConcurrentMode=m;exports.ContextConsumer=k;exports.ContextProvider=h;exports.Element=c;exports.ForwardRef=n;
	exports.Fragment=e;exports.Lazy=r;exports.Memo=q;exports.Portal=d;exports.Profiler=g;exports.StrictMode=f;exports.Suspense=p;exports.isValidElementType=function(a){return "string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||"object"===typeof a&&null!==a&&(a.$$typeof===r||a.$$typeof===q||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n)};exports.isAsyncMode=function(a){return v(a)||t(a)===l};exports.isConcurrentMode=v;exports.isContextConsumer=function(a){return t(a)===k};
	exports.isContextProvider=function(a){return t(a)===h};exports.isElement=function(a){return "object"===typeof a&&null!==a&&a.$$typeof===c};exports.isForwardRef=function(a){return t(a)===n};exports.isFragment=function(a){return t(a)===e};exports.isLazy=function(a){return t(a)===r};exports.isMemo=function(a){return t(a)===q};exports.isPortal=function(a){return t(a)===d};exports.isProfiler=function(a){return t(a)===g};exports.isStrictMode=function(a){return t(a)===f};
	exports.isSuspense=function(a){return t(a)===p};
	});

	unwrapExports(reactIs_production_min);
	var reactIs_production_min_1 = reactIs_production_min.typeOf;
	var reactIs_production_min_2 = reactIs_production_min.AsyncMode;
	var reactIs_production_min_3 = reactIs_production_min.ConcurrentMode;
	var reactIs_production_min_4 = reactIs_production_min.ContextConsumer;
	var reactIs_production_min_5 = reactIs_production_min.ContextProvider;
	var reactIs_production_min_6 = reactIs_production_min.Element;
	var reactIs_production_min_7 = reactIs_production_min.ForwardRef;
	var reactIs_production_min_8 = reactIs_production_min.Fragment;
	var reactIs_production_min_9 = reactIs_production_min.Lazy;
	var reactIs_production_min_10 = reactIs_production_min.Memo;
	var reactIs_production_min_11 = reactIs_production_min.Portal;
	var reactIs_production_min_12 = reactIs_production_min.Profiler;
	var reactIs_production_min_13 = reactIs_production_min.StrictMode;
	var reactIs_production_min_14 = reactIs_production_min.Suspense;
	var reactIs_production_min_15 = reactIs_production_min.isValidElementType;
	var reactIs_production_min_16 = reactIs_production_min.isAsyncMode;
	var reactIs_production_min_17 = reactIs_production_min.isConcurrentMode;
	var reactIs_production_min_18 = reactIs_production_min.isContextConsumer;
	var reactIs_production_min_19 = reactIs_production_min.isContextProvider;
	var reactIs_production_min_20 = reactIs_production_min.isElement;
	var reactIs_production_min_21 = reactIs_production_min.isForwardRef;
	var reactIs_production_min_22 = reactIs_production_min.isFragment;
	var reactIs_production_min_23 = reactIs_production_min.isLazy;
	var reactIs_production_min_24 = reactIs_production_min.isMemo;
	var reactIs_production_min_25 = reactIs_production_min.isPortal;
	var reactIs_production_min_26 = reactIs_production_min.isProfiler;
	var reactIs_production_min_27 = reactIs_production_min.isStrictMode;
	var reactIs_production_min_28 = reactIs_production_min.isSuspense;

	var reactIs_development = createCommonjsModule(function (module, exports) {



	{
	  (function() {

	Object.defineProperty(exports, '__esModule', { value: true });

	// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
	// nor polyfill, then a plain number is used for performance.
	var hasSymbol = typeof Symbol === 'function' && Symbol.for;

	var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
	var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
	var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
	var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
	var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
	var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
	var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace;
	var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
	var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
	var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
	var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
	var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
	var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;

	function isValidElementType(type) {
	  return typeof type === 'string' || typeof type === 'function' ||
	  // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
	  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE);
	}

	/**
	 * Forked from fbjs/warning:
	 * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
	 *
	 * Only change is we use console.warn instead of console.error,
	 * and do nothing when 'console' is not supported.
	 * This really simplifies the code.
	 * ---
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */

	var lowPriorityWarning = function () {};

	{
	  var printWarning = function (format) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }

	    var argIndex = 0;
	    var message = 'Warning: ' + format.replace(/%s/g, function () {
	      return args[argIndex++];
	    });
	    if (typeof console !== 'undefined') {
	      console.warn(message);
	    }
	    try {
	      // --- Welcome to debugging React ---
	      // This error was thrown as a convenience so that you can use this stack
	      // to find the callsite that caused this warning to fire.
	      throw new Error(message);
	    } catch (x) {}
	  };

	  lowPriorityWarning = function (condition, format) {
	    if (format === undefined) {
	      throw new Error('`lowPriorityWarning(condition, format, ...args)` requires a warning ' + 'message argument');
	    }
	    if (!condition) {
	      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	        args[_key2 - 2] = arguments[_key2];
	      }

	      printWarning.apply(undefined, [format].concat(args));
	    }
	  };
	}

	var lowPriorityWarning$1 = lowPriorityWarning;

	function typeOf(object) {
	  if (typeof object === 'object' && object !== null) {
	    var $$typeof = object.$$typeof;
	    switch ($$typeof) {
	      case REACT_ELEMENT_TYPE:
	        var type = object.type;

	        switch (type) {
	          case REACT_ASYNC_MODE_TYPE:
	          case REACT_CONCURRENT_MODE_TYPE:
	          case REACT_FRAGMENT_TYPE:
	          case REACT_PROFILER_TYPE:
	          case REACT_STRICT_MODE_TYPE:
	          case REACT_SUSPENSE_TYPE:
	            return type;
	          default:
	            var $$typeofType = type && type.$$typeof;

	            switch ($$typeofType) {
	              case REACT_CONTEXT_TYPE:
	              case REACT_FORWARD_REF_TYPE:
	              case REACT_PROVIDER_TYPE:
	                return $$typeofType;
	              default:
	                return $$typeof;
	            }
	        }
	      case REACT_LAZY_TYPE:
	      case REACT_MEMO_TYPE:
	      case REACT_PORTAL_TYPE:
	        return $$typeof;
	    }
	  }

	  return undefined;
	}

	// AsyncMode is deprecated along with isAsyncMode
	var AsyncMode = REACT_ASYNC_MODE_TYPE;
	var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
	var ContextConsumer = REACT_CONTEXT_TYPE;
	var ContextProvider = REACT_PROVIDER_TYPE;
	var Element = REACT_ELEMENT_TYPE;
	var ForwardRef = REACT_FORWARD_REF_TYPE;
	var Fragment = REACT_FRAGMENT_TYPE;
	var Lazy = REACT_LAZY_TYPE;
	var Memo = REACT_MEMO_TYPE;
	var Portal = REACT_PORTAL_TYPE;
	var Profiler = REACT_PROFILER_TYPE;
	var StrictMode = REACT_STRICT_MODE_TYPE;
	var Suspense = REACT_SUSPENSE_TYPE;

	var hasWarnedAboutDeprecatedIsAsyncMode = false;

	// AsyncMode should be deprecated
	function isAsyncMode(object) {
	  {
	    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
	      hasWarnedAboutDeprecatedIsAsyncMode = true;
	      lowPriorityWarning$1(false, 'The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
	    }
	  }
	  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
	}
	function isConcurrentMode(object) {
	  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
	}
	function isContextConsumer(object) {
	  return typeOf(object) === REACT_CONTEXT_TYPE;
	}
	function isContextProvider(object) {
	  return typeOf(object) === REACT_PROVIDER_TYPE;
	}
	function isElement(object) {
	  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
	}
	function isForwardRef(object) {
	  return typeOf(object) === REACT_FORWARD_REF_TYPE;
	}
	function isFragment(object) {
	  return typeOf(object) === REACT_FRAGMENT_TYPE;
	}
	function isLazy(object) {
	  return typeOf(object) === REACT_LAZY_TYPE;
	}
	function isMemo(object) {
	  return typeOf(object) === REACT_MEMO_TYPE;
	}
	function isPortal(object) {
	  return typeOf(object) === REACT_PORTAL_TYPE;
	}
	function isProfiler(object) {
	  return typeOf(object) === REACT_PROFILER_TYPE;
	}
	function isStrictMode(object) {
	  return typeOf(object) === REACT_STRICT_MODE_TYPE;
	}
	function isSuspense(object) {
	  return typeOf(object) === REACT_SUSPENSE_TYPE;
	}

	exports.typeOf = typeOf;
	exports.AsyncMode = AsyncMode;
	exports.ConcurrentMode = ConcurrentMode;
	exports.ContextConsumer = ContextConsumer;
	exports.ContextProvider = ContextProvider;
	exports.Element = Element;
	exports.ForwardRef = ForwardRef;
	exports.Fragment = Fragment;
	exports.Lazy = Lazy;
	exports.Memo = Memo;
	exports.Portal = Portal;
	exports.Profiler = Profiler;
	exports.StrictMode = StrictMode;
	exports.Suspense = Suspense;
	exports.isValidElementType = isValidElementType;
	exports.isAsyncMode = isAsyncMode;
	exports.isConcurrentMode = isConcurrentMode;
	exports.isContextConsumer = isContextConsumer;
	exports.isContextProvider = isContextProvider;
	exports.isElement = isElement;
	exports.isForwardRef = isForwardRef;
	exports.isFragment = isFragment;
	exports.isLazy = isLazy;
	exports.isMemo = isMemo;
	exports.isPortal = isPortal;
	exports.isProfiler = isProfiler;
	exports.isStrictMode = isStrictMode;
	exports.isSuspense = isSuspense;
	  })();
	}
	});

	unwrapExports(reactIs_development);
	var reactIs_development_1 = reactIs_development.typeOf;
	var reactIs_development_2 = reactIs_development.AsyncMode;
	var reactIs_development_3 = reactIs_development.ConcurrentMode;
	var reactIs_development_4 = reactIs_development.ContextConsumer;
	var reactIs_development_5 = reactIs_development.ContextProvider;
	var reactIs_development_6 = reactIs_development.Element;
	var reactIs_development_7 = reactIs_development.ForwardRef;
	var reactIs_development_8 = reactIs_development.Fragment;
	var reactIs_development_9 = reactIs_development.Lazy;
	var reactIs_development_10 = reactIs_development.Memo;
	var reactIs_development_11 = reactIs_development.Portal;
	var reactIs_development_12 = reactIs_development.Profiler;
	var reactIs_development_13 = reactIs_development.StrictMode;
	var reactIs_development_14 = reactIs_development.Suspense;
	var reactIs_development_15 = reactIs_development.isValidElementType;
	var reactIs_development_16 = reactIs_development.isAsyncMode;
	var reactIs_development_17 = reactIs_development.isConcurrentMode;
	var reactIs_development_18 = reactIs_development.isContextConsumer;
	var reactIs_development_19 = reactIs_development.isContextProvider;
	var reactIs_development_20 = reactIs_development.isElement;
	var reactIs_development_21 = reactIs_development.isForwardRef;
	var reactIs_development_22 = reactIs_development.isFragment;
	var reactIs_development_23 = reactIs_development.isLazy;
	var reactIs_development_24 = reactIs_development.isMemo;
	var reactIs_development_25 = reactIs_development.isPortal;
	var reactIs_development_26 = reactIs_development.isProfiler;
	var reactIs_development_27 = reactIs_development.isStrictMode;
	var reactIs_development_28 = reactIs_development.isSuspense;

	var reactIs = createCommonjsModule(function (module) {

	{
	  module.exports = reactIs_development;
	}
	});

	/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/
	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (err) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

	var ReactPropTypesSecret_1 = ReactPropTypesSecret;

	var printWarning = function() {};

	{
	  var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
	  var loggedTypeFailures = {};
	  var has = Function.call.bind(Object.prototype.hasOwnProperty);

	  printWarning = function(text) {
	    var message = 'Warning: ' + text;
	    if (typeof console !== 'undefined') {
	      console.error(message);
	    }
	    try {
	      // --- Welcome to debugging React ---
	      // This error was thrown as a convenience so that you can use this stack
	      // to find the callsite that caused this warning to fire.
	      throw new Error(message);
	    } catch (x) {}
	  };
	}

	/**
	 * Assert that the values match with the type specs.
	 * Error messages are memorized and will only be shown once.
	 *
	 * @param {object} typeSpecs Map of name to a ReactPropType
	 * @param {object} values Runtime values that need to be type-checked
	 * @param {string} location e.g. "prop", "context", "child context"
	 * @param {string} componentName Name of the component for error messages.
	 * @param {?Function} getStack Returns the component stack.
	 * @private
	 */
	function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
	  {
	    for (var typeSpecName in typeSpecs) {
	      if (has(typeSpecs, typeSpecName)) {
	        var error;
	        // Prop type validation may throw. In case they do, we don't want to
	        // fail the render phase where it didn't fail before. So we log it.
	        // After these have been cleaned up, we'll let them throw.
	        try {
	          // This is intentionally an invariant that gets caught. It's the same
	          // behavior as without this statement except with a better message.
	          if (typeof typeSpecs[typeSpecName] !== 'function') {
	            var err = Error(
	              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
	              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
	            );
	            err.name = 'Invariant Violation';
	            throw err;
	          }
	          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
	        } catch (ex) {
	          error = ex;
	        }
	        if (error && !(error instanceof Error)) {
	          printWarning(
	            (componentName || 'React class') + ': type specification of ' +
	            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
	            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
	            'You may have forgotten to pass an argument to the type checker ' +
	            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
	            'shape all require an argument).'
	          );
	        }
	        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
	          // Only monitor this failure once because there tends to be a lot of the
	          // same error.
	          loggedTypeFailures[error.message] = true;

	          var stack = getStack ? getStack() : '';

	          printWarning(
	            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
	          );
	        }
	      }
	    }
	  }
	}

	/**
	 * Resets warning cache when testing.
	 *
	 * @private
	 */
	checkPropTypes.resetWarningCache = function() {
	  {
	    loggedTypeFailures = {};
	  }
	};

	var checkPropTypes_1 = checkPropTypes;

	var has$1 = Function.call.bind(Object.prototype.hasOwnProperty);
	var printWarning$1 = function() {};

	{
	  printWarning$1 = function(text) {
	    var message = 'Warning: ' + text;
	    if (typeof console !== 'undefined') {
	      console.error(message);
	    }
	    try {
	      // --- Welcome to debugging React ---
	      // This error was thrown as a convenience so that you can use this stack
	      // to find the callsite that caused this warning to fire.
	      throw new Error(message);
	    } catch (x) {}
	  };
	}

	function emptyFunctionThatReturnsNull() {
	  return null;
	}

	var factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
	  /* global Symbol */
	  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
	  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

	  /**
	   * Returns the iterator method function contained on the iterable object.
	   *
	   * Be sure to invoke the function with the iterable as context:
	   *
	   *     var iteratorFn = getIteratorFn(myIterable);
	   *     if (iteratorFn) {
	   *       var iterator = iteratorFn.call(myIterable);
	   *       ...
	   *     }
	   *
	   * @param {?object} maybeIterable
	   * @return {?function}
	   */
	  function getIteratorFn(maybeIterable) {
	    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
	    if (typeof iteratorFn === 'function') {
	      return iteratorFn;
	    }
	  }

	  /**
	   * Collection of methods that allow declaration and validation of props that are
	   * supplied to React components. Example usage:
	   *
	   *   var Props = require('ReactPropTypes');
	   *   var MyArticle = React.createClass({
	   *     propTypes: {
	   *       // An optional string prop named "description".
	   *       description: Props.string,
	   *
	   *       // A required enum prop named "category".
	   *       category: Props.oneOf(['News','Photos']).isRequired,
	   *
	   *       // A prop named "dialog" that requires an instance of Dialog.
	   *       dialog: Props.instanceOf(Dialog).isRequired
	   *     },
	   *     render: function() { ... }
	   *   });
	   *
	   * A more formal specification of how these methods are used:
	   *
	   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
	   *   decl := ReactPropTypes.{type}(.isRequired)?
	   *
	   * Each and every declaration produces a function with the same signature. This
	   * allows the creation of custom validation functions. For example:
	   *
	   *  var MyLink = React.createClass({
	   *    propTypes: {
	   *      // An optional string or URI prop named "href".
	   *      href: function(props, propName, componentName) {
	   *        var propValue = props[propName];
	   *        if (propValue != null && typeof propValue !== 'string' &&
	   *            !(propValue instanceof URI)) {
	   *          return new Error(
	   *            'Expected a string or an URI for ' + propName + ' in ' +
	   *            componentName
	   *          );
	   *        }
	   *      }
	   *    },
	   *    render: function() {...}
	   *  });
	   *
	   * @internal
	   */

	  var ANONYMOUS = '<<anonymous>>';

	  // Important!
	  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
	  var ReactPropTypes = {
	    array: createPrimitiveTypeChecker('array'),
	    bool: createPrimitiveTypeChecker('boolean'),
	    func: createPrimitiveTypeChecker('function'),
	    number: createPrimitiveTypeChecker('number'),
	    object: createPrimitiveTypeChecker('object'),
	    string: createPrimitiveTypeChecker('string'),
	    symbol: createPrimitiveTypeChecker('symbol'),

	    any: createAnyTypeChecker(),
	    arrayOf: createArrayOfTypeChecker,
	    element: createElementTypeChecker(),
	    elementType: createElementTypeTypeChecker(),
	    instanceOf: createInstanceTypeChecker,
	    node: createNodeChecker(),
	    objectOf: createObjectOfTypeChecker,
	    oneOf: createEnumTypeChecker,
	    oneOfType: createUnionTypeChecker,
	    shape: createShapeTypeChecker,
	    exact: createStrictShapeTypeChecker,
	  };

	  /**
	   * inlined Object.is polyfill to avoid requiring consumers ship their own
	   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
	   */
	  /*eslint-disable no-self-compare*/
	  function is(x, y) {
	    // SameValue algorithm
	    if (x === y) {
	      // Steps 1-5, 7-10
	      // Steps 6.b-6.e: +0 != -0
	      return x !== 0 || 1 / x === 1 / y;
	    } else {
	      // Step 6.a: NaN == NaN
	      return x !== x && y !== y;
	    }
	  }
	  /*eslint-enable no-self-compare*/

	  /**
	   * We use an Error-like object for backward compatibility as people may call
	   * PropTypes directly and inspect their output. However, we don't use real
	   * Errors anymore. We don't inspect their stack anyway, and creating them
	   * is prohibitively expensive if they are created too often, such as what
	   * happens in oneOfType() for any type before the one that matched.
	   */
	  function PropTypeError(message) {
	    this.message = message;
	    this.stack = '';
	  }
	  // Make `instanceof Error` still work for returned errors.
	  PropTypeError.prototype = Error.prototype;

	  function createChainableTypeChecker(validate) {
	    {
	      var manualPropTypeCallCache = {};
	      var manualPropTypeWarningCount = 0;
	    }
	    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
	      componentName = componentName || ANONYMOUS;
	      propFullName = propFullName || propName;

	      if (secret !== ReactPropTypesSecret_1) {
	        if (throwOnDirectAccess) {
	          // New behavior only for users of `prop-types` package
	          var err = new Error(
	            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
	            'Use `PropTypes.checkPropTypes()` to call them. ' +
	            'Read more at http://fb.me/use-check-prop-types'
	          );
	          err.name = 'Invariant Violation';
	          throw err;
	        } else if (typeof console !== 'undefined') {
	          // Old behavior for people using React.PropTypes
	          var cacheKey = componentName + ':' + propName;
	          if (
	            !manualPropTypeCallCache[cacheKey] &&
	            // Avoid spamming the console because they are often not actionable except for lib authors
	            manualPropTypeWarningCount < 3
	          ) {
	            printWarning$1(
	              'You are manually calling a React.PropTypes validation ' +
	              'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
	              'and will throw in the standalone `prop-types` package. ' +
	              'You may be seeing this warning due to a third-party PropTypes ' +
	              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
	            );
	            manualPropTypeCallCache[cacheKey] = true;
	            manualPropTypeWarningCount++;
	          }
	        }
	      }
	      if (props[propName] == null) {
	        if (isRequired) {
	          if (props[propName] === null) {
	            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
	          }
	          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
	        }
	        return null;
	      } else {
	        return validate(props, propName, componentName, location, propFullName);
	      }
	    }

	    var chainedCheckType = checkType.bind(null, false);
	    chainedCheckType.isRequired = checkType.bind(null, true);

	    return chainedCheckType;
	  }

	  function createPrimitiveTypeChecker(expectedType) {
	    function validate(props, propName, componentName, location, propFullName, secret) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== expectedType) {
	        // `propValue` being instance of, say, date/regexp, pass the 'object'
	        // check, but we can offer a more precise error message here rather than
	        // 'of type `object`'.
	        var preciseType = getPreciseType(propValue);

	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createAnyTypeChecker() {
	    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
	  }

	  function createArrayOfTypeChecker(typeChecker) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (typeof typeChecker !== 'function') {
	        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
	      }
	      var propValue = props[propName];
	      if (!Array.isArray(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
	      }
	      for (var i = 0; i < propValue.length; i++) {
	        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret_1);
	        if (error instanceof Error) {
	          return error;
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createElementTypeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      if (!isValidElement(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createElementTypeTypeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      if (!reactIs.isValidElementType(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createInstanceTypeChecker(expectedClass) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (!(props[propName] instanceof expectedClass)) {
	        var expectedClassName = expectedClass.name || ANONYMOUS;
	        var actualClassName = getClassName(props[propName]);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createEnumTypeChecker(expectedValues) {
	    if (!Array.isArray(expectedValues)) {
	      {
	        if (arguments.length > 1) {
	          printWarning$1(
	            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
	            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
	          );
	        } else {
	          printWarning$1('Invalid argument supplied to oneOf, expected an array.');
	        }
	      }
	      return emptyFunctionThatReturnsNull;
	    }

	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      for (var i = 0; i < expectedValues.length; i++) {
	        if (is(propValue, expectedValues[i])) {
	          return null;
	        }
	      }

	      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
	        var type = getPreciseType(value);
	        if (type === 'symbol') {
	          return String(value);
	        }
	        return value;
	      });
	      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createObjectOfTypeChecker(typeChecker) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (typeof typeChecker !== 'function') {
	        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
	      }
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
	      }
	      for (var key in propValue) {
	        if (has$1(propValue, key)) {
	          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
	          if (error instanceof Error) {
	            return error;
	          }
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createUnionTypeChecker(arrayOfTypeCheckers) {
	    if (!Array.isArray(arrayOfTypeCheckers)) {
	      printWarning$1('Invalid argument supplied to oneOfType, expected an instance of array.');
	      return emptyFunctionThatReturnsNull;
	    }

	    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	      var checker = arrayOfTypeCheckers[i];
	      if (typeof checker !== 'function') {
	        printWarning$1(
	          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
	          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
	        );
	        return emptyFunctionThatReturnsNull;
	      }
	    }

	    function validate(props, propName, componentName, location, propFullName) {
	      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	        var checker = arrayOfTypeCheckers[i];
	        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1) == null) {
	          return null;
	        }
	      }

	      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createNodeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (!isNode(props[propName])) {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createShapeTypeChecker(shapeTypes) {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
	      }
	      for (var key in shapeTypes) {
	        var checker = shapeTypes[key];
	        if (!checker) {
	          continue;
	        }
	        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
	        if (error) {
	          return error;
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createStrictShapeTypeChecker(shapeTypes) {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
	      }
	      // We need to check all keys in case some are required but missing from
	      // props.
	      var allKeys = objectAssign({}, props[propName], shapeTypes);
	      for (var key in allKeys) {
	        var checker = shapeTypes[key];
	        if (!checker) {
	          return new PropTypeError(
	            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
	            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
	            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
	          );
	        }
	        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
	        if (error) {
	          return error;
	        }
	      }
	      return null;
	    }

	    return createChainableTypeChecker(validate);
	  }

	  function isNode(propValue) {
	    switch (typeof propValue) {
	      case 'number':
	      case 'string':
	      case 'undefined':
	        return true;
	      case 'boolean':
	        return !propValue;
	      case 'object':
	        if (Array.isArray(propValue)) {
	          return propValue.every(isNode);
	        }
	        if (propValue === null || isValidElement(propValue)) {
	          return true;
	        }

	        var iteratorFn = getIteratorFn(propValue);
	        if (iteratorFn) {
	          var iterator = iteratorFn.call(propValue);
	          var step;
	          if (iteratorFn !== propValue.entries) {
	            while (!(step = iterator.next()).done) {
	              if (!isNode(step.value)) {
	                return false;
	              }
	            }
	          } else {
	            // Iterator will provide entry [k,v] tuples rather than values.
	            while (!(step = iterator.next()).done) {
	              var entry = step.value;
	              if (entry) {
	                if (!isNode(entry[1])) {
	                  return false;
	                }
	              }
	            }
	          }
	        } else {
	          return false;
	        }

	        return true;
	      default:
	        return false;
	    }
	  }

	  function isSymbol(propType, propValue) {
	    // Native Symbol.
	    if (propType === 'symbol') {
	      return true;
	    }

	    // falsy value can't be a Symbol
	    if (!propValue) {
	      return false;
	    }

	    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
	    if (propValue['@@toStringTag'] === 'Symbol') {
	      return true;
	    }

	    // Fallback for non-spec compliant Symbols which are polyfilled.
	    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
	      return true;
	    }

	    return false;
	  }

	  // Equivalent of `typeof` but with special handling for array and regexp.
	  function getPropType(propValue) {
	    var propType = typeof propValue;
	    if (Array.isArray(propValue)) {
	      return 'array';
	    }
	    if (propValue instanceof RegExp) {
	      // Old webkits (at least until Android 4.0) return 'function' rather than
	      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
	      // passes PropTypes.object.
	      return 'object';
	    }
	    if (isSymbol(propType, propValue)) {
	      return 'symbol';
	    }
	    return propType;
	  }

	  // This handles more types than `getPropType`. Only used for error messages.
	  // See `createPrimitiveTypeChecker`.
	  function getPreciseType(propValue) {
	    if (typeof propValue === 'undefined' || propValue === null) {
	      return '' + propValue;
	    }
	    var propType = getPropType(propValue);
	    if (propType === 'object') {
	      if (propValue instanceof Date) {
	        return 'date';
	      } else if (propValue instanceof RegExp) {
	        return 'regexp';
	      }
	    }
	    return propType;
	  }

	  // Returns a string that is postfixed to a warning about an invalid type.
	  // For example, "undefined" or "of type array"
	  function getPostfixForTypeWarning(value) {
	    var type = getPreciseType(value);
	    switch (type) {
	      case 'array':
	      case 'object':
	        return 'an ' + type;
	      case 'boolean':
	      case 'date':
	      case 'regexp':
	        return 'a ' + type;
	      default:
	        return type;
	    }
	  }

	  // Returns class name of the object, if any.
	  function getClassName(propValue) {
	    if (!propValue.constructor || !propValue.constructor.name) {
	      return ANONYMOUS;
	    }
	    return propValue.constructor.name;
	  }

	  ReactPropTypes.checkPropTypes = checkPropTypes_1;
	  ReactPropTypes.resetWarningCache = checkPropTypes_1.resetWarningCache;
	  ReactPropTypes.PropTypes = ReactPropTypes;

	  return ReactPropTypes;
	};

	var propTypes = createCommonjsModule(function (module) {
	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	{
	  var ReactIs = reactIs;

	  // By explicitly using `prop-types` you are opting into new development behavior.
	  // http://fb.me/prop-types-in-prod
	  var throwOnDirectAccess = true;
	  module.exports = factoryWithTypeCheckers(ReactIs.isElement, throwOnDirectAccess);
	}
	});

	function _extends() {
	  _extends = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends.apply(this, arguments);
	}

	/**
	 * 画布
	 * @author tengge / https://github.com/tengge1
	 */

	class Canvas extends React.Component {
	  constructor(props) {
	    super(props);
	    this.dom = React.createRef();
	  }

	  render() {
	    const {
	      className,
	      style,
	      ...others
	    } = this.props;
	    return React.createElement("canvas", _extends({
	      className: bind('Canvas', className),
	      style: style,
	      ref: this.dom
	    }, others));
	  }

	}

	Canvas.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object
	};
	Canvas.defaultProps = {
	  className: null,
	  style: null
	};

	/**
	 * 折叠面板
	 * @author tengge / https://github.com/tengge1
	 */
	class Accordion extends React.Component {
	  render() {
	    return null;
	  }

	}

	/**
	 * 很多按钮
	 * @author tengge / https://github.com/tengge1
	 */
	class Buttons extends React.Component {
	  render() {
	    return null;
	  }

	}

	/**
	 * 列
	 * @author tengge / https://github.com/tengge1
	 */
	class Column extends React.Component {
	  render() {
	    return null;
	  }

	}

	/**
	 * 很多列
	 * @author tengge / https://github.com/tengge1
	 */
	class Columns extends React.Component {
	  render() {
	    return null;
	  }

	}

	/**
	 * 内容
	 * @author tengge / https://github.com/tengge1
	 */
	class Content extends React.Component {
	  render() {
	    return null;
	  }

	}

	/**
	 * 行
	 * @author tengge / https://github.com/tengge1
	 */
	class Row extends React.Component {
	  render() {
	    return null;
	  }

	}

	/**
	 * 很多行
	 * @author tengge / https://github.com/tengge1
	 */
	class Rows extends React.Component {
	  render() {
	    return null;
	  }

	}

	/**
	 * 按钮
	 * @author tengge / https://github.com/tengge1
	 */

	class Button extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleClick = this.handleClick.bind(this, props.onClick);
	  }

	  render() {
	    const {
	      className,
	      style,
	      children,
	      color,
	      disabled
	    } = this.props;
	    return React.createElement("button", {
	      className: bind('Button', color, disabled && 'disabled', className),
	      style: style,
	      disabled: disabled,
	      onClick: this.handleClick
	    }, children);
	  }

	  handleClick(onClick, event) {
	    onClick && onClick(this.props.name, event);
	  }

	}

	Button.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  name: propTypes.string,
	  children: propTypes.node,
	  color: propTypes.oneOf(['primary', 'success', 'warn', 'danger']),
	  disabled: propTypes.bool,
	  onClick: propTypes.func
	};
	Button.defaultProps = {
	  className: null,
	  style: null,
	  name: null,
	  children: null,
	  color: null,
	  disabled: false,
	  onClick: null
	};

	/**
	 * 复选框
	 * @author tengge / https://github.com/tengge1
	 */

	class CheckBox extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleChange = this.handleChange.bind(this, props.onChange);
	  }

	  render() {
	    const {
	      className,
	      style,
	      checked,
	      disabled,
	      onChange
	    } = this.props;
	    return React.createElement("input", {
	      type: 'checkbox',
	      className: bind('CheckBox', checked && 'checked', disabled && 'disabled', className),
	      style: style,
	      checked: checked,
	      disabled: disabled,
	      onChange: this.handleChange
	    });
	  }

	  handleChange(onChange, event) {
	    onChange && onChange(event.target.checked, this.props.name, event);
	  }

	}

	CheckBox.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  name: propTypes.string,
	  checked: propTypes.bool,
	  disabled: propTypes.bool,
	  onChange: propTypes.func
	};
	CheckBox.defaultProps = {
	  className: null,
	  style: null,
	  name: null,
	  checked: false,
	  disabled: false,
	  onChange: null
	};

	/**
	 * 表单
	 * @author tengge / https://github.com/tengge1
	 */

	class Form extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleSubmit = this.handleSubmit.bind(this, props.onSubmit);
	  }

	  render() {
	    const {
	      className,
	      style,
	      children,
	      direction
	    } = this.props;
	    return React.createElement("form", {
	      className: bind('Form', direction, className),
	      style: style,
	      onSubmit: this.handleSubmit
	    }, children);
	  }

	  handleSubmit(onSubmit) {
	    event.preventDefault();
	    onSubmit && onSubmit();
	  }

	}

	Form.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  children: propTypes.node,
	  direction: propTypes.oneOf(['horizontal', 'vertical']),
	  onSubmit: propTypes.func
	};
	Form.defaultProps = {
	  className: null,
	  style: null,
	  children: null,
	  direction: 'horizontal',
	  onSubmit: null
	};

	/**
	 * 表单项
	 * @author tengge / https://github.com/tengge1
	 */

	class FormControl extends React.Component {
	  render() {
	    const {
	      className,
	      style,
	      children
	    } = this.props;
	    return React.createElement("div", {
	      className: bind('FormControl', className),
	      style: style
	    }, children);
	  }

	}

	FormControl.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  children: propTypes.node
	};
	FormControl.defaultProps = {
	  className: null,
	  style: null,
	  children: null
	};

	/**
	 * 图标按钮
	 * @author tengge / https://github.com/tengge1
	 */

	class IconButton extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleClick = this.handleClick.bind(this, props.onClick);
	  }

	  render() {
	    const {
	      className,
	      style,
	      icon,
	      name,
	      title,
	      selected
	    } = this.props;
	    return React.createElement("button", {
	      className: bind('IconButton', selected && 'selected', className),
	      style: style,
	      title: title,
	      onClick: this.handleClick
	    }, React.createElement("i", {
	      className: bind('iconfont', icon && 'icon-' + icon)
	    }));
	  }

	  handleClick(onClick, event) {
	    onClick && onClick(this.props.name, event);
	  }

	}

	IconButton.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  icon: propTypes.string,
	  name: propTypes.string,
	  title: propTypes.string,
	  selected: propTypes.bool,
	  onClick: propTypes.func
	};
	IconButton.defaultProps = {
	  className: null,
	  style: null,
	  icon: null,
	  name: null,
	  title: null,
	  selected: false,
	  onClick: null
	};

	/**
	 * 图片按钮
	 * @author tengge / https://github.com/tengge1
	 */

	class ImageButton extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleClick = this.handleClick.bind(this, props.onClick);
	  }

	  render() {
	    const {
	      className,
	      style,
	      src,
	      name,
	      title,
	      selected
	    } = this.props;
	    return React.createElement("button", {
	      className: bind('ImageButton', selected && 'selected', className),
	      style: style,
	      title: title,
	      onClick: this.handleClick
	    }, React.createElement("img", {
	      src: src
	    }));
	  }

	  handleClick(onClick, event) {
	    onClick && onClick(this.props.name, event);
	  }

	}

	ImageButton.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  src: propTypes.string,
	  name: propTypes.string,
	  title: propTypes.string,
	  selected: propTypes.bool,
	  onClick: propTypes.func
	};
	ImageButton.defaultProps = {
	  className: null,
	  style: null,
	  src: null,
	  name: null,
	  title: null,
	  selected: false,
	  onClick: null
	};

	/**
	 * 输入框
	 * @author tengge / https://github.com/tengge1
	 */

	class Input extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleChange = this.handleChange.bind(this, props.onChange);
	    this.handleInput = this.handleInput.bind(this, props.onInput);
	  }

	  render() {
	    const {
	      className,
	      style,
	      name,
	      type,
	      value,
	      min,
	      max,
	      step,
	      show,
	      disabled
	    } = this.props;
	    let val = value === undefined || value === null ? '' : value;
	    return React.createElement("input", {
	      className: bind('Input', !show && 'hidden', className),
	      style: style,
	      type: type,
	      value: val,
	      min: min,
	      max: max,
	      step: step,
	      disabled: disabled,
	      onChange: this.handleChange,
	      onInput: this.handleInput
	    });
	  }

	  handleChange(onChange, event) {
	    const value = event.target.value;

	    if (this.props.type === 'number') {
	      if (value.trim() !== '') {
	        const precision = this.props.precision;

	        if (precision === 0) {
	          onChange && onChange(parseInt(value), this.props.name, event);
	        } else {
	          onChange && onChange(parseInt(parseFloat(value) * 10 ** precision) / 10 ** precision, this.props.name, event);
	        }
	      } else {
	        onChange && onChange(null, this.props.name, event);
	      }
	    } else {
	      onChange && onChange(value, this.props.name, event);
	    }
	  }

	  handleInput(onInput, event) {
	    const value = event.target.value;

	    if (this.props.type === 'number') {
	      if (value.trim() !== '') {
	        onInput && onInput(parseFloat(value), this.props.name, event);
	      } else {
	        onInput && onInput(null, this.props.name, event);
	      }
	    } else {
	      onInput && onInput(value, this.props.name, event);
	    }
	  }

	}

	Input.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  name: propTypes.string,
	  type: propTypes.oneOf(['text', 'number', 'color']),
	  value: propTypes.oneOfType([propTypes.string, propTypes.number]),
	  min: propTypes.number,
	  max: propTypes.number,
	  step: propTypes.number,
	  precision: propTypes.number,
	  disabled: propTypes.bool,
	  show: propTypes.bool,
	  onChange: propTypes.func,
	  onInput: propTypes.func
	};
	Input.defaultProps = {
	  className: null,
	  style: null,
	  name: null,
	  type: 'text',
	  value: '',
	  min: null,
	  max: null,
	  step: null,
	  precision: 3,
	  disabled: false,
	  show: true,
	  onChange: null,
	  onInput: null
	};

	/**
	 * 标签
	 * @author tengge / https://github.com/tengge1
	 */

	class Label extends React.Component {
	  constructor(props) {
	    super(props);
	  }

	  render() {
	    const {
	      className,
	      style,
	      children
	    } = this.props;
	    return React.createElement("label", {
	      className: bind('Label', className),
	      style: style
	    }, children);
	  }

	}

	Label.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  children: propTypes.node
	};
	Label.defaultProps = {
	  className: null,
	  style: null,
	  children: null
	};

	/**
	 * 单选框
	 * @author tengge / https://github.com/tengge1
	 */

	class Radio extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleChange = this.handleChange.bind(this, props.onChange);
	  }

	  render() {
	    const {
	      className,
	      style,
	      checked,
	      disabled
	    } = this.props;
	    return React.createElement("input", {
	      type: 'radio',
	      className: bind('Radio', checked && 'checked', disabled && 'disabled', className),
	      style: style,
	      checked: checked,
	      disabled: disabled,
	      onChange: this.handleChange
	    });
	  }

	  handleChange(onChange, event) {
	    onChange && onChange(event.target.checked, this.props.name, event);
	  }

	}

	Radio.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  name: propTypes.string,
	  checked: propTypes.bool,
	  disabled: propTypes.bool,
	  onChange: propTypes.func
	};
	Radio.defaultProps = {
	  className: null,
	  style: null,
	  name: null,
	  checked: false,
	  disabled: false,
	  onChange: null
	};

	/**
	 * 搜索框
	 * @author tengge / https://github.com/tengge1
	 */

	class SearchField extends React.Component {
	  constructor(props) {
	    super(props);
	    this.state = {
	      value: props.value,
	      categories: [],
	      filterShow: false
	    };
	    this.handleAdd = this.handleAdd.bind(this, props.onAdd);
	    this.handleChange = this.handleChange.bind(this, props.onChange);
	    this.handleInput = this.handleInput.bind(this, props.onInput);
	    this.handleReset = this.handleReset.bind(this, props.onInput, props.onChange);
	    this.handleShowFilter = this.handleShowFilter.bind(this);
	    this.handleHideFilter = this.handleHideFilter.bind(this);
	    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this, props.onInput, props.onChange);
	    this.stopPropagation = this.stopPropagation.bind(this);
	  }

	  render() {
	    const {
	      className,
	      style,
	      data,
	      placeholder,
	      addHidden
	    } = this.props;
	    const {
	      value,
	      categories,
	      filterShow
	    } = this.state;
	    return React.createElement("div", {
	      className: bind('SearchField', className),
	      onClick: this.stopPropagation
	    }, React.createElement(IconButton, {
	      className: bind(addHidden && 'hidden'),
	      icon: 'add',
	      onClick: this.handleAdd
	    }), React.createElement("input", {
	      className: 'input',
	      style: style,
	      placeholder: placeholder,
	      value: value,
	      onChange: this.handleChange,
	      onInput: this.handleInput,
	      onKeyDown: this.handleKeyDown
	    }), React.createElement(IconButton, {
	      icon: 'close',
	      onClick: this.handleReset
	    }), React.createElement(IconButton, {
	      icon: 'filter',
	      className: bind(filterShow && 'selected'),
	      onClick: this.handleShowFilter
	    }), React.createElement("div", {
	      className: bind('category', !filterShow && 'hidden')
	    }, React.createElement("div", {
	      className: 'item',
	      key: ''
	    }, React.createElement(CheckBox, {
	      name: '',
	      checked: categories.indexOf('') > -1,
	      onChange: this.handleCheckBoxChange
	    }), React.createElement("label", {
	      className: 'title'
	    }, _t('No Type'))), data.map(n => {
	      return React.createElement("div", {
	        className: 'item',
	        key: n.ID
	      }, React.createElement(CheckBox, {
	        name: n.ID,
	        checked: categories.indexOf(n.ID) > -1,
	        onChange: this.handleCheckBoxChange
	      }), React.createElement("label", {
	        className: 'title'
	      }, n.Name));
	    })));
	  }

	  componentDidMount() {
	    document.addEventListener(`click`, this.handleHideFilter);
	  }

	  handleAdd(onAdd, event) {
	    onAdd && onAdd(event);
	  }

	  handleChange(onChange, event) {
	    event.stopPropagation();
	    const value = event.target.value;
	    this.setState({
	      value
	    });
	    onChange && onChange(value, this.state.categories, event);
	  }

	  handleInput(onInput, event) {
	    event.stopPropagation();
	    const value = event.target.value;
	    this.setState({
	      value
	    });
	    onInput && onInput(value, this.state.categories, event);
	  }

	  handleReset(onInput, onChange, event) {
	    const value = '';
	    this.setState({
	      value
	    });
	    onInput && onInput(value, this.state.categories, event);
	    onChange && onChange(value, this.state.categories, event);
	  }

	  handleShowFilter(name, event) {
	    this.setState({
	      filterShow: !this.state.filterShow
	    });
	  }

	  handleHideFilter() {
	    this.setState({
	      filterShow: false
	    });
	  }

	  handleCheckBoxChange(onInput, onChange, checked, name, event) {
	    let categories = this.state.categories;
	    let index = categories.indexOf(name);

	    if (checked && index === -1) {
	      categories.push(name);
	    } else if (!checked && index > -1) {
	      categories.splice(index, 1);
	    } else {
	      console.warn(`SearchField: handleCheckBoxChange error.`);
	      return;
	    }

	    const value = this.state.value;
	    this.setState({
	      categories
	    }, () => {
	      onInput && onInput(value, categories, event);
	      onChange && onChange(value, categories, event);
	    });
	  }

	  stopPropagation(event) {
	    event.nativeEvent.stopImmediatePropagation();
	  }

	}

	SearchField.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  value: propTypes.string,
	  data: propTypes.array,
	  placeholder: propTypes.string,
	  onAdd: propTypes.func,
	  onChange: propTypes.func,
	  onInput: propTypes.func,
	  addHidden: propTypes.bool
	};
	SearchField.defaultProps = {
	  className: null,
	  style: null,
	  value: '',
	  data: [],
	  placeholder: 'Enter a keyword',
	  onAdd: null,
	  onChange: null,
	  onInput: null,
	  addHidden: false
	};

	/**
	 * 输入框
	 * @author tengge / https://github.com/tengge1
	 */

	class Select extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleChange = this.handleChange.bind(this, props.onChange);
	  }

	  render() {
	    const {
	      className,
	      style,
	      options,
	      value,
	      disabled
	    } = this.props;
	    return React.createElement("select", {
	      className: bind('Select', className),
	      style: style,
	      value: value,
	      disabled: disabled,
	      onChange: this.handleChange
	    }, options && Object.keys(options).map(n => {
	      return React.createElement("option", {
	        value: n,
	        key: n
	      }, options[n]);
	    }));
	  }

	  handleChange(onChange, event) {
	    const selectedIndex = event.target.selectedIndex;

	    if (selectedIndex === -1) {
	      onChange && onChange(null, event);
	      return;
	    }

	    const value = event.target.options[selectedIndex].value; // 注意：options的key一定是字符串，所以value也一定是字符串

	    onChange && onChange(value, this.props.name, event);
	  }

	}

	Select.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  options: propTypes.object,
	  name: propTypes.string,
	  value: propTypes.oneOfType([propTypes.string, propTypes.number]),
	  disabled: propTypes.bool,
	  onChange: propTypes.func
	};
	Select.defaultProps = {
	  className: null,
	  style: null,
	  options: null,
	  name: null,
	  value: null,
	  disabled: false,
	  onChange: null
	};

	/**
	 * 文本域
	 * @author tengge / https://github.com/tengge1
	 */

	class TextArea extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleChange = this.handleChange.bind(this, props.onChange);
	    this.handleInput = this.handleInput.bind(this, props.onInput);
	  }

	  render() {
	    const {
	      className,
	      style,
	      value
	    } = this.props;
	    return React.createElement("textarea", {
	      className: bind('TextArea', className),
	      style: style,
	      value: this.state.value,
	      onChange: this.handleChange,
	      onInput: this.handleInput
	    });
	  }

	  handleChange(onChange, event) {
	    onChange && onChange(event.target.value, this.props.name, event);
	  }

	  handleInput(onInput, event) {
	    onInput && onInput(event.target.value, this.props.name, event);
	  }

	}

	TextArea.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  name: propTypes.string,
	  value: propTypes.string,
	  onChange: propTypes.func,
	  onInput: propTypes.func
	};
	TextArea.defaultProps = {
	  className: null,
	  style: null,
	  name: null,
	  value: '',
	  onChange: null,
	  onInput: null
	};

	/**
	 * 开关
	 * @author tengge / https://github.com/tengge1
	 */

	class Toggle extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleChange = this.handleChange.bind(this, props.onChange);
	  }

	  render() {
	    const {
	      className,
	      style,
	      checked,
	      disabled,
	      onChange
	    } = this.props;
	    return React.createElement("div", {
	      className: bind('Toggle', checked && 'checked', disabled && 'disabled', className),
	      style: style,
	      onClick: disabled ? null : this.handleChange
	    });
	  }

	  handleChange(onChange, event) {
	    var checked = event.target.classList.contains('checked');
	    onChange && onChange(!checked, this.props.name, event);
	  }

	}

	Toggle.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  name: propTypes.string,
	  checked: propTypes.bool,
	  disabled: propTypes.bool,
	  onChange: propTypes.func
	};
	Toggle.defaultProps = {
	  className: null,
	  style: null,
	  name: null,
	  checked: false,
	  disabled: false,
	  onChange: null
	};

	/**
	 * 图标
	 * @author tengge / https://github.com/tengge1
	 */

	class Icon extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleClick = this.handleClick.bind(this, props.onClick);
	  }

	  render() {
	    const {
	      className,
	      style,
	      name,
	      value,
	      icon,
	      title
	    } = this.props;
	    return React.createElement("i", {
	      className: bind('Icon', 'iconfont', icon && 'icon-' + icon, className),
	      style: style,
	      name: name,
	      value: value,
	      title: title,
	      onClick: this.handleClick
	    });
	  }

	  handleClick(onClick, event) {
	    const name = event.target.getAttribute('name');
	    onClick && onClick(name, event);
	  }

	}

	Icon.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  name: propTypes.string,
	  value: propTypes.string,
	  icon: propTypes.string,
	  title: propTypes.string,
	  onClick: propTypes.func
	};
	Icon.defaultProps = {
	  className: null,
	  style: null,
	  name: null,
	  value: null,
	  icon: null,
	  title: null,
	  onClick: null
	};

	/**
	 * 图片
	 * @author tengge / https://github.com/tengge1
	 */

	class Image extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleError = this.handleError.bind(this);
	  }

	  render() {
	    const {
	      className,
	      style,
	      src,
	      title
	    } = this.props;
	    return React.createElement("img", {
	      className: bind('Image', className),
	      style: style,
	      src: src,
	      title: title,
	      onError: this.handleError
	    });
	  }

	  handleError(event) {
	    let target = event.target;
	    let parent = target.parentNode;
	    parent.removeChild(target);
	    let img = document.createElement('div');
	    img.className = 'no-img';
	    let icon = document.createElement('i');
	    icon.className = 'Icon iconfont icon-scenes';
	    img.appendChild(icon);
	    let title = parent.children[0];
	    parent.insertBefore(img, title);
	  }

	}

	Image.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  src: propTypes.string,
	  title: propTypes.string
	};
	Image.defaultProps = {
	  className: null,
	  style: null,
	  src: null,
	  title: null
	};

	/**
	 * 图片列表
	 * @author tengge / https://github.com/tengge1
	 */

	class ImageList extends React.Component {
	  constructor(props) {
	    super(props);
	    const {
	      onClick,
	      onEdit,
	      onDelete
	    } = props;
	    this.state = {
	      pageSize: 10,
	      pageNum: 0
	    };
	    this.handleFirstPage = this.handleFirstPage.bind(this);
	    this.handleLastPage = this.handleLastPage.bind(this);
	    this.handlePreviousPage = this.handlePreviousPage.bind(this);
	    this.handleNextPage = this.handleNextPage.bind(this);
	    this.handleClick = this.handleClick.bind(this, onClick);
	    this.handleEdit = this.handleEdit.bind(this, onEdit);
	    this.handleDelete = this.handleDelete.bind(this, onDelete);
	    this.handleError = this.handleError.bind(this);
	  }

	  render() {
	    const {
	      className,
	      style,
	      data,
	      firstPageText,
	      lastPageText,
	      currentPageText,
	      previousPageText,
	      nextPageText
	    } = this.props;
	    const {
	      pageSize,
	      pageNum
	    } = this.state;
	    const totalPage = this.getTotalPage();
	    const current = data.filter((n, i) => {
	      return i >= pageSize * pageNum && i < pageSize * (pageNum + 1);
	    });
	    return React.createElement("div", {
	      className: bind('ImageList', className),
	      style: style
	    }, React.createElement("div", {
	      className: 'content'
	    }, current.map(n => {
	      return React.createElement("div", {
	        className: 'item',
	        name: n.id,
	        key: n.id,
	        onClick: this.handleClick
	      }, n.src ? React.createElement("img", {
	        className: 'img',
	        src: n.src,
	        onError: this.handleError
	      }) : React.createElement("div", {
	        className: 'no-img'
	      }, React.createElement(Icon, {
	        icon: n.icon
	      })), React.createElement("div", {
	        className: 'title'
	      }, n.title), n.cornerText && React.createElement("div", {
	        className: 'cornerText'
	      }, n.cornerText), React.createElement(IconButton, {
	        className: 'edit',
	        icon: 'edit',
	        name: n.id,
	        onClick: this.handleEdit
	      }), React.createElement(IconButton, {
	        className: 'delete',
	        icon: 'delete',
	        name: n.id,
	        onClick: this.handleDelete
	      }));
	    })), React.createElement("div", {
	      className: 'page'
	    }, React.createElement(IconButton, {
	      icon: 'backward',
	      title: firstPageText,
	      onClick: this.handleFirstPage
	    }), React.createElement(IconButton, {
	      icon: 'left-triangle2',
	      title: previousPageText,
	      onClick: this.handlePreviousPage
	    }), React.createElement(Input, {
	      className: 'current',
	      value: (pageNum + 1).toString(),
	      title: currentPageText,
	      disabled: true
	    }), React.createElement(IconButton, {
	      icon: 'right-triangle2',
	      title: nextPageText,
	      onClick: this.handleNextPage
	    }), React.createElement(IconButton, {
	      icon: 'forward',
	      title: lastPageText,
	      onClick: this.handleLastPage
	    }), React.createElement("div", {
	      className: 'info'
	    }, _t('Total {{totalPage}} Pages', {
	      totalPage: totalPage
	    }))));
	  }

	  handleFirstPage() {
	    this.setState({
	      pageNum: 0
	    });
	  }

	  handleLastPage() {
	    const totalPage = this.getTotalPage();
	    this.setState({
	      pageNum: totalPage < 1 ? 0 : totalPage - 1
	    });
	  }

	  handleNextPage() {
	    this.setState(state => {
	      const totalPage = this.getTotalPage();
	      return {
	        pageNum: state.pageNum < totalPage - 1 ? state.pageNum + 1 : totalPage - 1
	      };
	    });
	  }

	  handlePreviousPage() {
	    this.setState(state => {
	      return {
	        pageNum: state.pageNum > 0 ? state.pageNum - 1 : 0
	      };
	    });
	  }

	  handleClick(onClick, event) {
	    event.stopPropagation();
	    const id = event.target.getAttribute('name');
	    const data = this.props.data.filter(n => n.id === id)[0];
	    onClick && onClick(data, event);
	  }

	  handleEdit(onEdit, name, event) {
	    event.stopPropagation();
	    const data = this.props.data.filter(n => n.id === name)[0];
	    onEdit && onEdit(data, event);
	  }

	  handleDelete(onDelete, name, event) {
	    event.stopPropagation();
	    const data = this.props.data.filter(n => n.id === name)[0];
	    onDelete && onDelete(data, event);
	  }

	  handleError(event) {
	    let target = event.target;
	    let parent = target.parentNode;
	    parent.removeChild(target);
	    let img = document.createElement('div');
	    img.className = 'no-img';
	    let icon = document.createElement('i');
	    icon.className = 'Icon iconfont icon-scenes';
	    img.appendChild(icon);
	    let title = parent.children[0];
	    parent.insertBefore(img, title);
	  }

	  getTotalPage() {
	    const total = this.props.data.length;
	    const pageSize = this.state.pageSize;
	    return total % pageSize === 0 ? total / pageSize : parseInt(total / pageSize) + 1;
	  }

	}

	ImageList.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  data: propTypes.array,
	  onClick: propTypes.func,
	  onEdit: propTypes.func,
	  onDelete: propTypes.func,
	  firstPageText: propTypes.string,
	  lastPageText: propTypes.string,
	  currentPageText: propTypes.string,
	  previousPageText: propTypes.string,
	  nextPageText: propTypes.string
	};
	ImageList.defaultProps = {
	  className: null,
	  style: null,
	  data: [],
	  onClick: null,
	  onEdit: null,
	  onDelete: null,
	  firstPageText: 'First Page',
	  lastPageText: 'Last Page',
	  currentPageText: 'Current Page',
	  previousPageText: 'Previous Page',
	  nextPageText: 'Next Page'
	};

	/**
	 * 图片上传控件
	 * @author tengge / https://github.com/tengge1
	 */

	class ImageUploader extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleSelect = this.handleSelect.bind(this);
	    this.handleChange = this.handleChange.bind(this, props.onChange);
	  }

	  render() {
	    const {
	      className,
	      style,
	      url,
	      server,
	      noImageText
	    } = this.props;

	    if (url && url != 'null') {
	      return React.createElement("img", {
	        className: bind('ImageUploader', className),
	        src: server + url,
	        onClick: this.handleSelect
	      });
	    } else {
	      return React.createElement("div", {
	        className: bind('ImageUploader', 'empty', className),
	        onClick: this.handleSelect
	      }, noImageText);
	    }
	  }

	  componentDidMount() {
	    var input = document.createElement('input');
	    input.type = 'file';
	    input.style.display = 'none';
	    input.addEventListener('change', this.handleChange);
	    document.body.appendChild(input);
	    this.input = input;
	  }

	  componentWillUnmount() {
	    var input = this.input;
	    input.removeEventListener('change', this.handleChange);
	    document.body.removeChild(input);
	    this.input = null;
	  }

	  handleSelect() {
	    this.input.click();
	  }

	  handleChange(onChange, event) {
	    onChange && onChange(event.target.files[0], event);
	  }

	}

	ImageUploader.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  url: propTypes.string,
	  server: propTypes.string,
	  noImageText: propTypes.string,
	  onChange: propTypes.func
	};
	ImageUploader.defaultProps = {
	  className: null,
	  style: null,
	  url: null,
	  server: '',
	  noImageText: 'No Image',
	  onChange: null
	};

	/**
	 * 绝对定位布局
	 * @author tengge / https://github.com/tengge1
	 */

	class AbsoluteLayout extends React.Component {
	  render() {
	    const {
	      className,
	      style,
	      children,
	      left,
	      top,
	      ...others
	    } = this.props;
	    const position = {
	      left: left || 0,
	      top: top || 0
	    };
	    return React.createElement("div", _extends({
	      className: bind('AbsoluteLayout', className),
	      style: style ? Object.assign({}, style, position) : position
	    }, others), children);
	  }

	}

	AbsoluteLayout.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  children: propTypes.node,
	  left: propTypes.string,
	  top: propTypes.string
	};
	AbsoluteLayout.defaultProps = {
	  className: null,
	  style: null,
	  children: null,
	  left: '0',
	  top: '0'
	};

	/**
	 * 单个折叠面板
	 * @private
	 * @author tengge / https://github.com/tengge1
	 */

	class AccordionPanel extends React.Component {
	  constructor(props) {
	    super(props);
	    this.state = {
	      maximized: props.maximized
	    };
	    this.handleClick = this.handleClick.bind(this, props.onClick, props.index, props.name);
	    this.handleMaximize = this.handleMaximize.bind(this, props.onMaximize);
	  }

	  handleClick(onClick, index, name, event) {
	    onClick && onClick(index, name, event);
	  }

	  handleMaximize(onMaximize, event) {
	    this.setState(state => ({
	      maximized: !state.maximized
	    }));
	    onMaximize && onMaximize(event);
	  }

	  render() {
	    const {
	      title,
	      className,
	      style,
	      children,
	      show,
	      total,
	      index,
	      collpased,
	      maximizable,
	      maximized,
	      onMaximize
	    } = this.props;
	    const maximizeControl = maximizable && React.createElement("div", {
	      className: 'control',
	      onClick: this.handleMaximize
	    }, this.state.maximized ? React.createElement("i", {
	      className: 'iconfont icon-minimize'
	    }) : React.createElement("i", {
	      className: 'iconfont icon-maximize'
	    }));

	    const _style = collpased ? style : Object.assign({}, style, {
	      height: `calc(100% - ${26 * (total - 1)}px`
	    });

	    return React.createElement("div", {
	      className: bind('AccordionPanel', this.state.maximized && 'maximized', collpased && 'collpased', !show && 'hidden', className),
	      style: _style
	    }, React.createElement("div", {
	      className: 'header',
	      onClick: this.handleClick
	    }, React.createElement("span", {
	      className: "title"
	    }, title), React.createElement("div", {
	      className: "controls"
	    }, maximizeControl)), React.createElement("div", {
	      className: 'body'
	    }, children));
	  }

	}

	AccordionPanel.propTypes = {
	  name: propTypes.string,
	  title: propTypes.string,
	  className: propTypes.string,
	  style: propTypes.object,
	  children: propTypes.node,
	  show: propTypes.bool,
	  total: propTypes.number,
	  index: propTypes.number,
	  collpased: propTypes.bool,
	  maximizable: propTypes.bool,
	  maximized: propTypes.bool,
	  onMaximize: propTypes.bool,
	  onClick: propTypes.func
	};
	AccordionPanel.defaultProps = {
	  name: null,
	  title: null,
	  className: null,
	  style: null,
	  children: null,
	  show: true,
	  total: 1,
	  index: 0,
	  collpased: true,
	  maximizable: false,
	  maximized: false,
	  onMaximize: null,
	  onClick: null
	};

	/**
	 * 折叠布局
	 * @author tengge / https://github.com/tengge1
	 */

	class AccordionLayout extends React.Component {
	  constructor(props) {
	    super(props);
	    this.state = {
	      activeIndex: props.activeIndex
	    };
	    this.handleClick = this.handleClick.bind(this, props.onActive);
	  }

	  handleClick(onActive, index, name, event) {
	    onActive && onActive(index, name, event);
	    this.setState({
	      activeIndex: index
	    });
	  }

	  render() {
	    const {
	      className,
	      style,
	      children
	    } = this.props;
	    const content = Array.isArray(children) ? children : [children];
	    return React.createElement("div", {
	      className: bind('AccordionLayout', className),
	      style: style
	    }, content.map((n, i) => {
	      return React.createElement(AccordionPanel, {
	        name: n.props.name,
	        title: n.props.title,
	        show: n.props.show,
	        total: content.length,
	        index: i,
	        collpased: i !== this.state.activeIndex,
	        maximizable: n.props.maximizable,
	        onClick: this.handleClick,
	        key: i
	      }, n.props.children);
	    }));
	  }

	}

	AccordionLayout.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  children: propTypes.node,
	  activeIndex: propTypes.number,
	  onActive: propTypes.func
	};
	AccordionLayout.defaultProps = {
	  className: null,
	  style: null,
	  children: null,
	  activeIndex: 0,
	  onActive: null
	};

	/**
	 * 边框布局
	 * @author tengge / https://github.com/tengge1
	 */

	class BorderLayout extends React.Component {
	  constructor(props) {
	    super(props);
	    const children = this.props.children;
	    const north = children && children.filter(n => n.props.region === 'north')[0];
	    const south = children && children.filter(n => n.props.region === 'south')[0];
	    const west = children && children.filter(n => n.props.region === 'west')[0];
	    const east = children && children.filter(n => n.props.region === 'east')[0];
	    const center = children && children.filter(n => n.props.region === 'center')[0];
	    const northSplit = north && north.props.split || false;
	    const southSplit = south && south.props.split || false;
	    const westSplit = west && west.props.split || false;
	    const eastSplit = east && east.props.split || false;
	    const northCollapsed = north && north.props.collapsed || false;
	    const southCollapsed = south && south.props.collapsed || false;
	    const westCollapsed = west && west.props.collapsed || false;
	    const eastCollapsed = east && east.props.collapsed || false;
	    const onNorthToggle = north && north.props.onToggle || null;
	    const onSouthToggle = south && south.props.onToggle || null;
	    const onWestToggle = west && west.props.onToggle || null;
	    const onEastToggle = east && east.props.onToggle || null;
	    this.northRef = React.createRef();
	    this.southRef = React.createRef();
	    this.westRef = React.createRef();
	    this.eastRef = React.createRef();
	    this.state = {
	      northSplit,
	      southSplit,
	      westSplit,
	      eastSplit,
	      northCollapsed,
	      southCollapsed,
	      westCollapsed,
	      eastCollapsed
	    };
	    this.handleNorthClick = this.handleNorthClick.bind(this, onNorthToggle);
	    this.handleSouthClick = this.handleSouthClick.bind(this, onSouthToggle);
	    this.handleWestClick = this.handleWestClick.bind(this, onWestToggle);
	    this.handleEastClick = this.handleEastClick.bind(this, onEastToggle);
	    this.handleTransitionEnd = this.handleTransitionEnd.bind(this, onNorthToggle, onSouthToggle, onWestToggle, onEastToggle);
	  }

	  handleNorthClick() {
	    if (!this.state.northSplit) {
	      return;
	    }

	    this.setState((state, props) => {
	      const collapsed = !state.northCollapsed;
	      const dom = this.northRef.current;
	      const height = dom.clientHeight;

	      if (collapsed) {
	        dom.style.marginTop = `-${height - 8}px`;
	      } else {
	        dom.style.marginTop = null;
	      }

	      return {
	        northCollapsed: collapsed
	      };
	    });
	  }

	  handleSouthClick() {
	    if (!this.state.southSplit) {
	      return;
	    }

	    this.setState((state, props) => {
	      const collapsed = !state.southCollapsed;
	      const dom = this.southRef.current;
	      const height = dom.clientHeight;

	      if (collapsed) {
	        dom.style.marginBottom = `-${height - 8}px`;
	      } else {
	        dom.style.marginBottom = null;
	      }

	      return {
	        southCollapsed: collapsed
	      };
	    });
	  }

	  handleWestClick() {
	    if (!this.state.westSplit) {
	      return;
	    }

	    const dom = this.westRef.current;
	    this.setState((state, props) => {
	      const collapsed = !state.westCollapsed;
	      const width = dom.clientWidth;

	      if (collapsed) {
	        dom.style.marginLeft = `-${width - 8}px`;
	      } else {
	        dom.style.marginLeft = null;
	      }

	      return {
	        westCollapsed: collapsed
	      };
	    });
	  }

	  handleEastClick() {
	    if (!this.state.eastSplit) {
	      return;
	    }

	    this.setState((state, props) => {
	      const collapsed = !state.eastCollapsed;
	      const dom = this.eastRef.current;
	      const width = dom.clientWidth;

	      if (collapsed) {
	        dom.style.marginRight = `-${width - 8}px`;
	      } else {
	        dom.style.marginRight = null;
	      }

	      return {
	        eastCollapsed: collapsed
	      };
	    });
	  }

	  handleTransitionEnd(onNorthToggle, onSouthToggle, onWestToggle, onEastToggle, event) {
	    const region = event.target.getAttribute('region');

	    switch (region) {
	      case 'north':
	        onNorthToggle && onNorthToggle(!this.state.northCollapsed);
	        break;

	      case 'south':
	        onSouthToggle && onSouthToggle(!this.state.southCollapsed);
	        break;

	      case 'west':
	        onWestToggle && onWestToggle(!this.state.westCollapsed);
	        break;

	      case 'east':
	        onEastToggle && onEastToggle(!this.state.eastCollapsed);
	        break;
	    }
	  }

	  render() {
	    const {
	      className,
	      style,
	      children
	    } = this.props;
	    let north = [],
	        south = [],
	        west = [],
	        east = [],
	        center = [],
	        others = [];
	    children && children.forEach(n => {
	      switch (n.props.region) {
	        case 'north':
	          north.push(n);
	          break;

	        case 'south':
	          south.push(n);
	          break;

	        case 'west':
	          west.push(n);
	          break;

	        case 'east':
	          east.push(n);
	          break;

	        case 'center':
	          center.push(n);
	          break;

	        default:
	          others.push(n);
	          break;
	      }
	    });

	    if (center.length === 0) {
	      console.warn(`BorderLayout: center region is not defined.`);
	    } // north region


	    const northRegion = north.length > 0 && React.createElement("div", {
	      className: bind('north', this.state.northSplit && 'split', this.state.northCollapsed && 'collapsed'),
	      region: 'north',
	      onTransitionEnd: this.handleTransitionEnd,
	      ref: this.northRef
	    }, React.createElement("div", {
	      className: 'content'
	    }, north), this.state.northSplit && React.createElement("div", {
	      className: 'control'
	    }, React.createElement("div", {
	      className: 'button',
	      onClick: this.handleNorthClick
	    }))); // south region

	    const southRegion = south.length > 0 && React.createElement("div", {
	      className: bind('south', this.state.northSplit && 'split', this.state.southCollapsed && 'collapsed'),
	      region: 'south',
	      onTransitionEnd: this.handleTransitionEnd,
	      ref: this.southRef
	    }, this.state.southSplit && React.createElement("div", {
	      className: 'control'
	    }, React.createElement("div", {
	      className: 'button',
	      onClick: this.handleSouthClick
	    })), React.createElement("div", {
	      className: 'content'
	    }, south)); // west region

	    const westRegion = west.length > 0 && React.createElement("div", {
	      className: bind('west', this.state.westSplit && 'split', this.state.westCollapsed && 'collapsed'),
	      region: 'west',
	      onTransitionEnd: this.handleTransitionEnd,
	      ref: this.westRef
	    }, React.createElement("div", {
	      className: 'content'
	    }, west), this.state.westSplit && React.createElement("div", {
	      className: 'control'
	    }, React.createElement("div", {
	      className: 'button',
	      onClick: this.handleWestClick
	    }))); // east region

	    const eastRegion = east.length > 0 && React.createElement("div", {
	      className: bind('east', this.state.eastSplit && 'split', this.state.eastCollapsed && 'collapsed'),
	      region: 'east',
	      onTransitionEnd: this.handleTransitionEnd,
	      ref: this.eastRef
	    }, React.createElement("div", {
	      className: 'control'
	    }, React.createElement("div", {
	      className: 'button',
	      onClick: this.handleEastClick
	    })), React.createElement("div", {
	      className: 'content'
	    }, east)); // center region

	    const centerRegion = center.length > 0 && React.createElement("div", {
	      className: 'center'
	    }, center);
	    const otherRegion = others.length > 0 && others;
	    return React.createElement("div", {
	      className: bind('BorderLayout', className),
	      style: style
	    }, northRegion, React.createElement("div", {
	      className: 'middle'
	    }, westRegion, centerRegion, eastRegion), southRegion, otherRegion);
	  }

	}

	BorderLayout.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  children: propTypes.node
	};
	BorderLayout.defaultProps = {
	  className: null,
	  style: null,
	  children: null
	};

	/**
	 * 水平布局
	 * @author tengge / https://github.com/tengge1
	 */

	class HBoxLayout extends React.Component {
	  render() {
	    const {
	      className,
	      style,
	      children,
	      ...others
	    } = this.props;
	    return React.createElement("div", _extends({
	      className: bind('HBoxLayout', className),
	      style: style
	    }, others), children);
	  }

	}

	HBoxLayout.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  children: propTypes.node
	};
	HBoxLayout.defaultProps = {
	  className: null,
	  style: null,
	  children: null
	};

	/**
	 * 选项卡布局
	 * @author tengge / https://github.com/tengge1
	 */

	class TabLayout extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleClick = this.handleClick.bind(this, props.onActiveTabChange);
	  }

	  render() {
	    const {
	      className,
	      style,
	      children,
	      activeTabIndex
	    } = this.props;
	    return React.createElement("div", {
	      className: bind('TabLayout', className),
	      style: style
	    }, React.createElement("div", {
	      className: 'tabs'
	    }, React.Children.map(children, (n, i) => {
	      return React.createElement("div", {
	        className: bind('tab', i === activeTabIndex ? 'selected' : null),
	        key: i,
	        tbindex: i,
	        onClick: this.handleClick
	      }, n.props.title);
	    })), React.createElement("div", {
	      className: 'contents'
	    }, React.Children.map(children, (n, i) => {
	      return React.createElement("div", {
	        className: bind('content', i === activeTabIndex ? 'show' : null),
	        key: i
	      }, n);
	    })));
	  }

	  handleClick(onActiveTabChange, event) {
	    const index = event.target.getAttribute('tbindex');
	    onActiveTabChange && onActiveTabChange(parseInt(index), event.target, event);
	  }

	}

	TabLayout.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  children: propTypes.node,
	  activeTabIndex: propTypes.number,
	  onActiveTabChange: propTypes.func
	};
	TabLayout.defaultProps = {
	  className: null,
	  style: null,
	  children: null,
	  activeTabIndex: 0,
	  onActiveTabChange: null
	};

	/**
	 * 竖直布局
	 * @author tengge / https://github.com/tengge1
	 */

	class VBoxLayout extends React.Component {
	  render() {
	    const {
	      className,
	      style,
	      children,
	      ...others
	    } = this.props;
	    return React.createElement("div", _extends({
	      className: bind('VBoxLayout', className),
	      style: style
	    }, others), children);
	  }

	}

	VBoxLayout.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  children: propTypes.node
	};
	VBoxLayout.defaultProps = {
	  className: null,
	  style: null,
	  children: null
	};

	/**
	 * 菜单栏
	 * @author tengge / https://github.com/tengge1
	 */

	class MenuBar extends React.Component {
	  render() {
	    const {
	      className,
	      style,
	      children,
	      ...others
	    } = this.props;
	    return React.createElement("ul", _extends({
	      className: bind('MenuBar', className),
	      style: style
	    }, others), children);
	  }

	}

	MenuBar.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  children: propTypes.node
	};
	MenuBar.defaultProps = {
	  className: null,
	  style: null,
	  children: null
	};

	/**
	 * 菜单栏填充
	 * @author tengge / https://github.com/tengge1
	 */

	class MenuBarFiller extends React.Component {
	  render() {
	    const {
	      className,
	      style
	    } = this.props;
	    return React.createElement("li", {
	      className: bind('MenuItem', 'MenuBarFiller', className),
	      style: style
	    });
	  }

	}

	MenuBarFiller.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object
	};
	MenuBarFiller.defaultProps = {
	  className: null,
	  style: null
	};

	/**
	 * 菜单项
	 * @author tengge / https://github.com/tengge1
	 */

	class MenuItem extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleClick = this.handleClick.bind(this, props.onClick);
	  }

	  render() {
	    const {
	      title,
	      className,
	      style,
	      children,
	      show,
	      disabled,
	      onClick
	    } = this.props;
	    const subMenu = React.Children.count(children) && React.createElement(React.Fragment, null, React.createElement("div", {
	      className: 'suffix'
	    }, React.createElement("i", {
	      className: 'iconfont icon-right-triangle'
	    })), React.createElement("div", {
	      className: 'sub'
	    }, React.createElement("ul", {
	      className: 'wrap'
	    }, children)));
	    return React.createElement("li", {
	      className: bind('MenuItem', disabled && 'disabled', !show && 'hidden', className),
	      style: style,
	      onClick: this.handleClick
	    }, React.createElement("span", null, title), subMenu);
	  }

	  handleClick(onClick, event) {
	    event.stopPropagation();

	    if (!event.target.classList.contains('disabled')) {
	      onClick && onClick(event);
	    }
	  }

	}

	MenuItem.propTypes = {
	  title: propTypes.string,
	  className: propTypes.string,
	  style: propTypes.object,
	  children: propTypes.node,
	  show: propTypes.bool,
	  disabled: propTypes.bool,
	  onClick: propTypes.func
	};
	MenuItem.defaultProps = {
	  title: null,
	  className: null,
	  style: null,
	  children: null,
	  show: true,
	  disabled: false,
	  onClick: null
	};

	/**
	 * 菜单项分隔符
	 * @author tengge / https://github.com/tengge1
	 */

	class MenuItemSeparator extends React.Component {
	  render() {
	    const {
	      className,
	      style,
	      direction,
	      show
	    } = this.props;
	    return React.createElement("li", {
	      className: bind('MenuItemSeparator', direction && direction, !show && 'hidden', className),
	      style: style
	    }, React.createElement("div", {
	      className: "separator"
	    }));
	  }

	}

	MenuItemSeparator.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  direction: propTypes.oneOf(['horizontal', 'vertical']),
	  show: propTypes.bool
	};
	MenuItemSeparator.defaultProps = {
	  className: null,
	  style: null,
	  direction: 'vertical',
	  show: true
	};

	/**
	 * 菜单选项卡
	 * @author tengge / https://github.com/tengge1
	 */

	class MenuTab extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleClick = this.handleClick.bind(this, props.onClick);
	  }

	  render() {
	    const {
	      className,
	      style,
	      children,
	      selected,
	      show,
	      disabled,
	      onClick
	    } = this.props;
	    return React.createElement("li", {
	      className: bind('MenuTab', selected && 'selected', disabled && 'disabled', !show && 'hidden', className),
	      style: style,
	      onClick: this.handleClick
	    }, children);
	  }

	  handleClick(onClick, event) {
	    event.stopPropagation();

	    if (!event.target.classList.contains('disabled')) {
	      onClick && onClick(this.props.name, event);
	    }
	  }

	}

	MenuTab.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  children: propTypes.node,
	  name: propTypes.string,
	  selected: propTypes.bool,
	  show: propTypes.bool,
	  disabled: propTypes.bool,
	  onClick: propTypes.func
	};
	MenuTab.defaultProps = {
	  className: null,
	  style: null,
	  children: null,
	  name: null,
	  selected: false,
	  show: true,
	  disabled: false,
	  onClick: null
	};

	/**
	 * 面板
	 * @author tengge / https://github.com/tengge1
	 */

	class Panel extends React.Component {
	  constructor(props) {
	    super(props);
	    this.state = {
	      collapsed: props.collapsed,
	      maximized: props.maximized,
	      closed: props.closed
	    };
	    this.handleCollapse = this.handleCollapse.bind(this, props.onCollapse);
	    this.handleMaximize = this.handleMaximize.bind(this, props.onMaximize);
	    this.handleClose = this.handleClose.bind(this, props.onClose);
	  }

	  handleCollapse(onCollapse, event) {
	    this.setState(state => ({
	      collapsed: !state.collapsed
	    }));
	    onCollapse && onCollapse(event);
	  }

	  handleMaximize(onMaximize, event) {
	    this.setState(state => ({
	      maximized: !state.maximized
	    }));
	    onMaximize && onMaximize(event);
	  }

	  handleClose(onClose, event) {
	    this.setState(state => ({
	      closed: !state.closed
	    }));
	    onClose && onClose(event);
	  }

	  render() {
	    const {
	      title,
	      className,
	      style,
	      children,
	      show,
	      header,
	      collapsible,
	      collapsed,
	      onCollapse,
	      maximizable,
	      maximized,
	      onMaximize,
	      closable,
	      closed,
	      onClose
	    } = this.props;
	    const collapseControl = collapsible && React.createElement("div", {
	      className: 'control',
	      onClick: this.handleCollapse
	    }, this.state.collapsed ? React.createElement("i", {
	      className: 'iconfont icon-down-arrow'
	    }) : React.createElement("i", {
	      className: 'iconfont icon-up-arrow'
	    }));
	    const maximizeControl = maximizable && React.createElement("div", {
	      className: 'control',
	      onClick: this.handleMaximize
	    }, this.state.maximized ? React.createElement("i", {
	      className: 'iconfont icon-minimize'
	    }) : React.createElement("i", {
	      className: 'iconfont icon-maximize'
	    }));
	    const closeControl = closable && React.createElement("div", {
	      className: 'control',
	      onClick: this.handleClose
	    }, React.createElement("i", {
	      className: 'iconfont icon-close-thin'
	    }));
	    return React.createElement("div", {
	      className: bind('Panel', this.state.maximized && 'maximized', this.state.collapsed && 'collapsed', this.state.closed && 'hidden', !show && 'hidden', className),
	      style: style
	    }, React.createElement("div", {
	      className: bind('header', header ? null : 'hidden')
	    }, React.createElement("span", {
	      className: "title"
	    }, title), React.createElement("div", {
	      className: "controls"
	    }, collapseControl, maximizeControl, closeControl)), React.createElement("div", {
	      className: 'body'
	    }, children));
	  }

	}

	Panel.propTypes = {
	  title: propTypes.string,
	  className: propTypes.string,
	  style: propTypes.object,
	  children: propTypes.node,
	  show: propTypes.bool,
	  header: propTypes.bool,
	  collapsible: propTypes.bool,
	  collapsed: propTypes.bool,
	  onCollapse: propTypes.func,
	  maximizable: propTypes.bool,
	  maximized: propTypes.bool,
	  onMaximize: propTypes.bool,
	  closable: propTypes.bool,
	  closed: propTypes.bool,
	  onClose: propTypes.func
	};
	Panel.defaultProps = {
	  title: null,
	  className: null,
	  style: null,
	  children: null,
	  show: true,
	  header: true,
	  collapsible: false,
	  collapsed: false,
	  onCollapse: null,
	  maximizable: false,
	  maximized: false,
	  onMaximize: null,
	  closable: false,
	  closed: false,
	  onClose: null
	};

	/**
	 * 加载动画
	 * @author tengge / https://github.com/tengge1
	 */

	class LoadMask extends React.Component {
	  constructor(props) {
	    super(props);
	  }

	  render() {
	    const {
	      className,
	      style,
	      show,
	      text
	    } = this.props;
	    return React.createElement("div", {
	      className: bind('LoadMask', className, !show && 'hidden'),
	      style: style
	    }, React.createElement("div", {
	      className: 'box'
	    }, React.createElement("div", {
	      className: 'msg'
	    }, text)));
	  }

	}

	LoadMask.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  show: propTypes.bool,
	  text: propTypes.string
	};
	LoadMask.defaultProps = {
	  className: null,
	  style: null,
	  show: true,
	  text: 'Waiting...'
	};

	/**
	 * 属性表
	 * @author tengge / https://github.com/tengge1
	 */

	class PropertyGrid extends React.Component {
	  render() {
	    const {
	      className,
	      style,
	      children
	    } = this.props;
	    return React.createElement("div", {
	      className: bind('PropertyGrid', className),
	      style: style
	    }, children);
	  }

	}

	PropertyGrid.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  children: propTypes.node
	};
	PropertyGrid.defaultProps = {
	  className: null,
	  style: null,
	  children: null
	};

	/**
	 * 属性组
	 * @author tengge / https://github.com/tengge1
	 */

	class PropertyGroup extends React.Component {
	  constructor(props) {
	    super(props);
	    this.contentRef = React.createRef();
	    this.handleExpand = this.handleExpand.bind(this, props.onExpand);
	  }

	  render() {
	    const {
	      className,
	      style,
	      children,
	      title,
	      show,
	      expanded
	    } = this.props;
	    return React.createElement("div", {
	      className: bind('PropertyGroup', !show && 'hidden'),
	      style: style
	    }, React.createElement("div", {
	      className: 'head',
	      expanded: expanded ? 'true' : 'false',
	      onClick: this.handleExpand
	    }, React.createElement("div", {
	      className: 'icon'
	    }, React.createElement("i", {
	      className: expanded ? 'icon-expand' : 'icon-collapse'
	    })), React.createElement("div", {
	      className: 'title'
	    }, title)), React.createElement("div", {
	      className: bind('content', !expanded && 'collapsed'),
	      ref: this.contentRef
	    }, React.Children.map(children, (n, i) => {
	      if (n.props.show === false) {
	        return null;
	      }

	      let typeName = n.type.name;

	      if (typeName.indexOf('$') > -1) {
	        typeName = typeName.split('$')[0];
	      }

	      return React.createElement("div", {
	        className: bind('property', typeName),
	        key: i
	      }, React.createElement("div", {
	        className: 'label'
	      }, n.props.label), React.createElement("div", {
	        className: 'field'
	      }, n));
	    })));
	  }

	  componentDidUpdate() {
	    let content = this.contentRef.current;
	    let height = 0;

	    for (let i = 0; i < content.children.length; i++) {
	      let child = content.children[i];
	      height += child.offsetHeight; // offsetHeight包含下边框
	    }

	    content.style.height = `${height}px`;
	  }

	  handleExpand(onExpand, event) {
	    const expanded = event.target.getAttribute('expanded') === 'true';
	    onExpand && onExpand(!expanded, event);
	  }

	}

	PropertyGroup.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  children: propTypes.node,
	  title: propTypes.string,
	  show: propTypes.bool,
	  expanded: propTypes.bool,
	  onExpand: propTypes.func
	};
	PropertyGroup.defaultProps = {
	  className: null,
	  style: null,
	  children: null,
	  title: 'Group',
	  show: true,
	  expanded: true,
	  onExpand: null
	};

	/**
	 * 展示属性
	 * @author tengge / https://github.com/tengge1
	 */

	class DisplayProperty extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleClick = this.handleClick.bind(this, props.onClick);
	  }

	  render() {
	    const {
	      className,
	      style,
	      name,
	      value,
	      btnShow,
	      btnText
	    } = this.props;
	    return React.createElement("div", {
	      className: bind('wrap', className),
	      style: style
	    }, React.createElement("div", {
	      className: 'label'
	    }, value), btnShow && React.createElement(Button, {
	      className: 'button',
	      onClick: this.handleClick
	    }, btnText));
	  }

	  handleClick(onClick, name, event) {
	    onClick && onClick(this.props.name, event);
	  }

	}

	DisplayProperty.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  name: propTypes.string,
	  value: propTypes.string,
	  btnShow: propTypes.bool,
	  btnText: propTypes.string,
	  onClick: propTypes.func
	};
	DisplayProperty.defaultProps = {
	  className: null,
	  style: null,
	  name: 'name',
	  value: '',
	  btnShow: false,
	  btnText: 'Button',
	  onClick: null
	};

	/**
	 * 文本属性
	 * @author tengge / https://github.com/tengge1
	 */

	class TextProperty extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleChange = this.handleChange.bind(this, props.onChange);
	  }

	  render() {
	    const {
	      className,
	      style,
	      name,
	      value
	    } = this.props;
	    return React.createElement(Input, {
	      className: bind('input', className),
	      style: style,
	      name: name,
	      value: value,
	      onChange: this.handleChange
	    });
	  }

	  handleChange(onChange, value, name, event) {
	    onChange && onChange(value, name, event);
	  }

	}

	TextProperty.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  name: propTypes.string,
	  value: propTypes.string,
	  onChange: propTypes.func
	};
	TextProperty.defaultProps = {
	  className: null,
	  style: null,
	  name: null,
	  value: '',
	  onChange: null
	};

	/**
	 * 复选框属性
	 * @author tengge / https://github.com/tengge1
	 */

	class CheckBoxProperty extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleChange = this.handleChange.bind(this, props.onChange);
	  }

	  render() {
	    const {
	      className,
	      style,
	      name,
	      value
	    } = this.props;
	    return React.createElement(CheckBox, {
	      className: bind('checkbox', className),
	      style: style,
	      name: name,
	      checked: value,
	      onChange: this.handleChange
	    });
	  }

	  handleChange(onChange, value, name, event) {
	    onChange && onChange(value, name, event);
	  }

	}

	CheckBoxProperty.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  name: propTypes.string,
	  value: propTypes.bool,
	  onChange: propTypes.func
	};
	CheckBoxProperty.defaultProps = {
	  className: null,
	  style: null,
	  name: null,
	  value: false,
	  onChange: null
	};

	/**
	 * 数字属性
	 * @author tengge / https://github.com/tengge1
	 */

	class NumberProperty extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleChange = this.handleChange.bind(this, props.onChange);
	  }

	  render() {
	    const {
	      className,
	      style,
	      name,
	      value,
	      min,
	      max,
	      step
	    } = this.props;
	    return React.createElement(Input, {
	      className: bind('input', className),
	      style: style,
	      name: name,
	      type: 'number',
	      value: value,
	      min: min,
	      max: max,
	      step: step,
	      onChange: this.handleChange
	    });
	  }

	  handleChange(onChange, value, name, event) {
	    onChange && onChange(value, name, event);
	  }

	}

	NumberProperty.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  name: propTypes.string,
	  value: propTypes.number,
	  min: propTypes.number,
	  max: propTypes.number,
	  step: propTypes.number,
	  onChange: propTypes.func
	};
	NumberProperty.defaultProps = {
	  className: null,
	  style: null,
	  name: null,
	  value: 0,
	  min: null,
	  max: null,
	  step: null,
	  onChange: null
	};

	/**
	 * 按钮属性
	 * @author tengge / https://github.com/tengge1
	 */

	class ButtonProperty extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleChange = this.handleChange.bind(this, props.onChange);
	  }

	  render() {
	    const {
	      className,
	      style,
	      text
	    } = this.props;
	    return React.createElement(Button, {
	      className: bind('button', className),
	      style: style,
	      onClick: this.handleChange
	    }, text);
	  }

	  handleChange(onChange, name, value, event) {
	    onChange && onChange(name, value, event);
	  }

	}

	ButtonProperty.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  text: propTypes.string,
	  onChange: propTypes.func
	};
	ButtonProperty.defaultProps = {
	  className: null,
	  style: null,
	  text: 'Button',
	  onChange: null
	};

	/**
	 * 颜色属性
	 * @author tengge / https://github.com/tengge1
	 */

	class ColorProperty extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleChange = this.handleChange.bind(this, props.onChange);
	  }

	  render() {
	    const {
	      className,
	      style,
	      name,
	      value
	    } = this.props;
	    return React.createElement(Input, {
	      className: bind('input', className),
	      style: style,
	      name: name,
	      type: 'color',
	      value: value,
	      onChange: this.handleChange
	    });
	  }

	  handleChange(onChange, value, name, event) {
	    onChange && onChange(value, name, event);
	  }

	}

	ColorProperty.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  name: propTypes.string,
	  value: propTypes.string,
	  onChange: propTypes.func
	};
	ColorProperty.defaultProps = {
	  className: null,
	  style: null,
	  name: null,
	  value: '',
	  onChange: null
	};

	/**
	 * 文本属性
	 * @author tengge / https://github.com/tengge1
	 */

	class SelectProperty extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleChange = this.handleChange.bind(this, props.onChange);
	  }

	  render() {
	    const {
	      className,
	      style,
	      options,
	      name,
	      value,
	      disabled
	    } = this.props;
	    return React.createElement(Select, {
	      className: bind('select', className),
	      style: style,
	      options: options,
	      name: name,
	      value: value,
	      disabled: disabled,
	      onChange: this.handleChange
	    });
	  }

	  handleChange(onChange, value, name, event) {
	    onChange && onChange(value, name, event);
	  }

	}

	SelectProperty.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  options: propTypes.object,
	  name: propTypes.string,
	  value: propTypes.oneOfType([propTypes.string, propTypes.number]),
	  disabled: propTypes.bool,
	  onChange: propTypes.func
	};
	SelectProperty.defaultProps = {
	  className: null,
	  style: null,
	  options: {},
	  name: null,
	  value: null,
	  disabled: false,
	  onChange: null
	};

	/**
	 * 整数属性
	 * @author tengge / https://github.com/tengge1
	 */

	class IntegerProperty extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleChange = this.handleChange.bind(this, props.onChange);
	  }

	  render() {
	    const {
	      className,
	      style,
	      name,
	      value,
	      min,
	      max
	    } = this.props;
	    return React.createElement(Input, {
	      className: bind('input', className),
	      style: style,
	      name: name,
	      type: 'number',
	      value: value,
	      min: min,
	      max: max,
	      step: 1,
	      precision: 0,
	      onChange: this.handleChange
	    });
	  }

	  handleChange(onChange, value, name, event) {
	    if (value === null) {
	      onChange && onChange(value, name, event);
	    } else {
	      onChange && onChange(parseInt(value), name, event);
	    }
	  }

	}

	IntegerProperty.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  name: propTypes.string,
	  value: propTypes.number,
	  min: propTypes.number,
	  max: propTypes.number,
	  onChange: propTypes.func
	};
	IntegerProperty.defaultProps = {
	  className: null,
	  style: null,
	  name: null,
	  value: 0,
	  min: null,
	  max: null,
	  onChange: null
	};

	/**
	 * 按钮组属性
	 * @author tengge / https://github.com/tengge1
	 */

	class ButtonsProperty extends React.Component {
	  constructor(props) {
	    super(props);
	  }

	  render() {
	    const {
	      className,
	      style,
	      children
	    } = this.props;
	    return React.createElement("div", {
	      className: bind('buttons', className),
	      style: style
	    }, children);
	  }

	}

	ButtonsProperty.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  children: propTypes.node
	};
	ButtonsProperty.defaultProps = {
	  className: null,
	  style: null,
	  children: null
	};

	/**
	 * 纹理属性
	 * @author tengge / https://github.com/tengge1
	 */

	class TextureProperty extends React.Component {
	  constructor(props) {
	    super(props);
	    this.canvasRef = React.createRef();
	    this.handleSelect = this.handleSelect.bind(this);
	    this.handleEnable = this.handleEnable.bind(this, props.onChange);
	    this.handleChange = this.handleChange.bind(this, props.onChange);
	  }

	  render() {
	    const {
	      className,
	      style,
	      value,
	      showScale,
	      scale
	    } = this.props;
	    return React.createElement("div", {
	      className: bind('texture', className),
	      style: style
	    }, React.createElement(CheckBox, {
	      checked: value !== null,
	      onChange: this.handleEnable
	    }), React.createElement("canvas", {
	      title: value ? value.sourceFile : '',
	      ref: this.canvasRef,
	      onClick: this.handleSelect
	    }), React.createElement(Input, {
	      type: 'number',
	      value: scale,
	      show: showScale
	    }));
	  }

	  componentDidMount() {
	    let input = document.createElement(`input`);
	    input.type = 'file';
	    input.addEventListener(`change`, this.handleChange);
	    this.input = input;
	    this.componentDidUpdate();
	  }

	  componentDidUpdate() {
	    let texture = this.props.value;
	    const canvas = this.canvasRef.current;
	    const context = canvas.getContext('2d');

	    if (texture !== null) {
	      let image = texture.image;

	      if (image !== undefined && image.width > 0) {
	        context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
	      } else {
	        context.clearRect(0, 0, canvas.width, canvas.height);
	      }
	    } else if (context !== null) {
	      context.clearRect(0, 0, canvas.width, canvas.height);
	    }
	  }

	  handleSelect(event) {
	    this.input.value = null;
	    this.input.click();
	  }

	  handleEnable(onChange, enabled, name, event) {
	    const value = this.props.value;

	    if (enabled && value === null) {
	      this.input.value = null;
	      this.input.click();
	      return;
	    }

	    if (enabled) {
	      onChange && onChange(value, this.props.name, event);
	    } else {
	      onChange && onChange(null, this.props.name, event);
	    }
	  }

	  handleChange(onChange, event) {
	    const file = event.target.files[0];

	    if (!file.type.match('image.*')) {
	      console.warn(`TextureProperty: File Type Error.`);
	      return;
	    }

	    let reader = new FileReader();

	    if (file.type === 'image/targa') {
	      reader.addEventListener('load', event => {
	        let result = new THREE.TGALoader().parse(event.target.result);
	        let texture = new THREE.CanvasTexture(result, THREE.UVMapping);
	        texture.sourceFile = file.name;
	        onChange && onChange(texture, this.props.name, event);
	      }, false);
	      reader.readAsArrayBuffer(file);
	    } else {
	      reader.addEventListener('load', event => {
	        let image = document.createElement('img');
	        image.addEventListener('load', () => {
	          let texture = new THREE.Texture(image, THREE.UVMapping);
	          texture.sourceFile = file.name;
	          texture.format = file.type === 'image/jpeg' ? THREE.RGBFormat : THREE.RGBAFormat;
	          texture.needsUpdate = true;
	          onChange && onChange(texture, this.props.name, event);
	        }, false);
	        image.src = event.target.result;
	      }, false);
	      reader.readAsDataURL(file);
	    }
	  }

	}

	TextureProperty.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  name: propTypes.string,
	  value: (props, propName, componentName) => {
	    const value = props.value;

	    if (value === null) {
	      return;
	    }

	    if (!(value instanceof THREE.Texture)) {
	      return new TypeError(`Invalid prop \`${propName}\` of type \`${typeof value}\` supplied to \`${componentName}\`, expected \`THREE.Texture\`.`);
	    }
	  },
	  showScale: propTypes.bool,
	  scale: propTypes.number,
	  onChange: propTypes.func
	};
	TextureProperty.defaultProps = {
	  className: null,
	  style: null,
	  name: null,
	  value: null,
	  showScale: false,
	  scale: 1.0,
	  onChange: null
	};

	/**
	 * SVG
	 * @author tengge / https://github.com/tengge1
	 */

	class SVG extends React.Component {
	  render() {
	    const {
	      className,
	      style,
	      ...others
	    } = this.props;
	    return React.createElement("svg", _extends({
	      className: bind('SVG', className),
	      style: style
	    }, others));
	  }

	}

	SVG.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object
	};
	SVG.defaultProps = {
	  className: null,
	  style: null
	};

	/**
	 * 数据表格
	 * @author tengge / https://github.com/tengge1
	 */

	class DataGrid extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleClick = this.handleClick.bind(this, props.onSelect);
	  }

	  handleClick(onSelect, event) {
	    const id = event.currentTarget.getAttribute('data-id');
	    const record = this.props.data.filter(n => n.id === id)[0];
	    onSelect && onSelect(record);
	  }

	  render() {
	    const {
	      className,
	      style,
	      children,
	      data,
	      selected
	    } = this.props;
	    const columns = children.props.children.map(n => {
	      return {
	        type: n.props.type,
	        field: n.props.field,
	        title: n.props.title
	      };
	    });
	    const header = React.createElement("thead", null, React.createElement("tr", null, columns.map(n => {
	      let field = n.type === 'number' ? 'number' : n.field;
	      return React.createElement("td", {
	        name: n.field,
	        key: field
	      }, n.title);
	    })));
	    const body = React.createElement("tbody", null, data.map((n, i) => {
	      return React.createElement("tr", {
	        className: selected === n.id ? 'selected' : null,
	        "data-id": n.id,
	        key: n.id,
	        onClick: this.handleClick
	      }, columns.map((m, j) => {
	        if (m.type === 'number') {
	          return React.createElement("td", {
	            key: 'number'
	          }, i + 1);
	        } else {
	          return React.createElement("td", {
	            key: m.field
	          }, n[m.field]);
	        }
	      }));
	    }));
	    return React.createElement("table", {
	      className: bind('DataGrid', className),
	      style: style
	    }, header, body);
	  }

	}

	DataGrid.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  children: (props, propName, componentName) => {
	    const children = props[propName];

	    if (children.type !== Columns) {
	      return new TypeError(`Invalid prop \`${propName}\` of type \`${children.type.name}\` supplied to \`${componentName}\`, expected \`Columns\`.`);
	    }
	  },
	  data: propTypes.array,
	  selected: propTypes.string,
	  onSelect: propTypes.func
	};
	DataGrid.defaultProps = {
	  className: null,
	  style: null,
	  children: null,
	  data: [],
	  selected: null,
	  onSelect: null
	};

	/**
	 * 表格
	 * @author tengge / https://github.com/tengge1
	 */

	class Table extends React.Component {
	  render() {
	    const {
	      className,
	      style,
	      children,
	      ...others
	    } = this.props;
	    return React.createElement("table", _extends({
	      className: bind('Table', className),
	      style: style
	    }, others), children);
	  }

	}

	Table.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  children: propTypes.node
	};
	Table.defaultProps = {
	  className: null,
	  style: null,
	  children: null
	};

	/**
	 * 表格内容
	 * @author tengge / https://github.com/tengge1
	 */

	class TableBody extends React.Component {
	  render() {
	    const {
	      className,
	      style,
	      children,
	      ...others
	    } = this.props;
	    return React.createElement("tbody", _extends({
	      className: bind('TableBody', className),
	      style: style
	    }, others), children);
	  }

	}

	TableBody.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  children: propTypes.node
	};
	TableBody.defaultProps = {
	  className: null,
	  style: null,
	  children: null
	};

	/**
	 * 表格单元格
	 * @author tengge / https://github.com/tengge1
	 */

	class TableCell extends React.Component {
	  render() {
	    const {
	      className,
	      style,
	      children,
	      ...others
	    } = this.props;
	    return React.createElement("td", _extends({
	      className: bind('TableCell', className),
	      style: style
	    }, others), children);
	  }

	}

	TableCell.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  children: propTypes.node
	};
	TableCell.defaultProps = {
	  className: null,
	  style: null,
	  children: null
	};

	/**
	 * 表格头部
	 * @author tengge / https://github.com/tengge1
	 */

	class TableHead extends React.Component {
	  render() {
	    const {
	      className,
	      style,
	      children,
	      ...others
	    } = this.props;
	    return React.createElement("thead", _extends({
	      className: bind('TableHead', className),
	      style: style
	    }, others), children);
	  }

	}

	TableHead.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  children: propTypes.node
	};
	TableHead.defaultProps = {
	  className: null,
	  style: null,
	  children: null
	};

	/**
	 * 表格行
	 * @author tengge / https://github.com/tengge1
	 */

	class TableRow extends React.Component {
	  render() {
	    const {
	      className,
	      style,
	      children,
	      ...others
	    } = this.props;
	    return React.createElement("tr", _extends({
	      className: bind('TableRow', className),
	      style: style
	    }, others), children);
	  }

	}

	TableRow.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  children: propTypes.node
	};
	TableRow.defaultProps = {
	  className: null,
	  style: null,
	  children: null
	};

	/**
	 * 工具栏
	 * @author tengge / https://github.com/tengge1
	 */

	class Toolbar extends React.Component {
	  render() {
	    const {
	      className,
	      style,
	      children,
	      direction
	    } = this.props;
	    return React.createElement("div", {
	      className: bind('Toolbar', direction, className),
	      style: style
	    }, children);
	  }

	}

	Toolbar.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  direction: propTypes.oneOf(['horizontal', 'vertical']),
	  children: propTypes.node
	};
	Toolbar.defaultProps = {
	  className: null,
	  style: null,
	  direction: 'horizontal',
	  children: null
	};

	/**
	 * 工具栏分割线
	 * @author tengge / https://github.com/tengge1
	 */

	class ToolbarSeparator extends React.Component {
	  render() {
	    const {
	      className,
	      style
	    } = this.props;
	    return React.createElement("div", {
	      className: bind('ToolbarSeparator', className),
	      style: style
	    }, React.createElement("div", {
	      className: "separator"
	    }));
	  }

	}

	ToolbarSeparator.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object
	};
	ToolbarSeparator.defaultProps = {
	  className: null,
	  style: null
	};

	/**
	 * 工具栏填充
	 * @author tengge / https://github.com/tengge1
	 */

	class ToolbarFiller extends React.Component {
	  render() {
	    const {
	      className,
	      style
	    } = this.props;
	    return React.createElement("div", {
	      className: bind('ToolbarFiller', className),
	      style: style
	    });
	  }

	}

	ToolbarFiller.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object
	};
	ToolbarFiller.defaultProps = {
	  className: null,
	  style: null
	};

	/**
	 * 时间轴
	 * @author tengge / https://github.com/tengge1
	 */

	class Timeline extends React.Component {
	  constructor(props) {
	    super(props);
	    this.duration = 120; // 持续时长(秒)

	    this.scale = 30; // 尺寸，1秒=30像素

	    this.time = 0; // 当前时间

	    this.speed = 16; // 当前速度

	    this.canvasRef = React.createRef();
	    this.layersRef = React.createRef();
	    this.leftRef = React.createRef();
	    this.rightRef = React.createRef();
	    this.sliderRef = React.createRef();
	    this.handleAddLayer = this.handleAddLayer.bind(this, props.onAddLayer);
	    this.handleEditLayer = this.handleEditLayer.bind(this, props.onEditLayer);
	    this.handleDeleteLayer = this.handleDeleteLayer.bind(this, props.onDeleteLayer);
	    this.commitDeleteLayer = this.commitDeleteLayer.bind(this);
	    this.handleSelectedLayerChange = this.handleSelectedLayerChange.bind(this, props.onSelectedLayerChange);
	    this.handleBackward = this.handleBackward.bind(this);
	    this.handlePlay = this.handlePlay.bind(this);
	    this.handlePause = this.handlePause.bind(this);
	    this.handleForward = this.handleForward.bind(this);
	    this.handleStop = this.handleStop.bind(this);
	    this.handleClick = this.handleClick.bind(this, props.onClickAnimation);
	    this.handleDoubleClick = this.handleDoubleClick.bind(this, props.onAddAnimation);
	    this.handleRightScroll = this.handleRightScroll.bind(this);
	    this.handleDragStart = this.handleDragStart.bind(this);
	    this.handleDragEnd = this.handleDragEnd.bind(this);
	    this.handleDragEnter = this.handleDragEnter.bind(this);
	    this.handleDragOver = this.handleDragOver.bind(this);
	    this.handleDragLeave = this.handleDragLeave.bind(this);
	    this.handleDrop = this.handleDrop.bind(this, props.onDropAnimation);
	  }

	  render() {
	    const {
	      className,
	      style,
	      animations,
	      selectedLayer,
	      selected
	    } = this.props;
	    return React.createElement("div", {
	      className: bind('Timeline', className),
	      style: style
	    }, React.createElement(Toolbar, {
	      className: bind('controls', className),
	      style: style
	    }, React.createElement(IconButton, {
	      icon: 'add',
	      title: _t('Add Layer'),
	      onClick: this.handleAddLayer
	    }), React.createElement(IconButton, {
	      icon: 'edit',
	      title: _t('Edit Layer'),
	      onClick: this.handleEditLayer
	    }), React.createElement(IconButton, {
	      icon: 'delete',
	      title: _t('Delete Layer'),
	      onClick: this.handleDeleteLayer
	    }), React.createElement(ToolbarSeparator, null), React.createElement(IconButton, {
	      icon: 'backward',
	      title: _t('Slower'),
	      onClick: this.handleBackward
	    }), React.createElement(IconButton, {
	      icon: 'play',
	      title: _t('Play'),
	      onClick: this.handlePlay
	    }), React.createElement(IconButton, {
	      icon: 'pause',
	      title: _t('Pause'),
	      onClick: this.handlePause
	    }), React.createElement(IconButton, {
	      icon: 'forward',
	      title: _t('Faster'),
	      onClick: this.handleForward
	    }), React.createElement(IconButton, {
	      icon: 'stop',
	      title: _t('Stop'),
	      onClick: this.handleStop
	    }), React.createElement(ToolbarSeparator, null), React.createElement(Label, {
	      className: 'time'
	    }, this.parseTime(this.time)), React.createElement(Label, {
	      className: 'speed'
	    }, this.parseSpeed(this.speed)), React.createElement(ToolbarFiller, null), React.createElement(Label, null, _t('Illustrate: Double-click the area below the timeline to add an animation.'))), React.createElement("div", {
	      className: "box"
	    }, React.createElement("div", {
	      className: 'timeline'
	    }, React.createElement("div", {
	      className: "mask"
	    }), React.createElement("canvas", {
	      ref: this.canvasRef
	    })), React.createElement("div", {
	      className: 'layers'
	    }, React.createElement("div", {
	      className: 'left',
	      ref: this.leftRef
	    }, animations.map(layer => {
	      return React.createElement("div", {
	        className: 'info',
	        key: layer.uuid
	      }, React.createElement(CheckBox, {
	        name: layer.uuid,
	        checked: selectedLayer === layer.uuid,
	        onChange: this.handleSelectedLayerChange
	      }), React.createElement(Label, null, layer.layerName));
	    })), React.createElement("div", {
	      className: 'right',
	      ref: this.rightRef,
	      onScroll: this.handleRightScroll
	    }, animations.map(layer => {
	      return React.createElement("div", {
	        className: 'layer',
	        droppable: 'true',
	        "data-type": 'layer',
	        "data-id": layer.uuid,
	        onDoubleClick: this.handleDoubleClick,
	        onDragEnter: this.handleDragEnter,
	        onDragOver: this.handleDragOver,
	        onDragLeave: this.handleDragLeave,
	        onDrop: this.handleDrop,
	        key: layer.uuid
	      }, layer.animations.map(animation => {
	        return React.createElement("div", {
	          className: bind('animation', selected === animation.uuid && 'selected'),
	          title: animation.name,
	          draggable: 'true',
	          droppable: 'false',
	          "data-type": 'animation',
	          "data-id": animation.uuid,
	          "data-pid": layer.uuid,
	          style: {
	            left: animation.beginTime * this.scale + 'px',
	            width: (animation.endTime - animation.beginTime) * this.scale + 'px'
	          },
	          onClick: this.handleClick,
	          onDragStart: this.handleDragStart,
	          onDragEnd: this.handleDragEnd,
	          key: animation.uuid
	        }, animation.name);
	      }));
	    })), React.createElement("div", {
	      className: "slider",
	      ref: this.sliderRef
	    }))));
	  }

	  componentDidMount() {
	    this.renderTimeline();
	  }

	  renderTimeline() {
	    const {
	      duration,
	      scale
	    } = this;
	    const width = duration * scale; // 画布宽度

	    const scale5 = scale / 5; // 0.2秒像素数

	    const margin = 0; // 时间轴前后间距

	    const canvas = this.canvasRef.current;
	    canvas.style.width = width + margin * 2 + 'px';
	    canvas.width = canvas.clientWidth;
	    canvas.height = 32;
	    const context = canvas.getContext('2d'); // 时间轴背景

	    context.fillStyle = '#fafafa';
	    context.fillRect(0, 0, canvas.width, canvas.height); // 时间轴刻度

	    context.strokeStyle = '#555';
	    context.beginPath();

	    for (let i = margin; i <= width + margin; i += scale) {
	      // 绘制每一秒
	      for (let j = 0; j < 5; j++) {
	        // 绘制每个小格
	        if (j === 0) {
	          // 长刻度
	          context.moveTo(i + scale5 * j, 22);
	          context.lineTo(i + scale5 * j, 30);
	        } else {
	          // 短刻度
	          context.moveTo(i + scale5 * j, 26);
	          context.lineTo(i + scale5 * j, 30);
	        }
	      }
	    }

	    context.stroke(); // 时间轴文字

	    context.font = '12px Arial';
	    context.fillStyle = '#888';

	    for (let i = 0; i <= duration; i += 2) {
	      // 对于每两秒
	      let minute = Math.floor(i / 60);
	      let second = Math.floor(i % 60);
	      let text = (minute > 0 ? minute + ':' : '') + ('0' + second).slice(-2);

	      if (i === 0) {
	        context.textAlign = 'left';
	      } else if (i === duration) {
	        context.textAlign = 'right';
	      } else {
	        context.textAlign = 'center';
	      }

	      context.fillText(text, margin + i * scale, 16);
	    }
	  }

	  handleAddLayer(onAddLayer, event) {
	    onAddLayer && onAddLayer(event);
	  }

	  handleEditLayer(onEditLayer, event) {
	    const {
	      selectedLayer
	    } = this.props;
	    onEditLayer && onEditLayer(selectedLayer, event);
	  }

	  handleDeleteLayer(onDeleteLayer, event) {
	    const {
	      selectedLayer
	    } = this.props;
	    onDeleteLayer && onDeleteLayer(selectedLayer, event);
	  }

	  commitDeleteLayer() {}

	  handleSelectedLayerChange(onSelectedLayerChange, value, name, event) {
	    onSelectedLayerChange && onSelectedLayerChange(value ? name : null, event);
	  }

	  handleBackward(event) {}

	  handlePlay(event) {}

	  handlePause(event) {}

	  handleForward(event) {}

	  handleStop(event) {}

	  handleClick(onClickAnimation, event) {
	    const type = event.target.getAttribute('data-type');

	    if (type !== 'animation') {
	      return;
	    }

	    const pid = event.target.getAttribute('data-pid');
	    const id = event.target.getAttribute('data-id');
	    onClickAnimation && onClickAnimation(id, pid, event);
	  }

	  handleDoubleClick(onAddAnimation, event) {
	    const type = event.target.getAttribute('data-type');

	    if (type !== 'layer') {
	      return;
	    }

	    const layerID = event.target.getAttribute('data-id');
	    const beginTime = event.nativeEvent.offsetX / this.scale;
	    const endTime = beginTime + 2;
	    onAddAnimation && onAddAnimation(layerID, beginTime, endTime, event);
	  }

	  handleRightScroll(scroll) {
	    let left = this.leftRef.current;
	    let canvas = this.canvasRef.current;
	    left.scrollTop = event.target.scrollTop;
	    canvas.style.left = `${100 - event.target.scrollLeft}px`;
	  }

	  handleDragStart(event) {
	    const type = event.target.getAttribute('data-type');

	    if (type !== 'animation') {
	      return;
	    }

	    const id = event.target.getAttribute('data-id');
	    const pid = event.target.getAttribute('data-pid');
	    event.nativeEvent.dataTransfer.setData('id', id);
	    event.nativeEvent.dataTransfer.setData('pid', pid);
	    event.nativeEvent.dataTransfer.setData('offsetX', event.nativeEvent.offsetX);
	  }

	  handleDragEnd(event) {
	    event.nativeEvent.dataTransfer.clearData();
	  }

	  handleDragEnter(event) {
	    event.preventDefault();
	  }

	  handleDragOver(event) {
	    event.preventDefault();
	  }

	  handleDragLeave(event) {
	    event.preventDefault();
	  }

	  handleDrop(onDropAnimation, event) {
	    const type = event.target.getAttribute('data-type');

	    if (type !== 'layer') {
	      return;
	    }

	    const id = event.nativeEvent.dataTransfer.getData('id');
	    const oldLayerID = event.nativeEvent.dataTransfer.getData('pid');
	    const offsetX = event.nativeEvent.dataTransfer.getData('offsetX');
	    const newLayerID = event.target.getAttribute('data-id');
	    const beginTime = (event.nativeEvent.offsetX - offsetX) / this.scale;
	    onDropAnimation && onDropAnimation(id, oldLayerID, newLayerID, beginTime, event);
	  }

	  parseTime(time) {
	    let minute = `0${parseInt(time / 60)}`;
	    let second = `0${parseInt(time % 60)}`;
	    return `${minute.substr(minute.length - 2, 2)}:${second.substr(second.length - 2, 2)}`;
	  }

	  parseSpeed(speed) {
	    return speed;
	  }

	}

	Timeline.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  animations: propTypes.array,
	  selectedLayer: propTypes.string,
	  selected: propTypes.string,
	  onAddLayer: propTypes.func,
	  onEditLayer: propTypes.func,
	  onDeleteLayer: propTypes.func,
	  onSelectedLayerChange: propTypes.func,
	  onAddAnimation: propTypes.func,
	  onDropAnimation: propTypes.func,
	  onClickAnimation: propTypes.func
	};
	Timeline.defaultProps = {
	  className: null,
	  style: null,
	  animations: [],
	  selectedLayer: null,
	  selected: null,
	  onAddLayer: null,
	  onEditLayer: null,
	  onDeleteLayer: null,
	  onSelectedLayerChange: null,
	  onAddAnimation: null,
	  onDropAnimation: null,
	  onClickAnimation: null
	};

	/**
	 * 树
	 * @author tengge / https://github.com/tengge1
	 */

	class Tree extends React.Component {
	  constructor(props) {
	    super(props);
	    this.treeRef = React.createRef();
	    const {
	      onExpand,
	      onSelect,
	      onCheck,
	      onDoubleClick,
	      onDrop
	    } = this.props;
	    this.handleExpandNode = this.handleExpandNode.bind(this, onExpand);
	    this.handleClick = this.handleClick.bind(this, onSelect);
	    this.handleCheck = this.handleCheck.bind(this, onCheck);
	    this.handleDoubleClick = this.handleDoubleClick.bind(this, onDoubleClick);
	    this.handleClickIcon = this.handleClickIcon.bind(this, props.onClickIcon);
	    this.handleDrag = this.handleDrag.bind(this);
	    this.handleDragStart = this.handleDragStart.bind(this);
	    this.handleDragOver = this.handleDragOver.bind(this);
	    this.handleDragLeave = this.handleDragLeave.bind(this);
	    this.handleDrop = this.handleDrop.bind(this, onDrop);
	  }

	  render() {
	    const {
	      className,
	      style,
	      data
	    } = this.props; // 创建节点

	    var list = [];
	    Array.isArray(data) && data.forEach(n => {
	      list.push(this.createNode(n));
	    });
	    return React.createElement("ul", {
	      className: bind('Tree', className),
	      style: style,
	      ref: this.treeRef
	    }, list);
	  }

	  createNode(data) {
	    const leaf = !data.children || data.children.length === 0;
	    const children = leaf ? null : React.createElement("ul", {
	      className: bind('sub', data.expanded ? null : 'collpase')
	    }, data.children.map(n => {
	      return this.createNode(n);
	    }));
	    let checkbox = null;

	    if (data.checked === true || data.checked === false) {
	      checkbox = React.createElement(CheckBox, {
	        name: data.value,
	        checked: data.checked,
	        onChange: this.handleCheck
	      });
	    }

	    return React.createElement("li", {
	      className: bind('node', this.props.selected === data.value && 'selected'),
	      value: data.value,
	      key: data.value,
	      onClick: this.handleClick,
	      onDoubleClick: this.handleDoubleClick,
	      draggable: 'true',
	      droppable: 'true',
	      onDrag: this.handleDrag,
	      onDragStart: this.handleDragStart,
	      onDragOver: this.handleDragOver,
	      onDragLeave: this.handleDragLeave,
	      onDrop: this.handleDrop
	    }, React.createElement("i", {
	      className: bind('expand', leaf ? null : data.expanded ? 'minus' : 'plus'),
	      value: data.value,
	      onClick: this.handleExpandNode
	    }), checkbox, React.createElement("i", {
	      className: bind('type', leaf ? 'node' : data.expanded ? 'open' : 'close')
	    }), React.createElement("a", {
	      href: 'javascript:;'
	    }, data.text), data.icons && data.icons.map(n => {
	      return React.createElement(Icon, {
	        className: 'control',
	        name: n.name,
	        value: data.value,
	        icon: n.icon,
	        key: n.name,
	        onClick: this.handleClickIcon
	      });
	    }), leaf ? null : children);
	  } // 暂时屏蔽树节点动画，有bug。
	  // componentDidUpdate() {
	  //     let tree = this.treeRef.current;
	  //     // 将每棵子树设置高度，以便显示动画
	  //     this.handleSetTreeHeight(tree);
	  // }


	  handleSetTreeHeight(node) {
	    if (node.children.length === 0) {
	      return;
	    }

	    let height = 0;

	    for (let i = 0; i < node.children.length; i++) {
	      let child = node.children[i];
	      height += child.offsetHeight;
	      this.handleSetTreeHeight(child);
	    }

	    if (node.classList.contains('sub')) {
	      // 子树
	      node.style.height = `${height}px`;
	    }
	  }

	  handleExpandNode(onExpand, event) {
	    event.stopPropagation();
	    const value = event.target.getAttribute('value');
	    onExpand && onExpand(value, event);
	  }

	  handleClick(onSelect, event) {
	    event.stopPropagation();
	    var value = event.target.getAttribute('value');

	    if (value) {
	      onSelect && onSelect(value, event);
	    }
	  }

	  handleCheck(onCheck, value, name, event) {
	    event.stopPropagation();
	    onCheck && onCheck(value, name, event);
	  }

	  handleDoubleClick(onDoubleClick, event) {
	    const value = event.target.getAttribute('value');

	    if (value) {
	      onDoubleClick && onDoubleClick(value, event);
	    }
	  }

	  handleClickIcon(onClickIcon, name, event) {
	    const value = event.target.getAttribute('value');
	    event.stopPropagation();
	    onClickIcon && onClickIcon(value, name, event);
	  } // --------------------- 拖拽事件 ---------------------------


	  handleDrag(event) {
	    event.stopPropagation();
	    this.currentDrag = event.currentTarget;
	  }

	  handleDragStart(event) {
	    event.stopPropagation();
	    event.dataTransfer.setData('text', 'foo');
	  }

	  handleDragOver(event) {
	    event.preventDefault();
	    event.stopPropagation();
	    var target = event.currentTarget;

	    if (target === this.currentDrag) {
	      return;
	    }

	    var area = event.nativeEvent.offsetY / target.clientHeight;

	    if (area < 0.25) {
	      target.classList.add('dragTop');
	    } else if (area > 0.75) {
	      target.classList.add('dragBottom');
	    } else {
	      target.classList.add('drag');
	    }
	  }

	  handleDragLeave(event) {
	    event.preventDefault();
	    event.stopPropagation();
	    var target = event.currentTarget;

	    if (target === this.currentDrag) {
	      return;
	    }

	    target.classList.remove('dragTop');
	    target.classList.remove('dragBottom');
	    target.classList.remove('drag');
	  }

	  handleDrop(onDrop, event) {
	    event.preventDefault();
	    event.stopPropagation();
	    var target = event.currentTarget;

	    if (target === this.currentDrag) {
	      return;
	    }

	    target.classList.remove('dragTop');
	    target.classList.remove('dragBottom');
	    target.classList.remove('drag');

	    if (typeof onDrop === 'function') {
	      const area = event.nativeEvent.offsetY / target.clientHeight;
	      const currentValue = this.currentDrag.getAttribute('value');

	      if (area < 0.25) {
	        // 放在当前元素前面
	        onDrop(currentValue, // 拖动要素
	        target.parentNode.parentNode.getAttribute('value'), // 新位置父级
	        target.getAttribute('value') // 新位置索引
	        ); // 拖动, 父级, 索引
	      } else if (area > 0.75) {
	        // 放在当前元素后面
	        onDrop(currentValue, target.parentNode.parentNode.getAttribute('value'), target.nextSibling == null ? null : target.nextSibling.getAttribute('value') // target.nextSibling为null，说明是最后一个位置
	        );
	      } else {
	        // 成为该元素子级
	        onDrop(currentValue, target.getAttribute('value'), null);
	      }
	    }
	  }

	}

	Tree.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  data: propTypes.array,
	  selected: propTypes.string,
	  onExpand: propTypes.func,
	  onSelect: propTypes.func,
	  onCheck: propTypes.func,
	  onDoubleClick: propTypes.func,
	  onClickIcon: propTypes.func,
	  onDrop: propTypes.func
	};
	Tree.defaultProps = {
	  className: null,
	  style: null,
	  data: [],
	  selected: null,
	  onExpand: null,
	  onSelect: null,
	  onCheck: null,
	  onDoubleClick: null,
	  onClickIcon: null,
	  onDrop: null
	};

	/**
	 * 窗口
	 */

	class Window extends React.Component {
	  constructor(props) {
	    super(props);
	    this.dom = React.createRef();
	    this.isDown = false;
	    this.offsetX = 0;
	    this.offsetY = 0;
	    this.handleMouseDown = this.handleMouseDown.bind(this);
	    this.handleMouseMove = this.handleMouseMove.bind(this);
	    this.handleMouseUp = this.handleMouseUp.bind(this);
	    this.handleClose = this.handleClose.bind(this, props.onClose);
	  }

	  render() {
	    const {
	      className,
	      style,
	      title,
	      children,
	      hidden,
	      mask
	    } = this.props;
	    let _children = null;

	    if (children && Array.isArray(children)) {
	      _children = children;
	    } else if (children) {
	      _children = [children];
	    }

	    const content = _children.filter(n => {
	      return n.type === Content;
	    })[0];

	    const buttons = _children.filter(n => {
	      return n.type === Buttons;
	    })[0];

	    return React.createElement("div", {
	      className: bind('WindowMask', mask && 'mask', hidden && 'hidden')
	    }, React.createElement("div", {
	      className: bind('Window', className),
	      style: style,
	      ref: this.dom
	    }, React.createElement("div", {
	      className: 'wrap'
	    }, React.createElement("div", {
	      className: 'title',
	      onMouseDown: this.handleMouseDown
	    }, React.createElement("span", null, title), React.createElement("div", {
	      className: 'controls'
	    }, React.createElement("i", {
	      className: 'iconfont icon-close icon',
	      onClick: this.handleClose
	    }))), React.createElement("div", {
	      className: 'content'
	    }, content && content.props.children), React.createElement("div", {
	      className: 'buttons'
	    }, React.createElement("div", {
	      className: 'button-wrap'
	    }, buttons && buttons.props.children)))));
	  }

	  handleMouseDown(event) {
	    this.isDown = true;
	    var dom = this.dom.current;
	    var left = dom.style.left === '' ? 0 : parseInt(dom.style.left.replace('px', ''));
	    var top = dom.style.top === '' ? 0 : parseInt(dom.style.top.replace('px', ''));
	    this.offsetX = event.clientX - left;
	    this.offsetY = event.clientY - top;
	  }

	  handleMouseMove(event) {
	    if (!this.isDown) {
	      return;
	    }

	    var dx = event.clientX - this.offsetX;
	    var dy = event.clientY - this.offsetY;
	    var dom = this.dom.current;
	    dom.style.left = `${dx}px`;
	    dom.style.top = `${dy}px`;
	  }

	  handleMouseUp(event) {
	    this.isDown = false;
	    this.offsetX = 0;
	    this.offsetY = 0;
	  }

	  handleClose(onClose, event) {
	    onClose && onClose(event);
	  }

	  componentDidMount() {
	    document.body.addEventListener('mousemove', this.handleMouseMove);
	    document.body.addEventListener('mouseup', this.handleMouseUp);
	  }

	  componentWillUnmount() {
	    document.body.removeEventListener('mousemove', this.handleMouseMove);
	    document.body.removeEventListener('mouseup', this.handleMouseUp);
	  }

	}

	Window.show = function () {};

	Window.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  title: propTypes.string,
	  children: propTypes.node,
	  hidden: propTypes.bool,
	  mask: propTypes.bool,
	  onClose: propTypes.func
	};
	Window.defaultProps = {
	  className: null,
	  style: null,
	  title: 'Window',
	  children: null,
	  hidden: false,
	  mask: true,
	  onClose: null
	};

	/**
	 * 提示框
	 */

	class Alert extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleOK = this.handleOK.bind(this, props.onOK);
	    this.handleClose = this.handleClose.bind(this, props.onClose);
	  }

	  render() {
	    const {
	      className,
	      style,
	      title,
	      children,
	      hidden,
	      mask,
	      okText
	    } = this.props;
	    return React.createElement(Window, {
	      className: bind('Alert', className),
	      style: style,
	      title: title,
	      hidden: hidden,
	      mask: mask,
	      onClose: this.handleClose
	    }, React.createElement(Content, null, children), React.createElement(Buttons, null, React.createElement(Button, {
	      onClick: this.handleOK
	    }, okText)));
	  }

	  handleOK(onOK, event) {
	    onOK && onOK(event);
	  }

	  handleClose(onClose, event) {
	    onClose && onClose(event);
	  }

	}

	Alert.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  title: propTypes.string,
	  children: propTypes.node,
	  hidden: propTypes.bool,
	  mask: propTypes.bool,
	  okText: propTypes.string,
	  onOK: propTypes.func,
	  onClose: propTypes.func
	};
	Alert.defaultProps = {
	  className: null,
	  style: null,
	  title: 'Message',
	  children: null,
	  hidden: false,
	  mask: false,
	  okText: 'OK',
	  onOK: null,
	  onClose: null
	};

	/**
	 * 询问框
	 */

	class Confirm extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleOK = this.handleOK.bind(this, props.onOK);
	    this.handleCancel = this.handleCancel.bind(this, props.onCancel);
	    this.handleClose = this.handleClose.bind(this, props.onClose);
	  }

	  render() {
	    const {
	      className,
	      style,
	      title,
	      children,
	      hidden,
	      mask,
	      okText,
	      cancelText
	    } = this.props;
	    return React.createElement(Window, {
	      className: bind('Confirm', className),
	      style: style,
	      title: title,
	      hidden: hidden,
	      mask: mask,
	      onClose: this.handleClose
	    }, React.createElement(Content, null, children), React.createElement(Buttons, null, React.createElement(Button, {
	      onClick: this.handleOK
	    }, okText), React.createElement(Button, {
	      onClick: this.handleCancel
	    }, cancelText)));
	  }

	  handleOK(onOK, event) {
	    onOK && onOK(event);
	  }

	  handleCancel(onCancel, event) {
	    onCancel && onCancel(event);
	  }

	  handleClose(onClose, event) {
	    onClose && onClose(event);
	  }

	}

	Confirm.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  title: propTypes.string,
	  children: propTypes.node,
	  hidden: propTypes.bool,
	  mask: propTypes.bool,
	  okText: propTypes.string,
	  cancelText: propTypes.string,
	  onOK: propTypes.func,
	  onCancel: propTypes.func,
	  onClose: propTypes.func
	};
	Confirm.defaultProps = {
	  className: null,
	  style: null,
	  title: 'Confirm',
	  children: null,
	  hidden: false,
	  mask: false,
	  okText: 'OK',
	  cancelText: 'Cancel',
	  onOK: null,
	  onCancel: null,
	  onClose: null
	};

	/**
	 * 弹窗输入框
	 */

	class Prompt extends React.Component {
	  constructor(props) {
	    super(props);
	    this.state = {
	      value: props.value
	    };
	    this.handleOK = this.handleOK.bind(this, props.onOK);
	    this.handleClose = this.handleClose.bind(this, props.onClose);
	    this.handleChange = this.handleChange.bind(this);
	  }

	  render() {
	    const {
	      className,
	      style,
	      title,
	      content,
	      hidden,
	      mask,
	      okText
	    } = this.props;
	    return React.createElement(Window, {
	      className: bind('Prompt', className),
	      style: style,
	      title: title,
	      hidden: hidden,
	      mask: mask,
	      onClose: this.handleClose
	    }, React.createElement(Content, null, content, React.createElement(Input, {
	      value: this.state.value,
	      onChange: this.handleChange
	    })), React.createElement(Buttons, null, React.createElement(Button, {
	      onClick: this.handleOK
	    }, okText)));
	  }

	  handleOK(onOK, event) {
	    onOK && onOK(this.state.value, event);
	  }

	  handleClose(onClose, event) {
	    onClose && onClose(event);
	  }

	  handleChange(value) {
	    this.setState({
	      value
	    });
	  }

	}

	Prompt.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  title: propTypes.string,
	  content: propTypes.node,
	  value: propTypes.string,
	  hidden: propTypes.bool,
	  mask: propTypes.bool,
	  okText: propTypes.string,
	  onOK: propTypes.func,
	  onClose: propTypes.func
	};
	Prompt.defaultProps = {
	  className: null,
	  style: null,
	  title: 'Prompt',
	  content: null,
	  value: '',
	  hidden: false,
	  mask: false,
	  okText: 'OK',
	  onOK: null,
	  onClose: null
	};

	/**
	 * 提示窗
	 */

	class Toast extends React.Component {
	  constructor(props) {
	    super(props);
	  }

	  render() {
	    const {
	      className,
	      style,
	      children
	    } = this.props;
	    return React.createElement("div", {
	      className: 'ToastMark'
	    }, React.createElement("div", {
	      className: bind('Toast', className),
	      style: style
	    }, children));
	  }

	}

	Toast.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  children: propTypes.node
	};
	Toast.defaultProps = {
	  className: null,
	  style: null,
	  children: null
	};

	/**
	 * 语言加载器
	 * @author tengge / https://github.com/tengge1
	 */

	class LanguageLoader {
	  constructor() {
	    window._t = i18next.t.bind(i18next);
	  }

	  load() {
	    let lang = window.localStorage.getItem('lang');

	    if (!lang) {
	      let language = window.navigator.language.toLocaleLowerCase();

	      if (language === 'zh-cn') {
	        lang = 'zh-CN';
	      } else {
	        lang = 'en-US';
	      }
	    }

	    return new Promise(resolve => {
	      i18next.use(Backend).init({
	        lng: lang,
	        debug: false,
	        whitelist: ['en-US', 'zh-CN'],
	        backend: {
	          // for all available options read the backend's repository readme file
	          loadPath: 'locales/{{lng}}.json'
	        },
	        // allow keys to be phrases having `:`, `.`
	        nsSeparator: false,
	        keySeparator: false,
	        // do not load a fallback
	        fallbackLng: false
	      }, (err, t) => {
	        resolve();
	      });
	    });
	  }

	}

	/**
	 * 场景菜单
	 * @author tengge / https://github.com/tengge1
	 */

	class SceneMenu extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleCreateEmptyScene = this.handleCreateEmptyScene.bind(this);
	    this.handleSaveScene = this.handleSaveScene.bind(this);
	    this.handleSaveAsScene = this.handleSaveAsScene.bind(this);
	    this.handleExportScene = this.handleExportScene.bind(this);
	  }

	  render() {
	    return React.createElement(MenuItem, {
	      title: _t('Scene'),
	      onClick: this.handleCreateEmptyScene
	    }, React.createElement(MenuItem, {
	      title: _t('Empty Scene'),
	      onClick: this.handleSaveScene
	    }), React.createElement(MenuItem, {
	      title: _t('Save'),
	      onClick: this.handleSaveScene
	    }), React.createElement(MenuItem, {
	      title: _t('Save As'),
	      onClick: this.handleSaveAsScene
	    }), React.createElement(MenuItemSeparator, null), React.createElement(MenuItem, {
	      title: _t('Publish Scene'),
	      onClick: this.handleExportScene
	    }));
	  } // ---------------------------- 新建空场景 ---------------------------------


	  handleCreateEmptyScene() {} // --------------------------- 保存场景 ----------------------------------------


	  handleSaveScene() {
	    // 保存场景
	    var editor = app.editor;
	    var id = editor.sceneID;
	    var sceneName = editor.sceneName;

	    if (id) {
	      // 编辑场景
	      this.commitSave(id, sceneName);
	    } else {
	      // 新建场景
	      app.prompt({
	        title: _t('Save Scene'),
	        content: _t('Name'),
	        value: _t('New Scene'),
	        onOK: name => {
	          this.commitSave(id, name);
	        }
	      });
	    }
	  }

	  commitSave(id, sceneName) {
	    var editor = app.editor; // 记录选中物体，以便载入时还原场景选中

	    var selected = app.editor.selected;

	    if (selected) {
	      app.options.selected = selected.uuid;
	    }

	    var obj = new Converter().toJSON({
	      options: app.options,
	      camera: editor.camera,
	      renderer: editor.renderer,
	      scripts: editor.scripts,
	      animations: editor.animations,
	      scene: editor.scene,
	      visual: editor.visual
	    });
	    var params = {
	      Name: sceneName,
	      Data: JSON.stringify(obj)
	    };

	    if (id) {
	      params.ID = id;
	    }

	    Ajax.post(`${app.options.server}/api/Scene/Save`, params, result => {
	      var obj = JSON.parse(result);

	      if (obj.Code === 200) {
	        editor.sceneID = obj.ID;
	        editor.sceneName = sceneName;
	        document.title = sceneName;
	      }

	      app.call(`sceneSaved`, this);
	      app.toast(obj.Msg);
	    });
	  } // --------------------------- 另存为场景 -------------------------------------


	  handleSaveAsScene() {
	    var sceneName = app.editor.sceneName;

	    if (sceneName == null) {
	      sceneName = _t('New Scene');
	    }

	    app.prompt({
	      title: _t('Save Scene'),
	      content: _t('Name'),
	      value: sceneName,
	      onOK: name => {
	        app.editor.sceneName = name;
	        document.title = name;
	        this.commitSaveAs(name);
	      }
	    });
	  }

	  commitSaveAs(sceneName) {
	    var editor = app.editor;
	    var obj = new Converter().toJSON({
	      options: app.options,
	      camera: editor.camera,
	      renderer: editor.renderer,
	      scripts: editor.scripts,
	      animations: editor.animations,
	      scene: editor.scene,
	      visual: editor.visual
	    });
	    Ajax.post(`${app.options.server}/api/Scene/Save`, {
	      Name: sceneName,
	      Data: JSON.stringify(obj)
	    }, result => {
	      var obj = JSON.parse(result);

	      if (obj.Code === 200) {
	        editor.sceneID = obj.ID;
	        editor.sceneName = sceneName;
	        document.title = sceneName;
	      }

	      app.call(`sceneSaved`, this);
	      app.toast(obj.Msg);
	    });
	  } // -------------------------- 导出场景 --------------------------------


	  handleExportScene() {
	    var sceneID = app.editor.sceneID;

	    if (!sceneID) {
	      app.toast(_t('Please open scene first.'));
	      return;
	    }

	    app.confirm({
	      title: _t('Query'),
	      content: _t('Are you sure to export the current scene?'),
	      onOK: () => {
	        app.mask(_t('Exporting...'));
	        fetch(`${app.options.server}/api/ExportScene/Run?ID=${sceneID}`, {
	          method: 'POST'
	        }).then(response => {
	          if (response.ok) {
	            response.json().then(json => {
	              app.unmask();
	              app.toast(json.Msg);
	              window.open(`${app.options.server}${json.Url}`, 'export');
	            });
	          }
	        });
	      }
	    });
	  }

	}

	/**
	 * 编辑菜单
	 * @author tengge / https://github.com/tengge1
	 */

	class EditMenu extends React.Component {
	  constructor(props) {
	    super(props);
	    this.state = {
	      enableUndo: false,
	      enableRedo: false,
	      enableClearHistory: false,
	      enableClone: false,
	      enableDelete: false
	    };
	    this.handleUndo = this.handleUndo.bind(this);
	    this.handleRedo = this.handleRedo.bind(this);
	    this.handleClearHistory = this.handleClearHistory.bind(this);
	    this.handleClone = this.handleClone.bind(this);
	    this.handleDelete = this.handleDelete.bind(this);
	    this.onHistoryChanged = this.onHistoryChanged.bind(this);
	    this.onObjectSelected = this.onObjectSelected.bind(this);
	  }

	  render() {
	    const {
	      enableUndo,
	      enableRedo,
	      enableClearHistory,
	      enableClone,
	      enableDelete
	    } = this.state;
	    return React.createElement(MenuItem, {
	      title: _t('Edit')
	    }, React.createElement(MenuItem, {
	      title: `${_t('Undo')}(Ctrl+Z)`,
	      disabled: !enableUndo,
	      onClick: this.handleUndo
	    }), React.createElement(MenuItem, {
	      title: `${_t('Redo')}(Ctrl+Y)`,
	      disabled: !enableRedo,
	      onClick: this.handleRedo
	    }), React.createElement(MenuItem, {
	      title: _t('Clear History'),
	      disabled: !enableClearHistory,
	      onClick: this.handleClearHistory
	    }), React.createElement(MenuItemSeparator, null), React.createElement(MenuItem, {
	      title: _t('Clone'),
	      disabled: !enableClone,
	      onClick: this.handleClone
	    }), React.createElement(MenuItem, {
	      title: `${_t('Delete')}(Del)`,
	      disabled: !enableDelete,
	      onClick: this.handleDelete
	    }));
	  }

	  componentDidMount() {
	    app.on(`historyChanged.EditMenu`, this.onHistoryChanged);
	    app.on(`objectSelected.EditMenu`, this.onObjectSelected);
	  } // --------------------- 撤销 --------------------------


	  handleUndo() {
	    var history = app.editor.history;

	    if (history.undos.length === 0) {
	      return;
	    }

	    app.editor.undo();
	  } // --------------------- 重做 -----------------------------


	  handleRedo() {
	    var history = app.editor.history;

	    if (history.redos.length === 0) {
	      return;
	    }

	    app.editor.redo();
	  } // -------------------- 清空历史记录 --------------------------------


	  handleClearHistory() {
	    var editor = app.editor;
	    var history = editor.history;

	    if (history.undos.length === 0 && history.redos.length === 0) {
	      return;
	    }

	    app.confirm({
	      title: _t('Confirm'),
	      content: _t('Undo/Redo history will be cleared. Are you sure?'),
	      onOK: () => {
	        editor.history.clear();
	      }
	    });
	  } // -------------------------- 复制 -----------------------------------


	  handleClone() {
	    var editor = app.editor;
	    var object = editor.selected;

	    if (object == null || object.parent == null) {
	      // 避免复制场景或相机
	      return;
	    }

	    object = object.clone();
	    editor.execute(new AddObjectCommand(object));
	  } // ----------------------- 删除 -----------------------------------


	  handleDelete() {
	    var editor = app.editor;
	    var object = editor.selected;

	    if (object == null || object.parent == null) {
	      // 避免删除场景或相机
	      return;
	    }

	    app.confirm({
	      title: _t('Confirm'),
	      content: _t('Delete') + ' ' + object.name + '?',
	      onOK: () => {
	        editor.execute(new RemoveObjectCommand(object));
	      }
	    });
	  } // ---------------------- 事件 -----------------------


	  onHistoryChanged() {
	    const history = app.editor.history;
	    this.setState({
	      enableUndo: history.undos.length > 0,
	      enableRedo: history.redos.length > 0,
	      enableClearHistory: history.undos.length > 0 || history.redos.length > 0
	    });
	  }

	  onObjectSelected() {
	    const editor = app.editor;
	    this.setState({
	      enableClone: editor.selected && editor.selected.parent != null,
	      enableDelete: editor.selected && editor.selected.parent != null
	    });
	  }

	}

	/**
	 * 资源菜单
	 * @author tengge / https://github.com/tengge1
	 */

	class AssetsMenu extends React.Component {
	  constructor(props) {
	    super(props);
	  }

	  render() {
	    return React.createElement(MenuItem, {
	      title: _t('Assets')
	    }, React.createElement(MenuItem, {
	      title: _t('Download MNIST Assets'),
	      onClick: this.handleUndo
	    }));
	  } // --------------------- 撤销 --------------------------


	  handleUndo() {}

	}

	/**
	 * 编辑器菜单栏
	 * @author tengge / https://github.com/tengge1
	 */

	class EditorMenuBar extends React.Component {
	  render() {
	    const {
	      className
	    } = this.props;
	    return React.createElement(MenuBar, {
	      className: bind('EditorMenuBar', className)
	    }, React.createElement(SceneMenu, null), React.createElement(EditMenu, null), React.createElement(AssetsMenu, null));
	  }

	}

	/**
	 * 状态栏
	 * @author tengge / https://github.com/tengge1
	 */

	class EditorStatusBar extends React.Component {
	  constructor(props) {
	    super(props);
	  }

	  render() {
	    return React.createElement(Toolbar, {
	      className: 'EditorStatusBar'
	    }, React.createElement(Label, null, _t('Object')));
	  }

	}

	/**
	 * 场景树状图
	 * @author tengge / https://github.com/tengge1
	 */

	class HierarchyPanel extends React.Component {
	  constructor(props) {
	    super(props);
	    this.expanded = {};
	    this.checked = {};
	    this.state = {
	      data: [],
	      selected: null
	    };
	    this.updateUI = this.updateUI.bind(this);
	    this.handleObjectSelected = this.handleObjectSelected.bind(this);
	    this.handleSelect = this.handleSelect.bind(this);
	    this.handleCheck = this.handleCheck.bind(this);
	    this.handleDoubleClick = this.handleDoubleClick.bind(this);
	    this.handleClickVisible = this.handleClickVisible.bind(this);
	    this.handleExpand = this.handleExpand.bind(this);
	    this.handleDrop = this.handleDrop.bind(this);
	  }

	  render() {
	    const {
	      data,
	      selected,
	      checked
	    } = this.state;
	    return React.createElement(Tree, {
	      data: data,
	      selected: selected,
	      checked: checked,
	      onSelect: this.handleSelect,
	      onCheck: this.handleCheck,
	      onDoubleClick: this.handleDoubleClick,
	      onClickIcon: this.handleClickVisible,
	      onExpand: this.handleExpand,
	      onDrop: this.handleDrop
	    });
	  }
	  /**
	   * 单击树节点
	   * @param {*} value 
	   */


	  handleSelect(value) {
	    this.setState({
	      selected: value
	    });
	    app.editor.selectByUuid(value);
	  }

	  handleCheck(value, name, event) {
	    let checked = this.checked;

	    if (value && !checked[name]) {
	      checked[name] = true;
	    } else if (!value && checked[name]) {
	      delete checked[name];
	    } else {
	      console.warn(`HierarchyPanel: handleCheck error.`);
	    }

	    this.updateUI();
	  }

	  handleDoubleClick(value) {}

	  handleClickVisible(value, name, event) {}
	  /**
	   * 选中物体改变
	   * @param {*} object 
	   */


	  handleObjectSelected(object) {}
	  /**
	   * 根据场景变化，更新场景树状图
	   */


	  updateUI() {}
	  /**
	   * 展开关闭节点
	   * @param {*} value 
	   */


	  handleExpand(value) {
	    let expanded = this.expanded;

	    if (expanded[value]) {
	      expanded[value] = false;
	    } else {
	      expanded[value] = true;
	    }

	    this.updateUI();
	  }
	  /**
	   * 拖动节点
	   */


	  handleDrop(value, newParentValue, newBeforeValue) {}

	}

	/**
	 * 历史面板
	 * @author tengge / https://github.com/tengge1
	 */

	class HistoryPanel extends React.Component {
	  constructor(props) {
	    super(props);
	    this.state = {
	      undos: [],
	      redos: []
	    };
	    this.ref = React.createRef();
	    this.update = this.update.bind(this);
	    this.handleClick = this.handleClick.bind(this);
	    this.handleClear = this.handleClear.bind(this);
	  }

	  render() {
	    const {
	      undos,
	      redos
	    } = this.state;
	    return React.createElement("div", {
	      className: 'HistoryPanel'
	    }, React.createElement("div", {
	      className: 'toolbar'
	    }, React.createElement(Button, {
	      onClick: this.handleClear
	    }, _t('Clear'))), React.createElement("div", {
	      className: 'content',
	      ref: this.ref,
	      onClick: this.handleClick
	    }, undos.map(n => {
	      return React.createElement("div", {
	        className: 'undo',
	        value: n.id,
	        key: n.id,
	        onClick: this.handleClick
	      }, n.name);
	    }), redos.map(n => {
	      return React.createElement("div", {
	        className: 'redo',
	        value: n.id,
	        key: n.id,
	        onClick: this.handleClick
	      }, n.name);
	    })));
	  }

	  componentDidUpdate() {
	    let dom = this.ref.current;
	    dom.scrollTop = dom.scrollHeight;
	  }

	  update() {
	    var history = app.editor.history;
	    let undos = [],
	        redos = [];
	    history.undos.forEach(n => {
	      undos.push({
	        id: n.id,
	        name: n.name
	      });
	    });
	    history.redos.forEach(n => {
	      redos.push({
	        id: n.id,
	        name: n.name
	      });
	    });
	    undos.sort((a, b) => {
	      return a.id - b.id;
	    });
	    redos.sort((a, b) => {
	      return a.id - b.id;
	    });
	    this.setState({
	      undos,
	      redos
	    });
	  }

	  handleClick(event) {
	    const id = event.target.getAttribute('value');

	    if (!id) {
	      return;
	    }

	    app.editor.history.goToState(parseInt(id));
	    this.update();
	  }

	  handleClear() {
	    var editor = app.editor;
	    app.confirm({
	      title: _t('Confirm'),
	      content: _t('Undo/Redo history will be cleared. Are you sure?'),
	      onOK: () => {
	        editor.history.clear();
	      }
	    });
	  }

	}

	/**
	 * 基本信息组件
	 * @author tengge / https://github.com/tengge1
	 */

	class BasicComponent extends React.Component {
	  constructor(props) {
	    super(props);
	    this.state = {
	      show: false,
	      expanded: true,
	      name: '',
	      type: '',
	      visible: true
	    };
	    this.handleExpand = this.handleExpand.bind(this);
	    this.handleUpdate = this.handleUpdate.bind(this);
	    this.handleChangeName = this.handleChangeName.bind(this);
	  }

	  render() {
	    const {
	      show,
	      expanded,
	      name,
	      type,
	      visible
	    } = this.state;

	    if (!show) {
	      return null;
	    }

	    return React.createElement(PropertyGroup, {
	      title: _t('Basic Info'),
	      show: show,
	      expanded: expanded,
	      onExpand: this.handleExpand
	    }, React.createElement(TextProperty, {
	      label: _t('Name'),
	      name: 'name',
	      value: name,
	      onChange: this.handleChangeName
	    }), React.createElement(DisplayProperty, {
	      label: _t('Type'),
	      name: 'type',
	      value: type
	    }));
	  }

	  handleExpand(expanded) {
	    this.setState({
	      expanded
	    });
	  }

	  handleUpdate() {
	    const editor = app.editor;

	    if (!editor.selected) {
	      this.setState({
	        show: false
	      });
	      return;
	    }

	    this.selected = editor.selected;
	    this.setState({
	      show: true,
	      name: this.selected.name,
	      type: this.selected.constructor.name,
	      visible: this.selected.visible
	    });
	  }

	  handleChangeName() {}

	}

	/**
	 * 属性面板
	 * @author tengge / https://github.com/tengge1
	 */

	class PropertyPanel extends React.Component {
	  constructor(props) {
	    super(props);
	  }

	  render() {
	    return React.createElement(PropertyGrid, null, React.createElement(BasicComponent, null));
	  }

	}

	/**
	 * 脚本窗口
	 * @author tengge / https://github.com/tengge1
	 */

	class ScriptWindow extends React.Component {
	  constructor(props) {
	    super(props);
	    this.scriptTypes = {
	      'javascript': 'JavaScript',
	      'vertexShader': _t('Vertex Shader'),
	      'fragmentShader': _t('Frag Shader'),
	      'json': _t('Shader Program Info')
	    };
	    this.state = {
	      name: _t('No Name'),
	      type: 'javascript'
	    };
	    this.handleNameChange = this.handleNameChange.bind(this);
	    this.handleTypeChange = this.handleTypeChange.bind(this);
	    this.handleOK = this.handleOK.bind(this);
	    this.handleClose = this.handleClose.bind(this);
	    this.handleSaveScript = this.handleSaveScript.bind(this);
	  }

	  render() {
	    const {
	      name,
	      type
	    } = this.state;
	    return React.createElement(Window, {
	      className: 'ScriptWindow',
	      title: _t('Create Script'),
	      onClose: this.handleClose
	    }, React.createElement(Content, null, React.createElement(Form, null, React.createElement(FormControl, null, React.createElement(Label, null, _t('Name')), React.createElement(Input, {
	      value: name,
	      onChange: this.handleNameChange
	    })), React.createElement(FormControl, null, React.createElement(Label, null, _t('Type')), React.createElement(Select, {
	      options: this.scriptTypes,
	      value: type,
	      disabled: true,
	      onChange: this.handleTypeChange
	    })))), React.createElement(Buttons, null, React.createElement(Button, {
	      onClick: this.handleOK
	    }, _t('OK')), React.createElement(Button, {
	      onClick: this.handleClose
	    }, _t('Cancel'))));
	  }

	  handleNameChange(value) {
	    this.setState({
	      name: value
	    });
	  }

	  handleTypeChange(value) {
	    this.setState({
	      type: value
	    });
	  }

	  handleOK() {
	    const {
	      name,
	      type
	    } = this.state;
	    const uuid = THREE.Math.generateUUID();
	    let source = '';
	    app.editor.scripts[uuid] = {
	      id: null,
	      name,
	      type,
	      source,
	      uuid
	    };
	    app.call(`scriptChanged`, this);
	    this.handleClose();
	    this.setState({
	      show: false,
	      uuid: null,
	      name: '',
	      type: 'javascript',
	      source: ''
	    });
	    app.call(`editScript`, this, uuid, name, type, source, this.handleSaveScript);
	  }

	  handleSaveScript(uuid, name, type, source) {
	    app.editor.scripts[uuid] = {
	      id: null,
	      uuid,
	      name,
	      type,
	      source
	    };
	    app.call(`scriptChanged`, this);
	  }

	  handleClose() {
	    app.removeElement(this);
	  }

	}

	/**
	 * 历史面板
	 * @author tengge / https://github.com/tengge1
	 */

	class ScriptPanel extends React.Component {
	  constructor(props) {
	    super(props);
	    this.state = {
	      scripts: {}
	    };
	    this.handleAddScript = this.handleAddScript.bind(this);
	    this.handleEditScript = this.handleEditScript.bind(this);
	    this.handleSaveScript = this.handleSaveScript.bind(this);
	    this.handleRemoveScript = this.handleRemoveScript.bind(this);
	    this.update = this.update.bind(this);
	  }

	  render() {
	    const scripts = this.state.scripts;
	    return React.createElement("div", {
	      className: 'ScriptPanel'
	    }, React.createElement("div", {
	      className: 'toolbar'
	    }, React.createElement(Button, {
	      onClick: this.handleAddScript
	    }, _t('New Script'))), React.createElement("ul", {
	      className: 'content'
	    }, Object.values(scripts).map(n => {
	      return React.createElement("li", {
	        key: n.uuid
	      }, React.createElement("span", null, `${n.name}.${this.getExtension(n.type)}`), React.createElement(Icon, {
	        name: n.uuid,
	        icon: 'edit',
	        title: _t('Edit Script'),
	        onClick: this.handleEditScript
	      }), React.createElement(Icon, {
	        name: n.uuid,
	        icon: 'delete',
	        title: _t('Delete Script'),
	        onClick: this.handleRemoveScript
	      }));
	    })));
	  }

	  getExtension(type) {
	    let extension = '';

	    switch (type) {
	      case 'javascript':
	        extension = 'js';
	        break;

	      case 'vertexShader':
	        extension = 'glsl';
	        break;

	      case 'fragmentShader':
	        extension = 'glsl';
	        break;

	      case 'json':
	        extension = 'json';
	        break;
	    }

	    return extension;
	  }

	  componentDidMount() {
	    app.on(`scriptChanged.ScriptPanel`, this.update);
	  }

	  update() {
	    this.setState({
	      scripts: app.editor.scripts
	    });
	  }

	  handleAddScript() {
	    const window = app.createElement(ScriptWindow);
	    app.addElement(window);
	  }

	  handleEditScript(uuid) {
	    var script = app.editor.scripts[uuid];

	    if (script) {
	      app.call(`editScript`, this, uuid, script.name, script.type, script.source, this.handleSaveScript);
	    }
	  }

	  handleSaveScript(uuid, name, type, source) {
	    app.editor.scripts[uuid] = {
	      id: null,
	      uuid,
	      name,
	      type,
	      source
	    };
	    app.call(`scriptChanged`, this);
	  }

	  handleRemoveScript(uuid) {
	    const script = app.editor.scripts[uuid];
	    app.confirm({
	      title: _t('Confirm'),
	      content: `${_t('Delete')} ${script.name}.${this.getExtension(script.type)}？`,
	      onOK: () => {
	        delete app.editor.scripts[uuid];
	        app.call('scriptChanged', this);
	      }
	    });
	  }

	}

	/**
	 * 侧边栏
	 * @author tengge / https://github.com/tengge1
	 */

	class EditorSideBar extends React.Component {
	  constructor(props) {
	    super(props);
	    this.state = {
	      topIndex: 0,
	      bottomIndex: 0
	    };
	    this.handleTopTabChange = this.handleTopTabChange.bind(this);
	    this.handleBottomTabChange = this.handleBottomTabChange.bind(this);
	  }

	  render() {
	    const {
	      topIndex,
	      bottomIndex
	    } = this.state;
	    return React.createElement(VBoxLayout, {
	      className: 'EditorSideBar'
	    }, React.createElement(TabLayout, {
	      className: 'top',
	      activeTabIndex: topIndex,
	      onActiveTabChange: this.handleTopTabChange
	    }, React.createElement(HierarchyPanel, {
	      title: _t('Hierachy')
	    }), React.createElement(HistoryPanel, {
	      title: _t('History')
	    })), React.createElement(TabLayout, {
	      className: 'bottom',
	      activeTabIndex: bottomIndex,
	      onActiveTabChange: this.handleBottomTabChange
	    }, React.createElement(PropertyPanel, {
	      title: _t('Property')
	    }), React.createElement(ScriptPanel, {
	      title: _t('Script')
	    })));
	  }

	  handleTopTabChange(index) {
	    this.setState({
	      topIndex: index
	    });
	  }

	  handleBottomTabChange(index) {
	    this.setState({
	      bottomIndex: index
	    });
	  }

	}

	/**
	 * 场景面板
	 * @author tengge / https://github.com/tengge1
	 */

	class ScenePanel extends React.Component {
	  constructor(props) {
	    super(props);
	    this.state = {
	      data: [],
	      categoryData: [],
	      name: '',
	      categories: []
	    };
	  }

	  render() {
	    const {
	      className,
	      style
	    } = this.props;
	    const {
	      data,
	      categoryData,
	      name,
	      categories
	    } = this.state;
	    let list = data;

	    if (name.trim() !== '') {
	      list = list.filter(n => {
	        return n.Name.toLowerCase().indexOf(name.toLowerCase()) > -1 || n.FirstPinYin.toLowerCase().indexOf(name.toLowerCase()) > -1 || n.TotalPinYin.toLowerCase().indexOf(name.toLowerCase()) > -1;
	      });
	    }

	    if (categories.length > 0) {
	      list = list.filter(n => {
	        return categories.indexOf(n.CategoryID) > -1;
	      });
	    }

	    const imageListData = list.map(n => {
	      return Object.assign({}, n, {
	        id: n.ID,
	        src: n.Thumbnail ? `${app.options.server}${n.Thumbnail}` : null,
	        title: n.Name,
	        icon: 'scenes',
	        cornerText: `v${n.Version}`
	      });
	    });
	    return React.createElement("div", {
	      className: bind('ScenePanel', className),
	      style: style
	    });
	  }

	}

	ScenePanel.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  show: propTypes.bool
	};
	ScenePanel.defaultProps = {
	  className: null,
	  style: null,
	  show: false
	};

	/**
	 * 日志面板
	 * @author tengge / https://github.com/tengge1
	 */

	class LogPanel extends React.Component {
	  constructor(props) {
	    super(props);
	    this.state = {
	      logs: []
	    };
	    this.handleLog = this.handleLog.bind(this);
	    this.handleClear = this.handleClear.bind(this);
	  }

	  render() {
	    const {
	      className,
	      style
	    } = this.props;
	    const {
	      logs
	    } = this.state;
	    return React.createElement("div", {
	      className: bind('LogPanel', className),
	      style: style
	    }, React.createElement(Button, {
	      onClick: this.handleClear
	    }, _t('Clear')), React.createElement("div", {
	      className: 'logs'
	    }, logs.map((n, i) => {
	      return React.createElement("div", {
	        className: n.type,
	        key: i
	      }, n.time, " ", n.content);
	    })));
	  }

	  componentDidMount() {
	    app.on(`log.LogPanel`, this.handleLog);
	  }

	  handleLog(content, type) {
	    var date = new Date();
	    var hour = date.getHours();
	    var minute = date.getMinutes();
	    var second = date.getSeconds();
	    hour = hour < 10 ? '0' + hour : hour;
	    minute = minute < 10 ? '0' + minute : minute;
	    second = second < 10 ? '0' + second : second;
	    this.setState(state => {
	      let logs = state.logs;
	      logs.push({
	        time: `${hour}:${minute}:${second}`,
	        type,
	        content
	      });
	      return {
	        logs
	      };
	    });
	  }

	  handleClear() {
	    this.setState({
	      logs: []
	    });
	  }

	}

	LogPanel.propTypes = {
	  className: propTypes.string,
	  style: propTypes.object,
	  show: propTypes.bool
	};
	LogPanel.defaultProps = {
	  className: null,
	  style: null,
	  show: false
	};

	/**
	 * 资源面板
	 * @author tengge / https://github.com/tengge1
	 */

	class AssetsPanel extends React.Component {
	  constructor(props) {
	    super(props);
	    this.state = {
	      activeIndex: 0
	    };
	    this.handleActive = this.handleActive.bind(this);
	  }

	  render() {
	    const {
	      activeIndex
	    } = this.state;
	    return React.createElement(AccordionLayout, {
	      className: 'AssetsPanel',
	      onActive: this.handleActive
	    }, React.createElement(Accordion, {
	      name: 'Scene',
	      title: `${_t('Scene')}`,
	      maximizable: true
	    }, React.createElement(ScenePanel, {
	      className: 'subPanel',
	      show: 0 === activeIndex
	    })), React.createElement(Accordion, {
	      name: 'Log',
	      title: `${_t('Logs')}`,
	      maximizable: true
	    }, React.createElement(LogPanel, {
	      className: 'subPanel',
	      show: 9 === activeIndex
	    })));
	  }

	  handleActive(index, name) {
	    this.setState({
	      activeIndex: index
	    });
	  }

	}

	/**
	 * 编辑器
	 * @author tengge / https://github.com/tengge1
	 */

	class Editor extends React.Component {
	  constructor(props) {
	    super(props);
	    this.state = {
	      showMask: false,
	      maskText: _t('Waiting...'),
	      elements: []
	    };
	    this.type = 'scene'; // 编辑器类型：scene, mesh, texture, material, terrain, ai

	    this.onToggle = this.onToggle.bind(this);
	  }

	  render() {
	    const {
	      showMask,
	      maskText,
	      elements
	    } = this.state;
	    return React.createElement(React.Fragment, null, React.createElement(BorderLayout, {
	      className: 'Editor'
	    }, React.createElement(EditorMenuBar, {
	      region: 'north'
	    }), React.createElement(EditorStatusBar, {
	      region: 'south'
	    }), React.createElement(AssetsPanel, {
	      region: 'west',
	      split: true,
	      onToggle: this.onToggle
	    }), React.createElement(EditorSideBar, {
	      region: 'east',
	      split: true,
	      onToggle: this.onToggle
	    }), React.createElement(BorderLayout, {
	      region: 'center'
	    })), elements.map((n, i) => {
	      return React.createElement("div", {
	        key: i
	      }, n);
	    }), React.createElement(LoadMask, {
	      text: maskText,
	      show: showMask
	    }));
	  } // ---------------------- 用户界面 --------------------------------


	  createElement(type, props = {}, children = undefined) {
	    let ref = React.createRef();
	    props.ref = ref;
	    return React.createElement(type, props, children);
	  }

	  addElement(element, callback) {
	    let elements = this.state.elements;
	    elements.push(element);
	    this.setState({
	      elements
	    }, callback);
	  }

	  removeElement(element, callback) {
	    let elements = this.state.elements;
	    let index = elements.findIndex(n => n === element || n.ref && n.ref.current === element);

	    if (index > -1) {
	      elements.splice(index, 1);
	    }

	    this.setState({
	      elements
	    }, callback);
	  }

	  onToggle(expanded) {
	    app.call('resize', this);
	  }

	  onShowMask(enabled, text) {
	    this.setState({
	      showMask: enabled,
	      maskText: text || _t('Waiting...')
	    });
	  }

	}

	class Application {
	  constructor(container, options) {
	    this.container = container;
	    window.app = this; // 配置

	    this.options = new Options(options); // 事件

	    this.event = new EventDispatcher(this);
	    this.call = this.event.call.bind(this.event);
	    this.on = this.event.on.bind(this.event); // 加载语言包

	    const loader = new LanguageLoader();
	    loader.load().then(() => {
	      this.ui = React.createElement(Editor);
	      ReactDOM.render(this.ui, this.container);
	      this.start();
	    });
	  }

	  start() {
	    this.event.start();
	  }

	}

	exports.Application = Application;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
