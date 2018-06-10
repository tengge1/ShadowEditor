(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.SS = {})));
}(this, (function (exports) { 'use strict';

	/**
	 * Config
	 */
	var Config = new function () {
	    // ShadowServer服务器配置
	    this.serverIP = 'localhost';
	    this.serverPort = 1337;

	    // MongoDB配置
	    this.mongoConnection = 'mongodb://localhost:27017/ShadowEditor';
	}();

	var classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	var createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

	var inherits = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};

	var possibleConstructorReturn = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && (typeof call === "object" || typeof call === "function") ? call : self;
	};

	var ID = -1;

	/**
	 * BaseService
	 */

	var BaseService = function () {
	    function BaseService() {
	        classCallCheck(this, BaseService);

	        this.id = 'BaseService' + ID--;
	    }

	    createClass(BaseService, [{
	        key: 'handle',
	        value: function handle(req, res) {
	            throw 'BaseService: request method is not implemented.';
	        }
	    }]);
	    return BaseService;
	}();

	/**
	 * SceneService
	 */

	var SceneService = function (_BaseService) {
	    inherits(SceneService, _BaseService);

	    function SceneService() {
	        classCallCheck(this, SceneService);
	        return possibleConstructorReturn(this, (SceneService.__proto__ || Object.getPrototypeOf(SceneService)).apply(this, arguments));
	    }

	    createClass(SceneService, [{
	        key: 'handle',
	        value: function handle(req, res) {}
	    }]);
	    return SceneService;
	}(BaseService);

	/**
	 * TextureService
	 */

	var TextureService = function (_BaseService) {
	    inherits(TextureService, _BaseService);

	    function TextureService() {
	        classCallCheck(this, TextureService);
	        return possibleConstructorReturn(this, (TextureService.__proto__ || Object.getPrototypeOf(TextureService)).apply(this, arguments));
	    }

	    createClass(TextureService, [{
	        key: 'handle',
	        value: function handle(req, res) {}
	    }]);
	    return TextureService;
	}(BaseService);

	/**
	 * ServiceDispatcher
	 */

	var ServiceDispatcher = function (_BaseService) {
	    inherits(ServiceDispatcher, _BaseService);

	    function ServiceDispatcher() {
	        classCallCheck(this, ServiceDispatcher);
	        return possibleConstructorReturn(this, (ServiceDispatcher.__proto__ || Object.getPrototypeOf(ServiceDispatcher)).apply(this, arguments));
	    }

	    createClass(ServiceDispatcher, [{
	        key: 'handle',
	        value: function handle(req, res) {
	            var url = require('url').parse(req);
	        }
	    }]);
	    return ServiceDispatcher;
	}(BaseService);

	/**
	 * ShadowServer
	 */

	var ShadowServer = function () {
	    function ShadowServer() {
	        classCallCheck(this, ShadowServer);

	        this.service = new ServiceDispatcher(this);
	    }

	    createClass(ShadowServer, [{
	        key: 'start',
	        value: function start() {
	            require('http').createServer(function (req, res) {
	                setTimeout(function () {
	                    res.writeHead(200, {
	                        'Content-Type': 'text/plain'
	                    });
	                    res.end('Hello World\n');
	                }, 2000);
	                //this.service.handle(req, res);
	                // res.writeHead(200, {
	                //     'Content-Type': 'text/plain'
	                // });
	                // res.end('Hello World\n');
	            }).listen(Config.serverPort, Config.serverIP);

	            console.log('Server running at http://' + Config.serverIP + ':' + Config.serverPort + '/');
	        }
	    }]);
	    return ShadowServer;
	}();

	new ShadowServer().start();

	exports.ShadowServer = ShadowServer;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
