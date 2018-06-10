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
	    this.mongoConnection = 'mongodb://localhost:27017/';
	    this.mongoDbName = 'ShadowEditor';
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

	/**
	 * MongoHelper
	 */

	var MongoHelper = function () {
	    function MongoHelper() {
	        classCallCheck(this, MongoHelper);

	        this.connectionString = Config.mongoConnection;
	        this.dbName = Config.mongoDbName;
	        this.client = require('mongodb').MongoClient;
	    }

	    /**
	     * 内部调用，创建mongoDB链接
	     */


	    createClass(MongoHelper, [{
	        key: '_connect',
	        value: function _connect() {
	            var _this = this;

	            return new Promise(function (resolve, reject) {
	                _this.client.connect(_this.connectionString, function (err, db) {
	                    if (err) {
	                        console.log(err);
	                        throw err;
	                    }
	                    resolve(db);
	                });
	            });
	        }

	        /**
	         * 创建数据集
	         * @param {*} collectionName 数据集名称
	         */

	    }, {
	        key: 'createCollection',
	        value: function createCollection(collectionName) {
	            var _this2 = this;

	            return new Promise(function (resolve, reject) {
	                _this2._connect().then(function (db) {
	                    db.db(_this2.dbName).createCollection(collectionName, function (err, res) {
	                        if (err) {
	                            console.log(err);
	                            throw err;
	                        }
	                        db.close();
	                        resolve();
	                    });
	                });
	            });
	        }

	        /**
	         * 插入一条数据
	         * @param {*} collectionName 数据集名称
	         * @param {*} obj 可序列化对象
	         */

	    }, {
	        key: 'insertOne',
	        value: function insertOne(collectionName, obj) {
	            var _this3 = this;

	            return new Promise(function (resolve, reject) {
	                _this3._connect().then(function (db) {
	                    db.db(_this3.dbName).collection(collectionName).insertOne(obj, function (err, res) {
	                        if (err) {
	                            console.log(err);
	                            throw err;
	                        }                        db.close();
	                        resolve();
	                    });
	                });
	            });
	        }

	        /**
	         * 插入多条数据
	         * @param {*} collectionName 数据集名称
	         * @param {*} list 可序列话对象列表
	         */

	    }, {
	        key: 'insertMany',
	        value: function insertMany(collectionName, list) {
	            var _this4 = this;

	            return new Promise(function (resolve, reject) {
	                _this4._connect().then(function (db) {
	                    db.db(_this4.dbName).collection(collectionName).insertMany(list, function (err, res) {
	                        if (err) {
	                            console.log(err);
	                            throw err;
	                        }                        db.close();
	                        resolve();
	                    });
	                });
	            });
	        }

	        /**
	         * 根据条件查询数据
	         * @param {*} collectionName 数据集名称
	         * @param {*} query 查询条件，例如：{ name: 'user' }
	         */

	    }, {
	        key: 'find',
	        value: function find(collectionName) {
	            var _this5 = this;

	            var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	            return new Promise(function (resolve, reject) {
	                _this5._connect().then(function (db) {
	                    db.db(_this5.dbName).collection(collectionName).find(query).toArray(function (err, result) {
	                        if (err) {
	                            console.log(err);
	                            throw err;
	                        }
	                        db.close();
	                        resolve(result);
	                    });
	                });
	            });
	        }

	        /**
	         * 更新一条数据
	         * @param {*} collectionName 数据集名称
	         * @param {*} query 查询条件，例如：{ 'name': '菜鸟教程' }
	         * @param {*} update 更新内容，例如：{ $set: { 'url': 'http://www.runoob.com' } }
	         */

	    }, {
	        key: 'updateOne',
	        value: function updateOne(collectionName, query, update) {
	            var _this6 = this;

	            return new Promise(function (resolve, reject) {
	                _this6._connect().then(function (db) {
	                    db.db(_this6.dbName).collection(collectionName).updateOne(query, update, function (err, res) {
	                        if (err) {
	                            console.log(err);
	                            throw err;
	                        }                        db.close();
	                        resolve(res);
	                    });
	                });
	            });
	        }

	        /**
	         * 更新多条数据
	         * @param {*} collectionName 数据集名称
	         * @param {*} query 查询条件，例如：{ 'name': '菜鸟教程' }
	         * @param {*} updates 更新内容，例如：{ $set: { 'url': 'http://www.runoob.com' } }
	         */

	    }, {
	        key: 'updateMany',
	        value: function updateMany(collectionName, query, updates) {
	            var _this7 = this;

	            return new Promise(function (resolve, reject) {
	                _this7._connect().then(function (db) {
	                    db.db(_this7.dbName).collection(collectionName).updateMany(query, updates, function (err, res) {
	                        if (err) {
	                            console.log(err);
	                            throw err;
	                        }                        db.close();
	                        resolve(res);
	                    });
	                });
	            });
	        }

	        /**
	         * 删除一条数据
	         * @param {*} collectionName 数据集名称
	         * @param {*} query 条件
	         */

	    }, {
	        key: 'deleteOne',
	        value: function deleteOne(collectionName) {
	            var _this8 = this;

	            var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	            return new Promise(function (resolve, reject) {
	                _this8._connect().then(function (db) {
	                    db.db(_this8.dbName).collection(collectionName).deleteOne(query, function (err, res) {
	                        if (err) {
	                            console.log(err);
	                            throw err;
	                        }                        db.close();
	                        resolve(res);
	                    });
	                });
	            });
	        }

	        /**
	         * 删除多条数据
	         * @param {*} collectionName 数据集名称
	         * @param {*} query 条件
	         */

	    }, {
	        key: 'deleteMany',
	        value: function deleteMany(collectionName) {
	            var _this9 = this;

	            var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	            return new Promise(function (resolve, reject) {
	                _this9._connect().then(function (db) {
	                    db.db(_this9.dbName).collection(collectionName).deleteMany(query, function (err, res) {
	                        if (err) {
	                            console.log(err);
	                            throw err;
	                        }                        db.close();
	                        resolve(res);
	                    });
	                });
	            });
	        }

	        /**
	         * 删除数据集
	         * @param {*} collectionName 数据集名称
	         */

	    }, {
	        key: 'drop',
	        value: function drop(collectionName) {
	            var _this10 = this;

	            return new Promise(function (resolve, reject) {
	                _this10._connect().then(function (db) {
	                    db.db(_this10.dbName).collection(collectionName).drop(function (err, res) {
	                        if (err) {
	                            console.log(err);
	                            throw err;
	                        }                        db.close();
	                        resolve(res);
	                    });
	                });
	            });
	        }
	    }]);
	    return MongoHelper;
	}();

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
	            var _this = this;

	            require('http').createServer(function (req, res) {
	                _this.service.handle(req, res);
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

	exports.Config = Config;
	exports.ShadowServer = ShadowServer;
	exports.MongoHelper = MongoHelper;
	exports.BaseService = BaseService;
	exports.SceneService = SceneService;
	exports.TextureService = TextureService;
	exports.ServiceDispatcher = ServiceDispatcher;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
