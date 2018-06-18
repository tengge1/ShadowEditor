(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Shadow = {})));
}(this, (function (exports) { 'use strict';

	/**
	* @author dforrer / https://github.com/dforrer
	* Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
	*/

	/**
	 * @param editorRef pointer to main editor object used to initialize
	 *        each command object with a reference to the editor
	 * @constructor
	 */

	function Command(editorRef) {

	    this.id = -1;
	    this.inMemory = false;
	    this.updatable = false;
	    this.type = '';
	    this.name = '';

	    if (editorRef !== undefined) {

	        Command.editor = editorRef;
	    }
	    this.editor = Command.editor;
	}
	Command.prototype.toJSON = function () {

	    var output = {};
	    output.type = this.type;
	    output.id = this.id;
	    output.name = this.name;
	    return output;
	};

	Command.prototype.fromJSON = function (json) {

	    this.inMemory = true;
	    this.type = json.type;
	    this.id = json.id;
	    this.name = json.name;
	};

	/**
	 * @author dforrer / https://github.com/dforrer
	 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
	 */

	function History(editor) {

	        this.editor = editor;
	        this.undos = [];
	        this.redos = [];
	        this.lastCmdTime = new Date();
	        this.idCounter = 0;

	        this.historyDisabled = false;
	        this.config = editor.config;

	        //Set editor-reference in Command

	        Command.call(this, editor);

	        // signals

	        var scope = this;

	        this.editor.signals.startPlayer.add(function () {

	                scope.historyDisabled = true;
	        });

	        this.editor.signals.stopPlayer.add(function () {

	                scope.historyDisabled = false;
	        });
	}
	History.prototype = Object.create(Command.prototype);

	Object.assign(History.prototype, {

	        constructor: History,

	        execute: function execute(cmd, optionalName) {

	                var lastCmd = this.undos[this.undos.length - 1];
	                var timeDifference = new Date().getTime() - this.lastCmdTime.getTime();

	                var isUpdatableCmd = lastCmd && lastCmd.updatable && cmd.updatable && lastCmd.object === cmd.object && lastCmd.type === cmd.type && lastCmd.script === cmd.script && lastCmd.attributeName === cmd.attributeName;

	                if (isUpdatableCmd && cmd.type === "SetScriptValueCommand") {

	                        // When the cmd.type is "SetScriptValueCommand" the timeDifference is ignored

	                        lastCmd.update(cmd);
	                        cmd = lastCmd;
	                } else if (isUpdatableCmd && timeDifference < 500) {

	                        lastCmd.update(cmd);
	                        cmd = lastCmd;
	                } else {

	                        // the command is not updatable and is added as a new part of the history

	                        this.undos.push(cmd);
	                        cmd.id = ++this.idCounter;
	                }
	                cmd.name = optionalName !== undefined ? optionalName : cmd.name;
	                cmd.execute();
	                cmd.inMemory = true;

	                if (this.config.getKey('settings/history')) {

	                        cmd.json = cmd.toJSON(); // serialize the cmd immediately after execution and append the json to the cmd
	                }
	                this.lastCmdTime = new Date();

	                // clearing all the redo-commands

	                this.redos = [];
	                this.editor.signals.historyChanged.dispatch(cmd);
	        },

	        undo: function undo() {

	                if (this.historyDisabled) {

	                        alert("场景启动时撤销/重做将被禁用。");
	                        return;
	                }

	                var cmd = undefined;

	                if (this.undos.length > 0) {

	                        cmd = this.undos.pop();

	                        if (cmd.inMemory === false) {

	                                cmd.fromJSON(cmd.json);
	                        }
	                }

	                if (cmd !== undefined) {

	                        cmd.undo();
	                        this.redos.push(cmd);
	                        this.editor.signals.historyChanged.dispatch(cmd);
	                }

	                return cmd;
	        },

	        redo: function redo() {

	                if (this.historyDisabled) {

	                        alert("场景启动时撤销/重做将被禁用。");
	                        return;
	                }

	                var cmd = undefined;

	                if (this.redos.length > 0) {

	                        cmd = this.redos.pop();

	                        if (cmd.inMemory === false) {

	                                cmd.fromJSON(cmd.json);
	                        }
	                }

	                if (cmd !== undefined) {

	                        cmd.execute();
	                        this.undos.push(cmd);
	                        this.editor.signals.historyChanged.dispatch(cmd);
	                }

	                return cmd;
	        },

	        toJSON: function toJSON() {

	                var history = {};
	                history.undos = [];
	                history.redos = [];

	                if (!this.config.getKey('settings/history')) {

	                        return history;
	                }

	                // Append Undos to History

	                for (var i = 0; i < this.undos.length; i++) {

	                        if (this.undos[i].hasOwnProperty("json")) {

	                                history.undos.push(this.undos[i].json);
	                        }
	                }

	                // Append Redos to History

	                for (var i = 0; i < this.redos.length; i++) {

	                        if (this.redos[i].hasOwnProperty("json")) {

	                                history.redos.push(this.redos[i].json);
	                        }
	                }

	                return history;
	        },

	        fromJSON: function fromJSON(json) {

	                if (json === undefined) return;

	                for (var i = 0; i < json.undos.length; i++) {

	                        var cmdJSON = json.undos[i];
	                        var cmd = new window[cmdJSON.type](); // creates a new object of type "json.type"
	                        cmd.json = cmdJSON;
	                        cmd.id = cmdJSON.id;
	                        cmd.name = cmdJSON.name;
	                        this.undos.push(cmd);
	                        this.idCounter = cmdJSON.id > this.idCounter ? cmdJSON.id : this.idCounter; // set last used idCounter
	                }

	                for (var i = 0; i < json.redos.length; i++) {

	                        var cmdJSON = json.redos[i];
	                        var cmd = new window[cmdJSON.type](); // creates a new object of type "json.type"
	                        cmd.json = cmdJSON;
	                        cmd.id = cmdJSON.id;
	                        cmd.name = cmdJSON.name;
	                        this.redos.push(cmd);
	                        this.idCounter = cmdJSON.id > this.idCounter ? cmdJSON.id : this.idCounter; // set last used idCounter
	                }

	                // Select the last executed undo-command
	                this.editor.signals.historyChanged.dispatch(this.undos[this.undos.length - 1]);
	        },

	        clear: function clear() {

	                this.undos = [];
	                this.redos = [];
	                this.idCounter = 0;

	                this.editor.signals.historyChanged.dispatch();
	        },

	        goToState: function goToState(id) {

	                if (this.historyDisabled) {

	                        alert("场景启动时撤销/重做将被禁用。");
	                        return;
	                }

	                this.editor.signals.sceneGraphChanged.active = false;
	                this.editor.signals.historyChanged.active = false;

	                var cmd = this.undos.length > 0 ? this.undos[this.undos.length - 1] : undefined; // next cmd to pop

	                if (cmd === undefined || id > cmd.id) {

	                        cmd = this.redo();
	                        while (cmd !== undefined && id > cmd.id) {

	                                cmd = this.redo();
	                        }
	                } else {

	                        while (true) {

	                                cmd = this.undos[this.undos.length - 1]; // next cmd to pop

	                                if (cmd === undefined || id === cmd.id) break;

	                                cmd = this.undo();
	                        }
	                }

	                this.editor.signals.sceneGraphChanged.active = true;
	                this.editor.signals.historyChanged.active = true;

	                this.editor.signals.sceneGraphChanged.dispatch();
	                this.editor.signals.historyChanged.dispatch(cmd);
	        },

	        enableSerialization: function enableSerialization(id) {

	                /**
	                * because there might be commands in this.undos and this.redos
	                * which have not been serialized with .toJSON() we go back
	                * to the oldest command and redo one command after the other
	                * while also calling .toJSON() on them.
	                */

	                this.goToState(-1);

	                this.editor.signals.sceneGraphChanged.active = false;
	                this.editor.signals.historyChanged.active = false;

	                var cmd = this.redo();
	                while (cmd !== undefined) {

	                        if (!cmd.hasOwnProperty("json")) {

	                                cmd.json = cmd.toJSON();
	                        }
	                        cmd = this.redo();
	                }

	                this.editor.signals.sceneGraphChanged.active = true;
	                this.editor.signals.historyChanged.active = true;

	                this.goToState(id);
	        }

	});

	/**
	* @author mrdoob / http://mrdoob.com/
	*/

	function Storage() {

	            var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

	            if (indexedDB === undefined) {

	                        console.warn('Storage: IndexedDB不可用。');
	                        return { init: function init() {}, get: function get() {}, set: function set() {}, clear: function clear() {} };
	            }

	            var name = 'threejs-editor';
	            var version = 1;

	            var database;

	            return {

	                        init: function init(callback) {

	                                    var request = indexedDB.open(name, version);
	                                    request.onupgradeneeded = function (event) {

	                                                var db = event.target.result;

	                                                if (db.objectStoreNames.contains('states') === false) {

	                                                            db.createObjectStore('states');
	                                                }
	                                    };
	                                    request.onsuccess = function (event) {

	                                                database = event.target.result;

	                                                callback();
	                                    };
	                                    request.onerror = function (event) {

	                                                console.error('IndexedDB', event);
	                                    };
	                        },

	                        get: function get(callback) {

	                                    var transaction = database.transaction(['states'], 'readwrite');
	                                    var objectStore = transaction.objectStore('states');
	                                    var request = objectStore.get(0);
	                                    request.onsuccess = function (event) {

	                                                callback(event.target.result);
	                                    };
	                        },

	                        set: function set(data, callback) {

	                                    var start = performance.now();

	                                    var transaction = database.transaction(['states'], 'readwrite');
	                                    var objectStore = transaction.objectStore('states');
	                                    var request = objectStore.put(data, 0);
	                                    request.onsuccess = function (event) {

	                                                console.log('[' + /\d\d\:\d\d\:\d\d/.exec(new Date())[0] + ']', '保存到IndexedDB中。 ' + (performance.now() - start).toFixed(2) + 'ms');
	                                    };
	                        },

	                        clear: function clear() {

	                                    if (database === undefined) return;

	                                    var transaction = database.transaction(['states'], 'readwrite');
	                                    var objectStore = transaction.objectStore('states');
	                                    var request = objectStore.clear();
	                                    request.onsuccess = function (event) {

	                                                console.log('[' + /\d\d\:\d\d\:\d\d/.exec(new Date())[0] + ']', '清空IndexedDB。');
	                                    };
	                        }

	            };
	}

	/**
	 * @author dforrer / https://github.com/dforrer
	 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
	 */

	/**
	 * @param object THREE.Object3D
	 * @constructor
	 */

	function AddObjectCommand$1(object) {

		Command.call(this);

		this.type = 'AddObjectCommand';

		this.object = object;
		if (object !== undefined) {

			this.name = 'Add Object: ' + object.name;
		}
	}
	AddObjectCommand$1.prototype = Object.create(Command.prototype);

	Object.assign(AddObjectCommand$1.prototype, {

		constructor: AddObjectCommand$1,

		execute: function execute() {

			this.editor.addObject(this.object);
			this.editor.select(this.object);
		},

		undo: function undo() {

			this.editor.removeObject(this.object);
			this.editor.deselect();
		},

		toJSON: function toJSON() {

			var output = Command.prototype.toJSON.call(this);
			output.object = this.object.toJSON();

			return output;
		},

		fromJSON: function fromJSON(json) {

			Command.prototype.fromJSON.call(this, json);

			this.object = this.editor.objectByUuid(json.object.object.uuid);

			if (this.object === undefined) {

				var loader = new THREE.ObjectLoader();
				this.object = loader.parse(json.object);
			}
		}

	});

	/**
	 * @author dforrer / https://github.com/dforrer
	 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
	 */

	/**
	 * @param scene containing children to import
	 * @constructor
	 */

	function SetSceneCommand(scene) {

			Command.call(this);

			this.type = 'SetSceneCommand';
			this.name = 'Set Scene';

			this.cmdArray = [];

			if (scene !== undefined) {

					this.cmdArray.push(new SetUuidCommand(this.editor.scene, scene.uuid));
					this.cmdArray.push(new SetValueCommand(this.editor.scene, 'name', scene.name));
					this.cmdArray.push(new SetValueCommand(this.editor.scene, 'userData', JSON.parse(JSON.stringify(scene.userData))));

					while (scene.children.length > 0) {

							var child = scene.children.pop();
							this.cmdArray.push(new AddObjectCommand(child));
					}
			}
	}
	SetSceneCommand.prototype = Object.create(Command.prototype);

	Object.assign(SetSceneCommand.prototype, {

			constructor: SetSceneCommand,

			execute: function execute() {

					this.editor.signals.sceneGraphChanged.active = false;

					for (var i = 0; i < this.cmdArray.length; i++) {

							this.cmdArray[i].execute();
					}

					this.editor.signals.sceneGraphChanged.active = true;
					this.editor.signals.sceneGraphChanged.dispatch();
			},

			undo: function undo() {

					this.editor.signals.sceneGraphChanged.active = false;

					for (var i = this.cmdArray.length - 1; i >= 0; i--) {

							this.cmdArray[i].undo();
					}

					this.editor.signals.sceneGraphChanged.active = true;
					this.editor.signals.sceneGraphChanged.dispatch();
			},

			toJSON: function toJSON() {

					var output = Command.prototype.toJSON.call(this);

					var cmds = [];
					for (var i = 0; i < this.cmdArray.length; i++) {

							cmds.push(this.cmdArray[i].toJSON());
					}
					output.cmds = cmds;

					return output;
			},

			fromJSON: function fromJSON(json) {

					Command.prototype.fromJSON.call(this, json);

					var cmds = json.cmds;
					for (var i = 0; i < cmds.length; i++) {

							var cmd = new window[cmds[i].type](); // creates a new object of type "json.type"
							cmd.fromJSON(cmds[i]);
							this.cmdArray.push(cmd);
					}
			}

	});

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	function Loader(editor) {

	                var scope = this;
	                var signals = editor.signals;

	                this.texturePath = '';

	                this.loadFile = function (file) {

	                                var filename = file.name;
	                                var extension = filename.split('.').pop().toLowerCase();

	                                var reader = new FileReader();
	                                reader.addEventListener('progress', function (event) {

	                                                var size = '(' + Math.floor(event.total / 1000).format() + ' KB)';
	                                                var progress = Math.floor(event.loaded / event.total * 100) + '%';
	                                                console.log('加载中', filename, size, progress);
	                                });

	                                switch (extension) {

	                                                case 'amf':

	                                                                reader.addEventListener('load', function (event) {

	                                                                                var loader = new THREE.AMFLoader();
	                                                                                var amfobject = loader.parse(event.target.result);

	                                                                                editor.execute(new AddObjectCommand$1(amfobject));
	                                                                }, false);
	                                                                reader.readAsArrayBuffer(file);

	                                                                break;

	                                                case 'awd':

	                                                                reader.addEventListener('load', function (event) {

	                                                                                var loader = new THREE.AWDLoader();
	                                                                                var scene = loader.parse(event.target.result);

	                                                                                editor.execute(new SetSceneCommand(scene));
	                                                                }, false);
	                                                                reader.readAsArrayBuffer(file);

	                                                                break;

	                                                case 'babylon':

	                                                                reader.addEventListener('load', function (event) {

	                                                                                var contents = event.target.result;
	                                                                                var json = JSON.parse(contents);

	                                                                                var loader = new THREE.BabylonLoader();
	                                                                                var scene = loader.parse(json);

	                                                                                editor.execute(new SetSceneCommand(scene));
	                                                                }, false);
	                                                                reader.readAsText(file);

	                                                                break;

	                                                case 'babylonmeshdata':

	                                                                reader.addEventListener('load', function (event) {

	                                                                                var contents = event.target.result;
	                                                                                var json = JSON.parse(contents);

	                                                                                var loader = new THREE.BabylonLoader();

	                                                                                var geometry = loader.parseGeometry(json);
	                                                                                var material = new THREE.MeshStandardMaterial();

	                                                                                var mesh = new THREE.Mesh(geometry, material);
	                                                                                mesh.name = filename;

	                                                                                editor.execute(new AddObjectCommand$1(mesh));
	                                                                }, false);
	                                                                reader.readAsText(file);

	                                                                break;

	                                                case 'ctm':

	                                                                reader.addEventListener('load', function (event) {

	                                                                                var data = new Uint8Array(event.target.result);

	                                                                                var stream = new CTM.Stream(data);
	                                                                                stream.offset = 0;

	                                                                                var loader = new THREE.CTMLoader();
	                                                                                loader.createModel(new CTM.File(stream), function (geometry) {

	                                                                                                geometry.sourceType = "ctm";
	                                                                                                geometry.sourceFile = file.name;

	                                                                                                var material = new THREE.MeshStandardMaterial();

	                                                                                                var mesh = new THREE.Mesh(geometry, material);
	                                                                                                mesh.name = filename;

	                                                                                                editor.execute(new AddObjectCommand$1(mesh));
	                                                                                });
	                                                                }, false);
	                                                                reader.readAsArrayBuffer(file);

	                                                                break;

	                                                case 'dae':

	                                                                reader.addEventListener('load', function (event) {

	                                                                                var contents = event.target.result;

	                                                                                var loader = new THREE.ColladaLoader();
	                                                                                var collada = loader.parse(contents);

	                                                                                collada.scene.name = filename;

	                                                                                editor.execute(new AddObjectCommand$1(collada.scene));
	                                                                }, false);
	                                                                reader.readAsText(file);

	                                                                break;

	                                                case 'fbx':

	                                                                reader.addEventListener('load', function (event) {

	                                                                                var contents = event.target.result;

	                                                                                var loader = new THREE.FBXLoader();
	                                                                                var object = loader.parse(contents);

	                                                                                editor.execute(new AddObjectCommand$1(object));
	                                                                }, false);
	                                                                reader.readAsText(file);

	                                                                break;

	                                                case 'glb':
	                                                case 'gltf':

	                                                                reader.addEventListener('load', function (event) {

	                                                                                var contents = event.target.result;

	                                                                                var loader = new THREE.GLTFLoader();
	                                                                                loader.parse(contents, function (result) {

	                                                                                                result.scene.name = filename;
	                                                                                                editor.execute(new AddObjectCommand$1(result.scene));
	                                                                                });
	                                                                }, false);
	                                                                reader.readAsArrayBuffer(file);

	                                                                break;

	                                                case 'js':
	                                                case 'json':

	                                                case '3geo':
	                                                case '3mat':
	                                                case '3obj':
	                                                case '3scn':

	                                                                reader.addEventListener('load', function (event) {

	                                                                                var contents = event.target.result;

	                                                                                // 2.0

	                                                                                if (contents.indexOf('postMessage') !== -1) {

	                                                                                                var blob = new Blob([contents], { type: 'text/javascript' });
	                                                                                                var url = URL.createObjectURL(blob);

	                                                                                                var worker = new Worker(url);

	                                                                                                worker.onmessage = function (event) {

	                                                                                                                event.data.metadata = { version: 2 };
	                                                                                                                handleJSON(event.data, file, filename);
	                                                                                                };

	                                                                                                worker.postMessage(Date.now());

	                                                                                                return;
	                                                                                }

	                                                                                // >= 3.0

	                                                                                var data;

	                                                                                try {

	                                                                                                data = JSON.parse(contents);
	                                                                                } catch (error) {

	                                                                                                alert(error);
	                                                                                                return;
	                                                                                }

	                                                                                handleJSON(data, file, filename);
	                                                                }, false);
	                                                                reader.readAsText(file);

	                                                                break;

	                                                case 'kmz':

	                                                                reader.addEventListener('load', function (event) {

	                                                                                var loader = new THREE.KMZLoader();
	                                                                                var collada = loader.parse(event.target.result);

	                                                                                collada.scene.name = filename;

	                                                                                editor.execute(new AddObjectCommand$1(collada.scene));
	                                                                }, false);
	                                                                reader.readAsArrayBuffer(file);

	                                                                break;

	                                                case 'md2':

	                                                                reader.addEventListener('load', function (event) {

	                                                                                var contents = event.target.result;

	                                                                                var geometry = new THREE.MD2Loader().parse(contents);
	                                                                                var material = new THREE.MeshStandardMaterial({
	                                                                                                morphTargets: true,
	                                                                                                morphNormals: true
	                                                                                });

	                                                                                var mesh = new THREE.Mesh(geometry, material);
	                                                                                mesh.mixer = new THREE.AnimationMixer(mesh);
	                                                                                mesh.name = filename;

	                                                                                editor.execute(new AddObjectCommand$1(mesh));
	                                                                }, false);
	                                                                reader.readAsArrayBuffer(file);

	                                                                break;

	                                                case 'obj':

	                                                                reader.addEventListener('load', function (event) {

	                                                                                var contents = event.target.result;

	                                                                                var object = new THREE.OBJLoader().parse(contents);
	                                                                                object.name = filename;

	                                                                                editor.execute(new AddObjectCommand$1(object));
	                                                                }, false);
	                                                                reader.readAsText(file);

	                                                                break;

	                                                case 'playcanvas':

	                                                                reader.addEventListener('load', function (event) {

	                                                                                var contents = event.target.result;
	                                                                                var json = JSON.parse(contents);

	                                                                                var loader = new THREE.PlayCanvasLoader();
	                                                                                var object = loader.parse(json);

	                                                                                editor.execute(new AddObjectCommand$1(object));
	                                                                }, false);
	                                                                reader.readAsText(file);

	                                                                break;

	                                                case 'ply':

	                                                                reader.addEventListener('load', function (event) {

	                                                                                var contents = event.target.result;

	                                                                                var geometry = new THREE.PLYLoader().parse(contents);
	                                                                                geometry.sourceType = "ply";
	                                                                                geometry.sourceFile = file.name;

	                                                                                var material = new THREE.MeshStandardMaterial();

	                                                                                var mesh = new THREE.Mesh(geometry, material);
	                                                                                mesh.name = filename;

	                                                                                editor.execute(new AddObjectCommand$1(mesh));
	                                                                }, false);
	                                                                reader.readAsArrayBuffer(file);

	                                                                break;

	                                                case 'stl':

	                                                                reader.addEventListener('load', function (event) {

	                                                                                var contents = event.target.result;

	                                                                                var geometry = new THREE.STLLoader().parse(contents);
	                                                                                geometry.sourceType = "stl";
	                                                                                geometry.sourceFile = file.name;

	                                                                                var material = new THREE.MeshStandardMaterial();

	                                                                                var mesh = new THREE.Mesh(geometry, material);
	                                                                                mesh.name = filename;

	                                                                                editor.execute(new AddObjectCommand$1(mesh));
	                                                                }, false);

	                                                                if (reader.readAsBinaryString !== undefined) {

	                                                                                reader.readAsBinaryString(file);
	                                                                } else {

	                                                                                reader.readAsArrayBuffer(file);
	                                                                }

	                                                                break;

	                                                /*
	                                                case 'utf8':
	                                                       reader.addEventListener( 'load', function ( event ) {
	                                                           var contents = event.target.result;
	                                                           var geometry = new THREE.UTF8Loader().parse( contents );
	                                                        var material = new THREE.MeshLambertMaterial();
	                                                           var mesh = new THREE.Mesh( geometry, material );
	                                                           editor.execute( new AddObjectCommand( mesh ) );
	                                                       }, false );
	                                                    reader.readAsBinaryString( file );
	                                                       break;
	                                                */

	                                                case 'vtk':

	                                                                reader.addEventListener('load', function (event) {

	                                                                                var contents = event.target.result;

	                                                                                var geometry = new THREE.VTKLoader().parse(contents);
	                                                                                geometry.sourceType = "vtk";
	                                                                                geometry.sourceFile = file.name;

	                                                                                var material = new THREE.MeshStandardMaterial();

	                                                                                var mesh = new THREE.Mesh(geometry, material);
	                                                                                mesh.name = filename;

	                                                                                editor.execute(new AddObjectCommand$1(mesh));
	                                                                }, false);
	                                                                reader.readAsText(file);

	                                                                break;

	                                                case 'wrl':

	                                                                reader.addEventListener('load', function (event) {

	                                                                                var contents = event.target.result;

	                                                                                var result = new THREE.VRMLLoader().parse(contents);

	                                                                                editor.execute(new SetSceneCommand(result));
	                                                                }, false);
	                                                                reader.readAsText(file);

	                                                                break;

	                                                default:

	                                                                alert('不支持的文件类型(' + extension + ').');

	                                                                break;

	                                }
	                };

	                function handleJSON(data, file, filename) {

	                                if (data.metadata === undefined) {
	                                                // 2.0

	                                                data.metadata = { type: 'Geometry' };
	                                }

	                                if (data.metadata.type === undefined) {
	                                                // 3.0

	                                                data.metadata.type = 'Geometry';
	                                }

	                                if (data.metadata.formatVersion !== undefined) {

	                                                data.metadata.version = data.metadata.formatVersion;
	                                }

	                                switch (data.metadata.type.toLowerCase()) {

	                                                case 'buffergeometry':

	                                                                var loader = new THREE.BufferGeometryLoader();
	                                                                var result = loader.parse(data);

	                                                                var mesh = new THREE.Mesh(result);

	                                                                editor.execute(new AddObjectCommand$1(mesh));

	                                                                break;

	                                                case 'geometry':

	                                                                var loader = new THREE.JSONLoader();
	                                                                loader.setTexturePath(scope.texturePath);

	                                                                var result = loader.parse(data);

	                                                                var geometry = result.geometry;
	                                                                var material;

	                                                                if (result.materials !== undefined) {

	                                                                                if (result.materials.length > 1) {

	                                                                                                material = new THREE.MultiMaterial(result.materials);
	                                                                                } else {

	                                                                                                material = result.materials[0];
	                                                                                }
	                                                                } else {

	                                                                                material = new THREE.MeshStandardMaterial();
	                                                                }

	                                                                geometry.sourceType = "ascii";
	                                                                geometry.sourceFile = file.name;

	                                                                var mesh;

	                                                                if (geometry.animation && geometry.animation.hierarchy) {

	                                                                                mesh = new THREE.SkinnedMesh(geometry, material);
	                                                                } else {

	                                                                                mesh = new THREE.Mesh(geometry, material);
	                                                                }

	                                                                mesh.name = filename;

	                                                                editor.execute(new AddObjectCommand$1(mesh));

	                                                                break;

	                                                case 'object':

	                                                                var loader = new THREE.ObjectLoader();
	                                                                loader.setTexturePath(scope.texturePath);

	                                                                var result = loader.parse(data);

	                                                                if (result instanceof THREE.Scene) {

	                                                                                editor.execute(new SetSceneCommand(result));
	                                                                } else {

	                                                                                editor.execute(new AddObjectCommand$1(result));
	                                                                }

	                                                                break;

	                                                case 'scene':

	                                                                // DEPRECATED

	                                                                var loader = new THREE.SceneLoader();
	                                                                loader.parse(data, function (result) {

	                                                                                editor.execute(new SetSceneCommand(result.scene));
	                                                                }, '');

	                                                                break;

	                                                case 'app':

	                                                                editor.fromJSON(data);

	                                                                break;

	                                }
	                }
	}

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	function Player(editor) {

	    var signals = editor.signals;

	    var container = new UI.Panel();
	    container.setId('player');
	    container.setPosition('absolute');
	    container.setDisplay('none');

	    //

	    var player = new APP.Player();
	    container.dom.appendChild(player.dom);

	    window.addEventListener('resize', function () {

	        player.setSize(container.dom.clientWidth, container.dom.clientHeight);
	    });

	    signals.startPlayer.add(function () {

	        container.setDisplay('');

	        player.load(editor.toJSON());
	        player.setSize(container.dom.clientWidth, container.dom.clientHeight);
	        player.play();
	    });

	    signals.stopPlayer.add(function () {

	        container.setDisplay('none');

	        player.stop();
	        player.dispose();
	    });

	    return container;
	}

	/**
	 * @author dforrer / https://github.com/dforrer
	 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
	 */

	/**
	 * @param object THREE.Object3D
	 * @param script javascript object
	 * @param attributeName string
	 * @param newValue string, object
	 * @param cursorPosition javascript object with format {line: 2, ch: 3}
	 * @param scrollInfo javascript object with values {left, top, width, height, clientWidth, clientHeight}
	 * @constructor
	 */

	function SetScriptValueCommand(object, script, attributeName, newValue, cursorPosition, scrollInfo) {

		Command.call(this);

		this.type = 'SetScriptValueCommand';
		this.name = 'Set Script.' + attributeName;
		this.updatable = true;

		this.object = object;
		this.script = script;

		this.attributeName = attributeName;
		this.oldValue = script !== undefined ? script[this.attributeName] : undefined;
		this.newValue = newValue;
		this.cursorPosition = cursorPosition;
		this.scrollInfo = scrollInfo;
	}
	SetScriptValueCommand.prototype = Object.create(Command.prototype);

	Object.assign(SetScriptValueCommand.prototype, {

		constructor: SetScriptValueCommand,

		execute: function execute() {

			this.script[this.attributeName] = this.newValue;

			this.editor.signals.scriptChanged.dispatch();
			this.editor.signals.refreshScriptEditor.dispatch(this.object, this.script, this.cursorPosition, this.scrollInfo);
		},

		undo: function undo() {

			this.script[this.attributeName] = this.oldValue;

			this.editor.signals.scriptChanged.dispatch();
			this.editor.signals.refreshScriptEditor.dispatch(this.object, this.script, this.cursorPosition, this.scrollInfo);
		},

		update: function update(cmd) {

			this.cursorPosition = cmd.cursorPosition;
			this.scrollInfo = cmd.scrollInfo;
			this.newValue = cmd.newValue;
		},

		toJSON: function toJSON() {

			var output = Command.prototype.toJSON.call(this);

			output.objectUuid = this.object.uuid;
			output.index = this.editor.scripts[this.object.uuid].indexOf(this.script);
			output.attributeName = this.attributeName;
			output.oldValue = this.oldValue;
			output.newValue = this.newValue;
			output.cursorPosition = this.cursorPosition;
			output.scrollInfo = this.scrollInfo;

			return output;
		},

		fromJSON: function fromJSON(json) {

			Command.prototype.fromJSON.call(this, json);

			this.oldValue = json.oldValue;
			this.newValue = json.newValue;
			this.attributeName = json.attributeName;
			this.object = this.editor.objectByUuid(json.objectUuid);
			this.script = this.editor.scripts[json.objectUuid][json.index];
			this.cursorPosition = json.cursorPosition;
			this.scrollInfo = json.scrollInfo;
		}

	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	function Script(editor) {

	    var signals = editor.signals;

	    var container = new UI.Panel();
	    container.setId('script');
	    container.setPosition('absolute');
	    container.setBackgroundColor('#272822');
	    container.setDisplay('none');

	    var header = new UI.Panel();
	    header.setPadding('10px');
	    container.add(header);

	    var title = new UI.Text().setColor('#fff');
	    header.add(title);

	    var buttonSVG = function () {
	        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	        svg.setAttribute('width', 32);
	        svg.setAttribute('height', 32);
	        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	        path.setAttribute('d', 'M 12,12 L 22,22 M 22,12 12,22');
	        path.setAttribute('stroke', '#fff');
	        svg.appendChild(path);
	        return svg;
	    }();

	    var close = new UI.Element(buttonSVG);
	    close.setPosition('absolute');
	    close.setTop('3px');
	    close.setRight('1px');
	    close.setCursor('pointer');
	    close.onClick(function () {

	        container.setDisplay('none');
	    });
	    header.add(close);

	    var renderer;

	    signals.rendererChanged.add(function (newRenderer) {

	        renderer = newRenderer;
	    });

	    var delay;
	    var currentMode;
	    var currentScript;
	    var currentObject;

	    var codemirror = CodeMirror(container.dom, {
	        value: '',
	        lineNumbers: true,
	        matchBrackets: true,
	        indentWithTabs: true,
	        tabSize: 4,
	        indentUnit: 4,
	        hintOptions: {
	            completeSingle: false
	        }
	    });
	    codemirror.setOption('theme', 'monokai');
	    codemirror.on('change', function () {

	        if (codemirror.state.focused === false) return;

	        clearTimeout(delay);
	        delay = setTimeout(function () {

	            var value = codemirror.getValue();

	            if (!validate(value)) return;

	            if ((typeof currentScript === 'undefined' ? 'undefined' : _typeof(currentScript)) === 'object') {

	                if (value !== currentScript.source) {

	                    editor.execute(new SetScriptValueCommand(currentObject, currentScript, 'source', value, codemirror.getCursor(), codemirror.getScrollInfo()));
	                }
	                return;
	            }

	            if (currentScript !== 'programInfo') return;

	            var json = JSON.parse(value);

	            if (JSON.stringify(currentObject.material.defines) !== JSON.stringify(json.defines)) {

	                var cmd = new SetMaterialValueCommand(currentObject, 'defines', json.defines);
	                cmd.updatable = false;
	                editor.execute(cmd);
	            }
	            if (JSON.stringify(currentObject.material.uniforms) !== JSON.stringify(json.uniforms)) {

	                var cmd = new SetMaterialValueCommand(currentObject, 'uniforms', json.uniforms);
	                cmd.updatable = false;
	                editor.execute(cmd);
	            }
	            if (JSON.stringify(currentObject.material.attributes) !== JSON.stringify(json.attributes)) {

	                var cmd = new SetMaterialValueCommand(currentObject, 'attributes', json.attributes);
	                cmd.updatable = false;
	                editor.execute(cmd);
	            }
	        }, 300);
	    });

	    // prevent backspace from deleting objects
	    var wrapper = codemirror.getWrapperElement();
	    wrapper.addEventListener('keydown', function (event) {

	        event.stopPropagation();
	    });

	    // validate

	    var errorLines = [];
	    var widgets = [];

	    var validate = function validate(string) {

	        var valid;
	        var errors = [];

	        return codemirror.operation(function () {

	            while (errorLines.length > 0) {

	                codemirror.removeLineClass(errorLines.shift(), 'background', 'errorLine');
	            }

	            while (widgets.length > 0) {

	                codemirror.removeLineWidget(widgets.shift());
	            }

	            //

	            switch (currentMode) {

	                case 'javascript':

	                    try {

	                        var syntax = esprima.parse(string, { tolerant: true });
	                        errors = syntax.errors;
	                    } catch (error) {

	                        errors.push({

	                            lineNumber: error.lineNumber - 1,
	                            message: error.message

	                        });
	                    }

	                    for (var i = 0; i < errors.length; i++) {

	                        var error = errors[i];
	                        error.message = error.message.replace(/Line [0-9]+: /, '');
	                    }

	                    break;

	                case 'json':

	                    errors = [];

	                    jsonlint.parseError = function (message, info) {

	                        message = message.split('\n')[3];

	                        errors.push({

	                            lineNumber: info.loc.first_line - 1,
	                            message: message

	                        });
	                    };

	                    try {

	                        jsonlint.parse(string);
	                    } catch (error) {

	                        // ignore failed error recovery

	                    }

	                    break;

	                case 'glsl':

	                    try {

	                        var shaderType = currentScript === 'vertexShader' ? glslprep.Shader.VERTEX : glslprep.Shader.FRAGMENT;

	                        glslprep.parseGlsl(string, shaderType);
	                    } catch (error) {

	                        if (error instanceof glslprep.SyntaxError) {

	                            errors.push({

	                                lineNumber: error.line,
	                                message: "Syntax Error: " + error.message

	                            });
	                        } else {

	                            console.error(error.stack || error);
	                        }
	                    }

	                    if (errors.length !== 0) break;
	                    if (renderer instanceof THREE.WebGLRenderer === false) break;

	                    currentObject.material[currentScript] = string;
	                    currentObject.material.needsUpdate = true;
	                    signals.materialChanged.dispatch(currentObject.material);

	                    var programs = renderer.info.programs;

	                    valid = true;
	                    var parseMessage = /^(?:ERROR|WARNING): \d+:(\d+): (.*)/g;

	                    for (var i = 0, n = programs.length; i !== n; ++i) {

	                        var diagnostics = programs[i].diagnostics;

	                        if (diagnostics === undefined || diagnostics.material !== currentObject.material) continue;

	                        if (!diagnostics.runnable) valid = false;

	                        var shaderInfo = diagnostics[currentScript];
	                        var lineOffset = shaderInfo.prefix.split(/\r\n|\r|\n/).length;

	                        while (true) {

	                            var parseResult = parseMessage.exec(shaderInfo.log);
	                            if (parseResult === null) break;

	                            errors.push({

	                                lineNumber: parseResult[1] - lineOffset,
	                                message: parseResult[2]

	                            });
	                        } // messages

	                        break;
	                    } // programs

	            } // mode switch

	            for (var i = 0; i < errors.length; i++) {

	                var error = errors[i];

	                var message = document.createElement('div');
	                message.className = 'esprima-error';
	                message.textContent = error.message;

	                var lineNumber = Math.max(error.lineNumber, 0);
	                errorLines.push(lineNumber);

	                codemirror.addLineClass(lineNumber, 'background', 'errorLine');

	                var widget = codemirror.addLineWidget(lineNumber, message);

	                widgets.push(widget);
	            }

	            return valid !== undefined ? valid : errors.length === 0;
	        });
	    };

	    // tern js autocomplete

	    var server = new CodeMirror.TernServer({
	        caseInsensitive: true,
	        plugins: { threejs: null }
	    });

	    codemirror.setOption('extraKeys', {
	        'Ctrl-Space': function CtrlSpace(cm) {
	            server.complete(cm);
	        },
	        'Ctrl-I': function CtrlI(cm) {
	            server.showType(cm);
	        },
	        'Ctrl-O': function CtrlO(cm) {
	            server.showDocs(cm);
	        },
	        'Alt-.': function Alt(cm) {
	            server.jumpToDef(cm);
	        },
	        'Alt-,': function Alt(cm) {
	            server.jumpBack(cm);
	        },
	        'Ctrl-Q': function CtrlQ(cm) {
	            server.rename(cm);
	        },
	        'Ctrl-.': function Ctrl(cm) {
	            server.selectName(cm);
	        }
	    });

	    codemirror.on('cursorActivity', function (cm) {

	        if (currentMode !== 'javascript') return;
	        server.updateArgHints(cm);
	    });

	    codemirror.on('keypress', function (cm, kb) {

	        if (currentMode !== 'javascript') return;
	        var typed = String.fromCharCode(kb.which || kb.keyCode);
	        if (/[\w\.]/.exec(typed)) {

	            server.complete(cm);
	        }
	    });

	    //

	    signals.editorCleared.add(function () {

	        container.setDisplay('none');
	    });

	    signals.editScript.add(function (object, script) {

	        var mode, name, source;

	        if ((typeof script === 'undefined' ? 'undefined' : _typeof(script)) === 'object') {

	            mode = 'javascript';
	            name = script.name;
	            source = script.source;
	            title.setValue(object.name + ' / ' + name);
	        } else {

	            switch (script) {

	                case 'vertexShader':

	                    mode = 'glsl';
	                    name = 'Vertex Shader';
	                    source = object.material.vertexShader || "";

	                    break;

	                case 'fragmentShader':

	                    mode = 'glsl';
	                    name = 'Fragment Shader';
	                    source = object.material.fragmentShader || "";

	                    break;

	                case 'programInfo':

	                    mode = 'json';
	                    name = 'Program Properties';
	                    var json = {
	                        defines: object.material.defines,
	                        uniforms: object.material.uniforms,
	                        attributes: object.material.attributes
	                    };
	                    source = JSON.stringify(json, null, '\t');

	            }
	            title.setValue(object.material.name + ' / ' + name);
	        }

	        currentMode = mode;
	        currentScript = script;
	        currentObject = object;

	        container.setDisplay('');
	        codemirror.setValue(source);
	        if (mode === 'json') mode = { name: 'javascript', json: true };
	        codemirror.setOption('mode', mode);
	    });

	    signals.scriptRemoved.add(function (script) {

	        if (currentScript === script) {

	            container.setDisplay('none');
	        }
	    });

	    signals.refreshScriptEditor.add(function (object, script, cursorPosition, scrollInfo) {

	        if (currentScript !== script) return;

	        // copying the codemirror history because "codemirror.setValue(...)" alters its history

	        var history = codemirror.getHistory();
	        title.setValue(object.name + ' / ' + script.name);
	        codemirror.setValue(script.source);

	        if (cursorPosition !== undefined) {

	            codemirror.setCursor(cursorPosition);
	            codemirror.scrollTo(scrollInfo.left, scrollInfo.top);
	        }
	        codemirror.setHistory(history); // setting the history to previous state
	    });

	    return container;
	}

	/**
	 * @author dforrer / https://github.com/dforrer
	 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
	 */

	/**
	 * @param object THREE.Object3D
	 * @param script javascript object
	 * @constructor
	 */

	var AddScriptCommand = function AddScriptCommand(object, script) {

		Command.call(this);

		this.type = 'AddScriptCommand';
		this.name = 'Add Script';

		this.object = object;
		this.script = script;
	};

	AddScriptCommand.prototype = Object.create(Command.prototype);

	Object.assign(AddScriptCommand.prototype, {

		constructor: AddScriptCommand,

		execute: function execute() {

			if (this.editor.scripts[this.object.uuid] === undefined) {

				this.editor.scripts[this.object.uuid] = [];
			}

			this.editor.scripts[this.object.uuid].push(this.script);

			this.editor.signals.scriptAdded.dispatch(this.script);
		},

		undo: function undo() {

			if (this.editor.scripts[this.object.uuid] === undefined) return;

			var index = this.editor.scripts[this.object.uuid].indexOf(this.script);

			if (index !== -1) {

				this.editor.scripts[this.object.uuid].splice(index, 1);
			}

			this.editor.signals.scriptRemoved.dispatch(this.script);
		},

		toJSON: function toJSON() {

			var output = Command.prototype.toJSON.call(this);

			output.objectUuid = this.object.uuid;
			output.script = this.script;

			return output;
		},

		fromJSON: function fromJSON(json) {

			Command.prototype.fromJSON.call(this, json);

			this.script = json.script;
			this.object = this.editor.objectByUuid(json.objectUuid);
		}

	});

	/**
	 * @author dforrer / https://github.com/dforrer
	 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
	 */

	/**
	 * @param object THREE.Object3D
	 * @param newParent THREE.Object3D
	 * @param newBefore THREE.Object3D
	 * @constructor
	 */

	function MoveObjectCommand(object, newParent, newBefore) {

		Command.call(this);

		this.type = 'MoveObjectCommand';
		this.name = 'Move Object';

		this.object = object;
		this.oldParent = object !== undefined ? object.parent : undefined;
		this.oldIndex = this.oldParent !== undefined ? this.oldParent.children.indexOf(this.object) : undefined;
		this.newParent = newParent;

		if (newBefore !== undefined) {

			this.newIndex = newParent !== undefined ? newParent.children.indexOf(newBefore) : undefined;
		} else {

			this.newIndex = newParent !== undefined ? newParent.children.length : undefined;
		}

		if (this.oldParent === this.newParent && this.newIndex > this.oldIndex) {

			this.newIndex--;
		}

		this.newBefore = newBefore;
	}
	MoveObjectCommand.prototype = Object.create(Command.prototype);

	Object.assign(MoveObjectCommand.prototype, {

		constructor: MoveObjectCommand,

		execute: function execute() {

			this.oldParent.remove(this.object);

			var children = this.newParent.children;
			children.splice(this.newIndex, 0, this.object);
			this.object.parent = this.newParent;

			this.editor.signals.sceneGraphChanged.dispatch();
		},

		undo: function undo() {

			this.newParent.remove(this.object);

			var children = this.oldParent.children;
			children.splice(this.oldIndex, 0, this.object);
			this.object.parent = this.oldParent;

			this.editor.signals.sceneGraphChanged.dispatch();
		},

		toJSON: function toJSON() {

			var output = Command.prototype.toJSON.call(this);

			output.objectUuid = this.object.uuid;
			output.newParentUuid = this.newParent.uuid;
			output.oldParentUuid = this.oldParent.uuid;
			output.newIndex = this.newIndex;
			output.oldIndex = this.oldIndex;

			return output;
		},

		fromJSON: function fromJSON(json) {

			Command.prototype.fromJSON.call(this, json);

			this.object = this.editor.objectByUuid(json.objectUuid);
			this.oldParent = this.editor.objectByUuid(json.oldParentUuid);
			if (this.oldParent === undefined) {

				this.oldParent = this.editor.scene;
			}
			this.newParent = this.editor.objectByUuid(json.newParentUuid);
			if (this.newParent === undefined) {

				this.newParent = this.editor.scene;
			}
			this.newIndex = json.newIndex;
			this.oldIndex = json.oldIndex;
		}

	});

	/**
	 * @author dforrer / https://github.com/dforrer
	 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
	 */

	/**
	 * @param cmdArray array containing command objects
	 * @constructor
	 */

	function MultiCmdsCommand(cmdArray) {

			Command.call(this);

			this.type = 'MultiCmdsCommand';
			this.name = 'Multiple Changes';

			this.cmdArray = cmdArray !== undefined ? cmdArray : [];
	}
	MultiCmdsCommand.prototype = Object.create(Command.prototype);

	Object.assign(MultiCmdsCommand.prototype, {

			constructor: MultiCmdsCommand,

			execute: function execute() {

					this.editor.signals.sceneGraphChanged.active = false;

					for (var i = 0; i < this.cmdArray.length; i++) {

							this.cmdArray[i].execute();
					}

					this.editor.signals.sceneGraphChanged.active = true;
					this.editor.signals.sceneGraphChanged.dispatch();
			},

			undo: function undo() {

					this.editor.signals.sceneGraphChanged.active = false;

					for (var i = this.cmdArray.length - 1; i >= 0; i--) {

							this.cmdArray[i].undo();
					}

					this.editor.signals.sceneGraphChanged.active = true;
					this.editor.signals.sceneGraphChanged.dispatch();
			},

			toJSON: function toJSON() {

					var output = Command.prototype.toJSON.call(this);

					var cmds = [];
					for (var i = 0; i < this.cmdArray.length; i++) {

							cmds.push(this.cmdArray[i].toJSON());
					}
					output.cmds = cmds;

					return output;
			},

			fromJSON: function fromJSON(json) {

					Command.prototype.fromJSON.call(this, json);

					var cmds = json.cmds;
					for (var i = 0; i < cmds.length; i++) {

							var cmd = new window[cmds[i].type](); // creates a new object of type "json.type"
							cmd.fromJSON(cmds[i]);
							this.cmdArray.push(cmd);
					}
			}

	});

	/**
	 * @author dforrer / https://github.com/dforrer
	 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
	 */

	/**
	 * @param object THREE.Object3D
	 * @constructor
	 */

	function RemoveObjectCommand$1(object) {

			Command.call(this);

			this.type = 'RemoveObjectCommand';
			this.name = 'Remove Object';

			this.object = object;
			this.parent = object !== undefined ? object.parent : undefined;
			if (this.parent !== undefined) {

					this.index = this.parent.children.indexOf(this.object);
			}
	}
	RemoveObjectCommand$1.prototype = Object.create(Command.prototype);

	Object.assign(RemoveObjectCommand$1.prototype, {

			constructor: RemoveObjectCommand$1,

			execute: function execute() {

					var scope = this.editor;
					this.object.traverse(function (child) {

							scope.removeHelper(child);
					});

					this.parent.remove(this.object);
					this.editor.select(this.parent);

					this.editor.signals.objectRemoved.dispatch(this.object);
					this.editor.signals.sceneGraphChanged.dispatch();
			},

			undo: function undo() {

					var scope = this.editor;

					this.object.traverse(function (child) {

							if (child.geometry !== undefined) scope.addGeometry(child.geometry);
							if (child.material !== undefined) scope.addMaterial(child.material);

							scope.addHelper(child);
					});

					this.parent.children.splice(this.index, 0, this.object);
					this.object.parent = this.parent;
					this.editor.select(this.object);

					this.editor.signals.objectAdded.dispatch(this.object);
					this.editor.signals.sceneGraphChanged.dispatch();
			},

			toJSON: function toJSON() {

					var output = Command.prototype.toJSON.call(this);
					output.object = this.object.toJSON();
					output.index = this.index;
					output.parentUuid = this.parent.uuid;

					return output;
			},

			fromJSON: function fromJSON(json) {

					Command.prototype.fromJSON.call(this, json);

					this.parent = this.editor.objectByUuid(json.parentUuid);
					if (this.parent === undefined) {

							this.parent = this.editor.scene;
					}

					this.index = json.index;

					this.object = this.editor.objectByUuid(json.object.object.uuid);
					if (this.object === undefined) {

							var loader = new THREE.ObjectLoader();
							this.object = loader.parse(json.object);
					}
			}

	});

	/**
	 * @author dforrer / https://github.com/dforrer
	 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
	 */

	/**
	 * @param object THREE.Object3D
	 * @param script javascript object
	 * @constructor
	 */

	function RemoveScriptCommand(object, script) {

		Command.call(this);

		this.type = 'RemoveScriptCommand';
		this.name = 'Remove Script';

		this.object = object;
		this.script = script;
		if (this.object && this.script) {

			this.index = this.editor.scripts[this.object.uuid].indexOf(this.script);
		}
	}
	RemoveScriptCommand.prototype = Object.create(Command.prototype);

	Object.assign(RemoveScriptCommand.prototype, {

		constructor: RemoveScriptCommand,

		execute: function execute() {

			if (this.editor.scripts[this.object.uuid] === undefined) return;

			if (this.index !== -1) {

				this.editor.scripts[this.object.uuid].splice(this.index, 1);
			}

			this.editor.signals.scriptRemoved.dispatch(this.script);
		},

		undo: function undo() {

			if (this.editor.scripts[this.object.uuid] === undefined) {

				this.editor.scripts[this.object.uuid] = [];
			}

			this.editor.scripts[this.object.uuid].splice(this.index, 0, this.script);

			this.editor.signals.scriptAdded.dispatch(this.script);
		},

		toJSON: function toJSON() {

			var output = Command.prototype.toJSON.call(this);

			output.objectUuid = this.object.uuid;
			output.script = this.script;
			output.index = this.index;

			return output;
		},

		fromJSON: function fromJSON(json) {

			Command.prototype.fromJSON.call(this, json);

			this.script = json.script;
			this.index = json.index;
			this.object = this.editor.objectByUuid(json.objectUuid);
		}

	});

	/**
	 * @author dforrer / https://github.com/dforrer
	 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
	 */

	/**
	 * @param object THREE.Object3D
	 * @param attributeName string
	 * @param newValue integer representing a hex color value
	 * @constructor
	 */

	function SetColorCommand(object, attributeName, newValue) {

		Command.call(this);

		this.type = 'SetColorCommand';
		this.name = 'Set ' + attributeName;
		this.updatable = true;

		this.object = object;
		this.attributeName = attributeName;
		this.oldValue = object !== undefined ? this.object[this.attributeName].getHex() : undefined;
		this.newValue = newValue;
	}
	SetColorCommand.prototype = Object.create(Command.prototype);

	Object.assign(SetColorCommand.prototype, {

		constructor: SetColorCommand,

		execute: function execute() {

			this.object[this.attributeName].setHex(this.newValue);
			this.editor.signals.objectChanged.dispatch(this.object);
		},

		undo: function undo() {

			this.object[this.attributeName].setHex(this.oldValue);
			this.editor.signals.objectChanged.dispatch(this.object);
		},

		update: function update(cmd) {

			this.newValue = cmd.newValue;
		},

		toJSON: function toJSON() {

			var output = Command.prototype.toJSON.call(this);

			output.objectUuid = this.object.uuid;
			output.attributeName = this.attributeName;
			output.oldValue = this.oldValue;
			output.newValue = this.newValue;

			return output;
		},

		fromJSON: function fromJSON(json) {

			Command.prototype.fromJSON.call(this, json);

			this.object = this.editor.objectByUuid(json.objectUuid);
			this.attributeName = json.attributeName;
			this.oldValue = json.oldValue;
			this.newValue = json.newValue;
		}

	});

	/**
	 * @author dforrer / https://github.com/dforrer
	 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
	 */

	/**
	 * @param object THREE.Object3D
	 * @param newGeometry THREE.Geometry
	 * @constructor
	 */

	function SetGeometryCommand$1(object, newGeometry) {

		Command.call(this);

		this.type = 'SetGeometryCommand';
		this.name = 'Set Geometry';
		this.updatable = true;

		this.object = object;
		this.oldGeometry = object !== undefined ? object.geometry : undefined;
		this.newGeometry = newGeometry;
	}
	SetGeometryCommand$1.prototype = Object.create(Command.prototype);

	Object.assign(SetGeometryCommand$1.prototype, {

		constructor: SetGeometryCommand$1,

		execute: function execute() {

			this.object.geometry.dispose();
			this.object.geometry = this.newGeometry;
			this.object.geometry.computeBoundingSphere();

			this.editor.signals.geometryChanged.dispatch(this.object);
			this.editor.signals.sceneGraphChanged.dispatch();
		},

		undo: function undo() {

			this.object.geometry.dispose();
			this.object.geometry = this.oldGeometry;
			this.object.geometry.computeBoundingSphere();

			this.editor.signals.geometryChanged.dispatch(this.object);
			this.editor.signals.sceneGraphChanged.dispatch();
		},

		update: function update(cmd) {

			this.newGeometry = cmd.newGeometry;
		},

		toJSON: function toJSON() {

			var output = Command.prototype.toJSON.call(this);

			output.objectUuid = this.object.uuid;
			output.oldGeometry = this.object.geometry.toJSON();
			output.newGeometry = this.newGeometry.toJSON();

			return output;
		},

		fromJSON: function fromJSON(json) {

			Command.prototype.fromJSON.call(this, json);

			this.object = this.editor.objectByUuid(json.objectUuid);

			this.oldGeometry = parseGeometry(json.oldGeometry);
			this.newGeometry = parseGeometry(json.newGeometry);

			function parseGeometry(data) {

				var loader = new THREE.ObjectLoader();
				return loader.parseGeometries([data])[data.uuid];
			}
		}

	});

	/**
	 * @author dforrer / https://github.com/dforrer
	 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
	 */

	/**
	 * @param object THREE.Object3D
	 * @param attributeName string
	 * @param newValue number, string, boolean or object
	 * @constructor
	 */

	function SetGeometryValueCommand(object, attributeName, newValue) {

		Command.call(this);

		this.type = 'SetGeometryValueCommand';
		this.name = 'Set Geometry.' + attributeName;

		this.object = object;
		this.attributeName = attributeName;
		this.oldValue = object !== undefined ? object.geometry[attributeName] : undefined;
		this.newValue = newValue;
	}
	SetGeometryValueCommand.prototype = Object.create(Command.prototype);

	Object.assign(SetGeometryValueCommand.prototype, {

		constructor: SetGeometryValueCommand,

		execute: function execute() {

			this.object.geometry[this.attributeName] = this.newValue;
			this.editor.signals.objectChanged.dispatch(this.object);
			this.editor.signals.geometryChanged.dispatch();
			this.editor.signals.sceneGraphChanged.dispatch();
		},

		undo: function undo() {

			this.object.geometry[this.attributeName] = this.oldValue;
			this.editor.signals.objectChanged.dispatch(this.object);
			this.editor.signals.geometryChanged.dispatch();
			this.editor.signals.sceneGraphChanged.dispatch();
		},

		toJSON: function toJSON() {

			var output = Command.prototype.toJSON.call(this);

			output.objectUuid = this.object.uuid;
			output.attributeName = this.attributeName;
			output.oldValue = this.oldValue;
			output.newValue = this.newValue;

			return output;
		},

		fromJSON: function fromJSON(json) {

			Command.prototype.fromJSON.call(this, json);

			this.object = this.editor.objectByUuid(json.objectUuid);
			this.attributeName = json.attributeName;
			this.oldValue = json.oldValue;
			this.newValue = json.newValue;
		}

	});

	/**
	 * @author dforrer / https://github.com/dforrer
	 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
	 */

	/**
	 * @param object THREE.Object3D
	 * @param attributeName string
	 * @param newValue integer representing a hex color value
	 * @constructor
	 */

	function SetMaterialColorCommand(object, attributeName, newValue) {

		Command.call(this);

		this.type = 'SetMaterialColorCommand';
		this.name = 'Set Material.' + attributeName;
		this.updatable = true;

		this.object = object;
		this.attributeName = attributeName;
		this.oldValue = object !== undefined ? this.object.material[this.attributeName].getHex() : undefined;
		this.newValue = newValue;
	}
	SetMaterialColorCommand.prototype = Object.create(Command.prototype);

	Object.assign(SetMaterialColorCommand.prototype, {

		constructor: SetMaterialColorCommand,

		execute: function execute() {

			this.object.material[this.attributeName].setHex(this.newValue);
			this.editor.signals.materialChanged.dispatch(this.object.material);
		},

		undo: function undo() {

			this.object.material[this.attributeName].setHex(this.oldValue);
			this.editor.signals.materialChanged.dispatch(this.object.material);
		},

		update: function update(cmd) {

			this.newValue = cmd.newValue;
		},

		toJSON: function toJSON() {

			var output = Command.prototype.toJSON.call(this);

			output.objectUuid = this.object.uuid;
			output.attributeName = this.attributeName;
			output.oldValue = this.oldValue;
			output.newValue = this.newValue;

			return output;
		},

		fromJSON: function fromJSON(json) {

			Command.prototype.fromJSON.call(this, json);

			this.object = this.editor.objectByUuid(json.objectUuid);
			this.attributeName = json.attributeName;
			this.oldValue = json.oldValue;
			this.newValue = json.newValue;
		}

	});

	/**
	 * @author dforrer / https://github.com/dforrer
	 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
	 */

	/**
	 * @param object THREE.Object3D
	 * @param newMaterial THREE.Material
	 * @constructor
	 */

	function SetMaterialCommand(object, newMaterial) {

		Command.call(this);

		this.type = 'SetMaterialCommand';
		this.name = 'New Material';

		this.object = object;
		this.oldMaterial = object !== undefined ? object.material : undefined;
		this.newMaterial = newMaterial;
	}
	SetMaterialCommand.prototype = Object.create(Command.prototype);

	Object.assign(SetMaterialCommand.prototype, {

		constructor: SetMaterialCommand,

		execute: function execute() {

			this.object.material = this.newMaterial;
			this.editor.signals.materialChanged.dispatch(this.newMaterial);
		},

		undo: function undo() {

			this.object.material = this.oldMaterial;
			this.editor.signals.materialChanged.dispatch(this.oldMaterial);
		},

		toJSON: function toJSON() {

			var output = Command.prototype.toJSON.call(this);

			output.objectUuid = this.object.uuid;
			output.oldMaterial = this.oldMaterial.toJSON();
			output.newMaterial = this.newMaterial.toJSON();

			return output;
		},

		fromJSON: function fromJSON(json) {

			Command.prototype.fromJSON.call(this, json);

			this.object = this.editor.objectByUuid(json.objectUuid);
			this.oldMaterial = parseMaterial(json.oldMaterial);
			this.newMaterial = parseMaterial(json.newMaterial);

			function parseMaterial(json) {

				var loader = new THREE.ObjectLoader();
				var images = loader.parseImages(json.images);
				var textures = loader.parseTextures(json.textures, images);
				var materials = loader.parseMaterials([json], textures);
				return materials[json.uuid];
			}
		}

	});

	/**
	 * @author dforrer / https://github.com/dforrer
	 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
	 */

	/**
	 * @param object THREE.Object3D
	 * @param mapName string
	 * @param newMap THREE.Texture
	 * @constructor
	 */

	function SetMaterialMapCommand(object, mapName, newMap) {

			Command.call(this);
			this.type = 'SetMaterialMapCommand';
			this.name = 'Set Material.' + mapName;

			this.object = object;
			this.mapName = mapName;
			this.oldMap = object !== undefined ? object.material[mapName] : undefined;
			this.newMap = newMap;
	}
	SetMaterialMapCommand.prototype = Object.create(Command.prototype);

	Object.assign(SetMaterialMapCommand.prototype, {

			constructor: SetMaterialMapCommand,

			execute: function execute() {

					this.object.material[this.mapName] = this.newMap;
					this.object.material.needsUpdate = true;
					this.editor.signals.materialChanged.dispatch(this.object.material);
			},

			undo: function undo() {

					this.object.material[this.mapName] = this.oldMap;
					this.object.material.needsUpdate = true;
					this.editor.signals.materialChanged.dispatch(this.object.material);
			},

			toJSON: function toJSON() {

					var output = Command.prototype.toJSON.call(this);

					output.objectUuid = this.object.uuid;
					output.mapName = this.mapName;
					output.newMap = serializeMap(this.newMap);
					output.oldMap = serializeMap(this.oldMap);

					return output;

					// serializes a map (THREE.Texture)

					function serializeMap(map) {

							if (map === null || map === undefined) return null;

							var meta = {
									geometries: {},
									materials: {},
									textures: {},
									images: {}
							};

							var json = map.toJSON(meta);
							var images = extractFromCache(meta.images);
							if (images.length > 0) json.images = images;
							json.sourceFile = map.sourceFile;

							return json;
					}

					// Note: The function 'extractFromCache' is copied from Object3D.toJSON()

					// extract data from the cache hash
					// remove metadata on each item
					// and return as array
					function extractFromCache(cache) {

							var values = [];
							for (var key in cache) {

									var data = cache[key];
									delete data.metadata;
									values.push(data);
							}
							return values;
					}
			},

			fromJSON: function fromJSON(json) {

					Command.prototype.fromJSON.call(this, json);

					this.object = this.editor.objectByUuid(json.objectUuid);
					this.mapName = json.mapName;
					this.oldMap = parseTexture(json.oldMap);
					this.newMap = parseTexture(json.newMap);

					function parseTexture(json) {

							var map = null;
							if (json !== null) {

									var loader = new THREE.ObjectLoader();
									var images = loader.parseImages(json.images);
									var textures = loader.parseTextures([json], images);
									map = textures[json.uuid];
									map.sourceFile = json.sourceFile;
							}
							return map;
					}
			}

	});

	/**
	 * @author dforrer / https://github.com/dforrer
	 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
	 */

	/**
	 * @param object THREE.Object3D
	 * @param attributeName string
	 * @param newValue number, string, boolean or object
	 * @constructor
	 */

	function SetMaterialValueCommand$1(object, attributeName, newValue) {

		Command.call(this);

		this.type = 'SetMaterialValueCommand';
		this.name = 'Set Material.' + attributeName;
		this.updatable = true;

		this.object = object;
		this.oldValue = object !== undefined ? object.material[attributeName] : undefined;
		this.newValue = newValue;
		this.attributeName = attributeName;
	}
	SetMaterialValueCommand$1.prototype = Object.create(Command.prototype);

	Object.assign(SetMaterialValueCommand$1.prototype, {

		constructor: SetMaterialValueCommand$1,

		execute: function execute() {

			this.object.material[this.attributeName] = this.newValue;
			this.object.material.needsUpdate = true;
			this.editor.signals.objectChanged.dispatch(this.object);
			this.editor.signals.materialChanged.dispatch(this.object.material);
		},

		undo: function undo() {

			this.object.material[this.attributeName] = this.oldValue;
			this.object.material.needsUpdate = true;
			this.editor.signals.objectChanged.dispatch(this.object);
			this.editor.signals.materialChanged.dispatch(this.object.material);
		},

		update: function update(cmd) {

			this.newValue = cmd.newValue;
		},

		toJSON: function toJSON() {

			var output = Command.prototype.toJSON.call(this);

			output.objectUuid = this.object.uuid;
			output.attributeName = this.attributeName;
			output.oldValue = this.oldValue;
			output.newValue = this.newValue;

			return output;
		},

		fromJSON: function fromJSON(json) {

			Command.prototype.fromJSON.call(this, json);

			this.attributeName = json.attributeName;
			this.oldValue = json.oldValue;
			this.newValue = json.newValue;
			this.object = this.editor.objectByUuid(json.objectUuid);
		}

	});

	/**
	 * @author dforrer / https://github.com/dforrer
	 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
	 */

	/**
	 * @param object THREE.Object3D
	 * @param newPosition THREE.Vector3
	 * @param optionalOldPosition THREE.Vector3
	 * @constructor
	 */

	function SetPositionCommand(object, newPosition, optionalOldPosition) {

		Command.call(this);

		this.type = 'SetPositionCommand';
		this.name = 'Set Position';
		this.updatable = true;

		this.object = object;

		if (object !== undefined && newPosition !== undefined) {
			this.oldPosition = object.position.clone();
			this.newPosition = newPosition.clone();
		}

		if (optionalOldPosition !== undefined) {
			this.oldPosition = optionalOldPosition.clone();
		}
	}
	SetPositionCommand.prototype = Object.create(Command.prototype);

	Object.assign(SetPositionCommand.prototype, {

		constructor: SetPositionCommand,

		execute: function execute() {

			this.object.position.copy(this.newPosition);
			this.object.updateMatrixWorld(true);
			this.editor.signals.objectChanged.dispatch(this.object);
		},

		undo: function undo() {

			this.object.position.copy(this.oldPosition);
			this.object.updateMatrixWorld(true);
			this.editor.signals.objectChanged.dispatch(this.object);
		},

		update: function update(command) {

			this.newPosition.copy(command.newPosition);
		},

		toJSON: function toJSON() {

			var output = Command.prototype.toJSON.call(this);

			output.objectUuid = this.object.uuid;
			output.oldPosition = this.oldPosition.toArray();
			output.newPosition = this.newPosition.toArray();

			return output;
		},

		fromJSON: function fromJSON(json) {

			Command.prototype.fromJSON.call(this, json);

			this.object = this.editor.objectByUuid(json.objectUuid);
			this.oldPosition = new THREE.Vector3().fromArray(json.oldPosition);
			this.newPosition = new THREE.Vector3().fromArray(json.newPosition);
		}

	});

	/**
	 * @author dforrer / https://github.com/dforrer
	 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
	 */

	/**
	 * @param object THREE.Object3D
	 * @param newRotation THREE.Euler
	 * @param optionalOldRotation THREE.Euler
	 * @constructor
	 */
	function SetRotationCommand(object, newRotation, optionalOldRotation) {

		Command.call(this);

		this.type = 'SetRotationCommand';
		this.name = 'Set Rotation';
		this.updatable = true;

		this.object = object;

		if (object !== undefined && newRotation !== undefined) {

			this.oldRotation = object.rotation.clone();
			this.newRotation = newRotation.clone();
		}

		if (optionalOldRotation !== undefined) {

			this.oldRotation = optionalOldRotation.clone();
		}
	}
	SetRotationCommand.prototype = Object.create(Command.prototype);

	Object.assign(SetRotationCommand.prototype, {

		constructor: SetRotationCommand,

		execute: function execute() {

			this.object.rotation.copy(this.newRotation);
			this.object.updateMatrixWorld(true);
			this.editor.signals.objectChanged.dispatch(this.object);
		},

		undo: function undo() {

			this.object.rotation.copy(this.oldRotation);
			this.object.updateMatrixWorld(true);
			this.editor.signals.objectChanged.dispatch(this.object);
		},

		update: function update(command) {

			this.newRotation.copy(command.newRotation);
		},

		toJSON: function toJSON() {

			var output = Command.prototype.toJSON.call(this);

			output.objectUuid = this.object.uuid;
			output.oldRotation = this.oldRotation.toArray();
			output.newRotation = this.newRotation.toArray();

			return output;
		},

		fromJSON: function fromJSON(json) {

			Command.prototype.fromJSON.call(this, json);

			this.object = this.editor.objectByUuid(json.objectUuid);
			this.oldRotation = new THREE.Euler().fromArray(json.oldRotation);
			this.newRotation = new THREE.Euler().fromArray(json.newRotation);
		}

	});

	/**
	 * @author dforrer / https://github.com/dforrer
	 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
	 */

	/**
	 * @param object THREE.Object3D
	 * @param newScale THREE.Vector3
	 * @param optionalOldScale THREE.Vector3
	 * @constructor
	 */
	function SetScaleCommand(object, newScale, optionalOldScale) {

		Command.call(this);

		this.type = 'SetScaleCommand';
		this.name = 'Set Scale';
		this.updatable = true;

		this.object = object;

		if (object !== undefined && newScale !== undefined) {
			this.oldScale = object.scale.clone();
			this.newScale = newScale.clone();
		}

		if (optionalOldScale !== undefined) {
			this.oldScale = optionalOldScale.clone();
		}
	}
	SetScaleCommand.prototype = Object.create(Command.prototype);

	Object.assign(SetScaleCommand.prototype, {

		constructor: SetScaleCommand,

		execute: function execute() {

			this.object.scale.copy(this.newScale);
			this.object.updateMatrixWorld(true);
			this.editor.signals.objectChanged.dispatch(this.object);
		},

		undo: function undo() {

			this.object.scale.copy(this.oldScale);
			this.object.updateMatrixWorld(true);
			this.editor.signals.objectChanged.dispatch(this.object);
		},

		update: function update(command) {

			this.newScale.copy(command.newScale);
		},

		toJSON: function toJSON() {

			var output = Command.prototype.toJSON.call(this);

			output.objectUuid = this.object.uuid;
			output.oldScale = this.oldScale.toArray();
			output.newScale = this.newScale.toArray();

			return output;
		},

		fromJSON: function fromJSON(json) {

			Command.prototype.fromJSON.call(this, json);

			this.object = this.editor.objectByUuid(json.objectUuid);
			this.oldScale = new THREE.Vector3().fromArray(json.oldScale);
			this.newScale = new THREE.Vector3().fromArray(json.newScale);
		}

	});

	/**
	 * @author dforrer / https://github.com/dforrer
	 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
	 */

	/**
	 * @param object THREE.Object3D
	 * @param newUuid string
	 * @constructor
	 */

	function SetUuidCommand$1(object, newUuid) {

		Command.call(this);

		this.type = 'SetUuidCommand';
		this.name = 'Update UUID';

		this.object = object;

		this.oldUuid = object !== undefined ? object.uuid : undefined;
		this.newUuid = newUuid;
	}
	SetUuidCommand$1.prototype = Object.create(Command.prototype);

	Object.assign(SetUuidCommand$1.prototype, {

		constructor: SetUuidCommand$1,

		execute: function execute() {

			this.object.uuid = this.newUuid;
			this.editor.signals.objectChanged.dispatch(this.object);
			this.editor.signals.sceneGraphChanged.dispatch();
		},

		undo: function undo() {

			this.object.uuid = this.oldUuid;
			this.editor.signals.objectChanged.dispatch(this.object);
			this.editor.signals.sceneGraphChanged.dispatch();
		},

		toJSON: function toJSON() {

			var output = Command.prototype.toJSON.call(this);

			output.oldUuid = this.oldUuid;
			output.newUuid = this.newUuid;

			return output;
		},

		fromJSON: function fromJSON(json) {

			Command.prototype.fromJSON.call(this, json);

			this.oldUuid = json.oldUuid;
			this.newUuid = json.newUuid;
			this.object = this.editor.objectByUuid(json.oldUuid);

			if (this.object === undefined) {

				this.object = this.editor.objectByUuid(json.newUuid);
			}
		}

	});

	/**
	 * @author dforrer / https://github.com/dforrer
	 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
	 */

	/**
	 * @param object THREE.Object3D
	 * @param attributeName string
	 * @param newValue number, string, boolean or object
	 * @constructor
	 */

	function SetValueCommand$1(object, attributeName, newValue) {

		Command.call(this);

		this.type = 'SetValueCommand';
		this.name = 'Set ' + attributeName;
		this.updatable = true;

		this.object = object;
		this.attributeName = attributeName;
		this.oldValue = object !== undefined ? object[attributeName] : undefined;
		this.newValue = newValue;
	}
	SetValueCommand$1.prototype = Object.create(Command.prototype);

	Object.assign(SetValueCommand$1.prototype, {

		constructor: SetValueCommand$1,

		execute: function execute() {

			this.object[this.attributeName] = this.newValue;
			this.editor.signals.objectChanged.dispatch(this.object);
			// this.editor.signals.sceneGraphChanged.dispatch();
		},

		undo: function undo() {

			this.object[this.attributeName] = this.oldValue;
			this.editor.signals.objectChanged.dispatch(this.object);
			// this.editor.signals.sceneGraphChanged.dispatch();
		},

		update: function update(cmd) {

			this.newValue = cmd.newValue;
		},

		toJSON: function toJSON() {

			var output = Command.prototype.toJSON.call(this);

			output.objectUuid = this.object.uuid;
			output.attributeName = this.attributeName;
			output.oldValue = this.oldValue;
			output.newValue = this.newValue;

			return output;
		},

		fromJSON: function fromJSON(json) {

			Command.prototype.fromJSON.call(this, json);

			this.attributeName = json.attributeName;
			this.oldValue = json.oldValue;
			this.newValue = json.newValue;
			this.object = this.editor.objectByUuid(json.objectUuid);
		}

	});

	/**
	* @author mrdoob / http://mrdoob.com/
	*/

	function ViewportInfo(editor) {

	    var signals = editor.signals;

	    var container = new UI.Panel();
	    container.setId('info');
	    container.setPosition('absolute');
	    container.setLeft('10px');
	    container.setBottom('10px');
	    container.setFontSize('12px');
	    container.setColor('#fff');

	    var objectsText = new UI.Text('0').setMarginLeft('6px');
	    var verticesText = new UI.Text('0').setMarginLeft('6px');
	    var trianglesText = new UI.Text('0').setMarginLeft('6px');

	    container.add(new UI.Text('物体'), objectsText, new UI.Break());
	    container.add(new UI.Text('顶点'), verticesText, new UI.Break());
	    container.add(new UI.Text('三角形'), trianglesText, new UI.Break());

	    signals.objectAdded.add(update);
	    signals.objectRemoved.add(update);
	    signals.geometryChanged.add(update);

	    //

	    function update() {

	        var scene = editor.scene;

	        var objects = 0,
	            vertices = 0,
	            triangles = 0;

	        for (var i = 0, l = scene.children.length; i < l; i++) {

	            var object = scene.children[i];

	            object.traverseVisible(function (object) {

	                objects++;

	                if (object instanceof THREE.Mesh) {

	                    var geometry = object.geometry;

	                    if (geometry instanceof THREE.Geometry) {

	                        vertices += geometry.vertices.length;
	                        triangles += geometry.faces.length;
	                    } else if (geometry instanceof THREE.BufferGeometry) {

	                        if (geometry.index !== null) {

	                            vertices += geometry.index.count * 3;
	                            triangles += geometry.index.count;
	                        } else {

	                            vertices += geometry.attributes.position.count;
	                            triangles += geometry.attributes.position.count / 3;
	                        }
	                    }
	                }
	            });
	        }

	        objectsText.setValue(objects.format());
	        verticesText.setValue(vertices.format());
	        trianglesText.setValue(triangles.format());
	    }

	    return container;
	}

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	function Viewport(editor) {

	    var signals = editor.signals;

	    var container = new UI.Panel();
	    container.setId('viewport');
	    container.setPosition('absolute');

	    container.add(new ViewportInfo(editor));

	    //

	    var renderer = null;

	    var camera = editor.camera;
	    var scene = editor.scene;
	    var sceneHelpers = editor.sceneHelpers;

	    var objects = [];

	    //

	    var vrEffect, vrControls;

	    // if ( renderer.vr.enabled ) {

	    var vrCamera = new THREE.PerspectiveCamera();
	    vrCamera.projectionMatrix = camera.projectionMatrix;
	    camera.add(vrCamera);

	    // }

	    // helpers

	    var grid = new THREE.GridHelper(60, 60);
	    sceneHelpers.add(grid);

	    //

	    var box = new THREE.Box3();

	    var selectionBox = new THREE.BoxHelper();
	    selectionBox.material.depthTest = false;
	    selectionBox.material.transparent = true;
	    selectionBox.visible = false;
	    sceneHelpers.add(selectionBox);

	    var objectPositionOnDown = null;
	    var objectRotationOnDown = null;
	    var objectScaleOnDown = null;

	    var transformControls = new THREE.TransformControls(camera, container.dom);
	    transformControls.addEventListener('change', function () {

	        var object = transformControls.object;

	        if (object !== undefined) {

	            selectionBox.update(object);

	            if (editor.helpers[object.id] !== undefined) {

	                editor.helpers[object.id].update();
	            }

	            signals.refreshSidebarObject3D.dispatch(object);
	        }

	        render();
	    });
	    transformControls.addEventListener('mouseDown', function () {

	        var object = transformControls.object;

	        objectPositionOnDown = object.position.clone();
	        objectRotationOnDown = object.rotation.clone();
	        objectScaleOnDown = object.scale.clone();

	        controls.enabled = false;
	    });
	    transformControls.addEventListener('mouseUp', function () {

	        var object = transformControls.object;

	        if (object !== undefined) {

	            switch (transformControls.getMode()) {

	                case 'translate':

	                    if (!objectPositionOnDown.equals(object.position)) {

	                        editor.execute(new SetPositionCommand(object, object.position, objectPositionOnDown));
	                    }

	                    break;

	                case 'rotate':

	                    if (!objectRotationOnDown.equals(object.rotation)) {

	                        editor.execute(new SetRotationCommand(object, object.rotation, objectRotationOnDown));
	                    }

	                    break;

	                case 'scale':

	                    if (!objectScaleOnDown.equals(object.scale)) {

	                        editor.execute(new SetScaleCommand(object, object.scale, objectScaleOnDown));
	                    }

	                    break;

	            }
	        }

	        controls.enabled = true;
	    });

	    sceneHelpers.add(transformControls);

	    // object picking

	    var raycaster = new THREE.Raycaster();
	    var mouse = new THREE.Vector2();

	    // events

	    function getIntersects(point, objects) {

	        mouse.set(point.x * 2 - 1, -(point.y * 2) + 1);

	        raycaster.setFromCamera(mouse, camera);

	        return raycaster.intersectObjects(objects);
	    }

	    var onDownPosition = new THREE.Vector2();
	    var onUpPosition = new THREE.Vector2();
	    var onDoubleClickPosition = new THREE.Vector2();

	    function getMousePosition(dom, x, y) {

	        var rect = dom.getBoundingClientRect();
	        return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
	    }

	    function handleClick() {

	        if (onDownPosition.distanceTo(onUpPosition) === 0) {

	            var intersects = getIntersects(onUpPosition, objects);

	            if (intersects.length > 0) {

	                var object = intersects[0].object;

	                if (object.userData.object !== undefined) {

	                    // helper

	                    editor.select(object.userData.object);
	                } else {

	                    editor.select(object);
	                }
	            } else {

	                editor.select(null);
	            }

	            render();
	        }
	    }

	    function onMouseDown(event) {

	        event.preventDefault();

	        var array = getMousePosition(container.dom, event.clientX, event.clientY);
	        onDownPosition.fromArray(array);

	        document.addEventListener('mouseup', onMouseUp, false);
	    }

	    function onMouseUp(event) {

	        var array = getMousePosition(container.dom, event.clientX, event.clientY);
	        onUpPosition.fromArray(array);

	        handleClick();

	        document.removeEventListener('mouseup', onMouseUp, false);
	    }

	    function onTouchStart(event) {

	        var touch = event.changedTouches[0];

	        var array = getMousePosition(container.dom, touch.clientX, touch.clientY);
	        onDownPosition.fromArray(array);

	        document.addEventListener('touchend', onTouchEnd, false);
	    }

	    function onTouchEnd(event) {

	        var touch = event.changedTouches[0];

	        var array = getMousePosition(container.dom, touch.clientX, touch.clientY);
	        onUpPosition.fromArray(array);

	        handleClick();

	        document.removeEventListener('touchend', onTouchEnd, false);
	    }

	    function onDoubleClick(event) {

	        var array = getMousePosition(container.dom, event.clientX, event.clientY);
	        onDoubleClickPosition.fromArray(array);

	        var intersects = getIntersects(onDoubleClickPosition, objects);

	        if (intersects.length > 0) {

	            var intersect = intersects[0];

	            signals.objectFocused.dispatch(intersect.object);
	        }
	    }

	    container.dom.addEventListener('mousedown', onMouseDown, false);
	    container.dom.addEventListener('touchstart', onTouchStart, false);
	    container.dom.addEventListener('dblclick', onDoubleClick, false);

	    // controls need to be added *after* main logic,
	    // otherwise controls.enabled doesn't work.

	    var controls = new THREE.EditorControls(camera, container.dom);
	    controls.addEventListener('change', function () {

	        transformControls.update();
	        signals.cameraChanged.dispatch(camera);
	    });

	    // signals

	    signals.editorCleared.add(function () {

	        controls.center.set(0, 0, 0);
	        render();
	    });

	    signals.enterVR.add(function () {

	        vrEffect.isPresenting ? vrEffect.exitPresent() : vrEffect.requestPresent();
	    });

	    signals.themeChanged.add(function (value) {

	        switch (value) {

	            case '../assets/css/light.css':
	                sceneHelpers.remove(grid);
	                grid = new THREE.GridHelper(60, 60, 0x444444, 0x888888);
	                sceneHelpers.add(grid);
	                break;
	            case '../assets/css/dark.css':
	                sceneHelpers.remove(grid);
	                grid = new THREE.GridHelper(60, 60, 0xbbbbbb, 0x888888);
	                sceneHelpers.add(grid);
	                break;

	        }

	        render();
	    });

	    signals.transformModeChanged.add(function (mode) {

	        transformControls.setMode(mode);
	    });

	    signals.snapChanged.add(function (dist) {

	        transformControls.setTranslationSnap(dist);
	    });

	    signals.spaceChanged.add(function (space) {

	        transformControls.setSpace(space);
	    });

	    signals.rendererChanged.add(function (newRenderer) {

	        if (renderer !== null) {

	            container.dom.removeChild(renderer.domElement);
	        }

	        renderer = newRenderer;

	        renderer.autoClear = false;
	        renderer.autoUpdateScene = false;
	        renderer.setPixelRatio(window.devicePixelRatio);
	        renderer.setSize(container.dom.offsetWidth, container.dom.offsetHeight);

	        container.dom.appendChild(renderer.domElement);

	        if (renderer.vr.enabled) {

	            vrControls = new THREE.VRControls(vrCamera);
	            vrEffect = new THREE.VREffect(renderer);

	            window.addEventListener('vrdisplaypresentchange', function (event) {

	                effect.isPresenting ? signals.enteredVR.dispatch() : signals.exitedVR.dispatch();
	            }, false);
	        }

	        render();
	    });

	    signals.sceneGraphChanged.add(function () {

	        render();
	    });

	    signals.cameraChanged.add(function () {

	        render();
	    });

	    signals.objectSelected.add(function (object) {

	        selectionBox.visible = false;
	        transformControls.detach();

	        if (object !== null && object !== scene) {

	            box.setFromObject(object);

	            if (box.isEmpty() === false) {

	                selectionBox.update(box);
	                selectionBox.visible = true;
	            }

	            transformControls.attach(object);
	        }

	        render();
	    });

	    signals.objectFocused.add(function (object) {

	        controls.focus(object);
	    });

	    signals.geometryChanged.add(function (object) {

	        if (object !== undefined) {

	            selectionBox.update(object);
	        }

	        render();
	    });

	    signals.objectAdded.add(function (object) {

	        object.traverse(function (child) {

	            objects.push(child);
	        });
	    });

	    signals.objectChanged.add(function (object) {

	        if (editor.selected === object) {

	            selectionBox.update(object);
	            transformControls.update();
	        }

	        if (object instanceof THREE.PerspectiveCamera) {

	            object.updateProjectionMatrix();
	        }

	        if (editor.helpers[object.id] !== undefined) {

	            editor.helpers[object.id].update();
	        }

	        render();
	    });

	    signals.objectRemoved.add(function (object) {

	        object.traverse(function (child) {

	            objects.splice(objects.indexOf(child), 1);
	        });
	    });

	    signals.helperAdded.add(function (object) {

	        objects.push(object.getObjectByName('picker'));
	    });

	    signals.helperRemoved.add(function (object) {

	        objects.splice(objects.indexOf(object.getObjectByName('picker')), 1);
	    });

	    signals.materialChanged.add(function (material) {

	        render();
	    });

	    // fog

	    signals.sceneBackgroundChanged.add(function (backgroundColor) {

	        scene.background.setHex(backgroundColor);

	        render();
	    });

	    var currentFogType = null;

	    signals.sceneFogChanged.add(function (fogType, fogColor, fogNear, fogFar, fogDensity) {

	        if (currentFogType !== fogType) {

	            switch (fogType) {

	                case 'None':
	                    scene.fog = null;
	                    break;
	                case 'Fog':
	                    scene.fog = new THREE.Fog();
	                    break;
	                case 'FogExp2':
	                    scene.fog = new THREE.FogExp2();
	                    break;

	            }

	            currentFogType = fogType;
	        }

	        if (scene.fog instanceof THREE.Fog) {

	            scene.fog.color.setHex(fogColor);
	            scene.fog.near = fogNear;
	            scene.fog.far = fogFar;
	        } else if (scene.fog instanceof THREE.FogExp2) {

	            scene.fog.color.setHex(fogColor);
	            scene.fog.density = fogDensity;
	        }

	        render();
	    });

	    //

	    signals.windowResize.add(function () {

	        // TODO: Move this out?

	        editor.DEFAULT_CAMERA.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
	        editor.DEFAULT_CAMERA.updateProjectionMatrix();

	        camera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
	        camera.updateProjectionMatrix();

	        renderer.setSize(container.dom.offsetWidth, container.dom.offsetHeight);

	        render();
	    });

	    signals.showGridChanged.add(function (showGrid) {

	        grid.visible = showGrid;
	        render();
	    });

	    //

	    function animate() {

	        requestAnimationFrame(animate);

	        /*
	        // animations
	        if ( THREE.AnimationHandler.animations.length > 0 ) {
	        THREE.AnimationHandler.update( 0.016 );
	        for ( var i = 0, l = sceneHelpers.children.length; i < l; i ++ ) {
	        var helper = sceneHelpers.children[ i ];
	        if ( helper instanceof THREE.SkeletonHelper ) {
	        helper.update();
	        }
	        }
	        }
	        */

	        if (vrEffect && vrEffect.isPresenting) {

	            render();
	        }
	    }

	    function render() {

	        sceneHelpers.updateMatrixWorld();
	        scene.updateMatrixWorld();

	        if (vrEffect && vrEffect.isPresenting) {

	            vrControls.update();

	            camera.updateMatrixWorld();

	            vrEffect.render(scene, vrCamera);
	            vrEffect.render(sceneHelpers, vrCamera);
	        } else {

	            renderer.render(scene, camera);

	            if (renderer instanceof THREE.RaytracingRenderer === false) {

	                renderer.render(sceneHelpers, camera);
	            }
	        }
	    }

	    requestAnimationFrame(animate);

	    return container;
	}

	/**
	* @author mrdoob / http://mrdoob.com/
	*/

	function Toolbar(editor) {

	    var signals = editor.signals;

	    var container = new UI.Panel();
	    container.setId('toolbar');

	    var buttons = new UI.Panel();
	    container.add(buttons);

	    // translate / rotate / scale

	    var translate = new UI.Button('移动');
	    translate.dom.title = 'W';
	    translate.dom.className = 'Button selected';
	    translate.onClick(function () {

	        signals.transformModeChanged.dispatch('translate');
	    });
	    buttons.add(translate);

	    var rotate = new UI.Button('旋转');
	    rotate.dom.title = 'E';
	    rotate.onClick(function () {

	        signals.transformModeChanged.dispatch('rotate');
	    });
	    buttons.add(rotate);

	    var scale = new UI.Button('缩放');
	    scale.dom.title = 'R';
	    scale.onClick(function () {

	        signals.transformModeChanged.dispatch('scale');
	    });
	    buttons.add(scale);

	    signals.transformModeChanged.add(function (mode) {

	        translate.dom.classList.remove('selected');
	        rotate.dom.classList.remove('selected');
	        scale.dom.classList.remove('selected');

	        switch (mode) {

	            case 'translate':
	                translate.dom.classList.add('selected');break;
	            case 'rotate':
	                rotate.dom.classList.add('selected');break;
	            case 'scale':
	                scale.dom.classList.add('selected');break;

	        }
	    });

	    // grid

	    var grid = new UI.Number(25).setWidth('40px').onChange(update);
	    buttons.add(new UI.Text('网格：'));
	    buttons.add(grid);

	    var snap = new UI.THREE.Boolean(false, '单元').onChange(update);
	    buttons.add(snap);

	    var local = new UI.THREE.Boolean(false, '本地').onChange(update);
	    buttons.add(local);

	    var showGrid = new UI.THREE.Boolean(true, '显示').onChange(update);
	    buttons.add(showGrid);

	    function update() {

	        signals.snapChanged.dispatch(snap.getValue() === true ? grid.getValue() : null);
	        signals.spaceChanged.dispatch(local.getValue() === true ? "本地" : "世界");
	        signals.showGridChanged.dispatch(showGrid.getValue());
	    }

	    return container;
	}

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	function AddMenu(editor) {

	    var container = new UI.Panel();
	    container.setClass('menu');

	    var title = new UI.Panel();
	    title.setClass('title');
	    title.setTextContent('添加');
	    container.add(title);

	    var options = new UI.Panel();
	    options.setClass('options');
	    container.add(options);

	    //

	    var meshCount = 0;
	    var lightCount = 0;
	    var cameraCount = 0;

	    editor.signals.editorCleared.add(function () {

	        meshCount = 0;
	        lightCount = 0;
	        cameraCount = 0;
	    });

	    // Group

	    var option = new UI.Row();
	    option.setClass('option');
	    option.setTextContent('组');
	    option.onClick(function () {

	        var mesh = new THREE.Group();
	        mesh.name = 'Group ' + ++meshCount;

	        editor.execute(new AddObjectCommand$1(mesh));
	    });
	    options.add(option);

	    //

	    options.add(new UI.HorizontalRule());

	    // Plane

	    var option = new UI.Row();
	    option.setClass('option');
	    option.setTextContent('平板');
	    option.onClick(function () {

	        var geometry = new THREE.PlaneBufferGeometry(2, 2);
	        var material = new THREE.MeshStandardMaterial();
	        var mesh = new THREE.Mesh(geometry, material);
	        mesh.name = 'Plane ' + ++meshCount;

	        editor.execute(new AddObjectCommand$1(mesh));
	    });
	    options.add(option);

	    // Box

	    var option = new UI.Row();
	    option.setClass('option');
	    option.setTextContent('正方体');
	    option.onClick(function () {

	        var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
	        var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
	        mesh.name = 'Box ' + ++meshCount;

	        editor.execute(new AddObjectCommand$1(mesh));
	    });
	    options.add(option);

	    // Circle

	    var option = new UI.Row();
	    option.setClass('option');
	    option.setTextContent('圆');
	    option.onClick(function () {

	        var radius = 1;
	        var segments = 32;

	        var geometry = new THREE.CircleBufferGeometry(radius, segments);
	        var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
	        mesh.name = 'Circle ' + ++meshCount;

	        editor.execute(new AddObjectCommand$1(mesh));
	    });
	    options.add(option);

	    // Cylinder

	    var option = new UI.Row();
	    option.setClass('option');
	    option.setTextContent('圆柱体');
	    option.onClick(function () {

	        var radiusTop = 1;
	        var radiusBottom = 1;
	        var height = 2;
	        var radiusSegments = 32;
	        var heightSegments = 1;
	        var openEnded = false;

	        var geometry = new THREE.CylinderBufferGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded);
	        var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
	        mesh.name = 'Cylinder ' + ++meshCount;

	        editor.execute(new AddObjectCommand$1(mesh));
	    });
	    options.add(option);

	    // Sphere

	    var option = new UI.Row();
	    option.setClass('option');
	    option.setTextContent('球体');
	    option.onClick(function () {

	        var radius = 1;
	        var widthSegments = 32;
	        var heightSegments = 16;
	        var phiStart = 0;
	        var phiLength = Math.PI * 2;
	        var thetaStart = 0;
	        var thetaLength = Math.PI;

	        var geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);
	        var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
	        mesh.name = 'Sphere ' + ++meshCount;

	        editor.execute(new AddObjectCommand$1(mesh));
	    });
	    options.add(option);

	    // Icosahedron

	    var option = new UI.Row();
	    option.setClass('option');
	    option.setTextContent('二十面体');
	    option.onClick(function () {

	        var radius = 1;
	        var detail = 2;

	        var geometry = new THREE.IcosahedronGeometry(radius, detail);
	        var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
	        mesh.name = 'Icosahedron ' + ++meshCount;

	        editor.execute(new AddObjectCommand$1(mesh));
	    });
	    options.add(option);

	    // Torus

	    var option = new UI.Row();
	    option.setClass('option');
	    option.setTextContent('圆环面');
	    option.onClick(function () {

	        var radius = 2;
	        var tube = 1;
	        var radialSegments = 32;
	        var tubularSegments = 12;
	        var arc = Math.PI * 2;

	        var geometry = new THREE.TorusBufferGeometry(radius, tube, radialSegments, tubularSegments, arc);
	        var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
	        mesh.name = 'Torus ' + ++meshCount;

	        editor.execute(new AddObjectCommand$1(mesh));
	    });
	    options.add(option);

	    // TorusKnot

	    var option = new UI.Row();
	    option.setClass('option');
	    option.setTextContent('环面扭结');
	    option.onClick(function () {

	        var radius = 2;
	        var tube = 0.8;
	        var tubularSegments = 64;
	        var radialSegments = 12;
	        var p = 2;
	        var q = 3;

	        var geometry = new THREE.TorusKnotBufferGeometry(radius, tube, tubularSegments, radialSegments, p, q);
	        var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
	        mesh.name = 'TorusKnot ' + ++meshCount;

	        editor.execute(new AddObjectCommand$1(mesh));
	    });
	    options.add(option);

	    /*// Teapot
	    var option = new UI.Row();
	    option.setClass( 'option' );
	    option.setTextContent( '茶壶' );
	    option.onClick( function () {
	    var size = 50;
	    var segments = 10;
	    var bottom = true;
	    var lid = true;
	    var body = true;
	    var fitLid = false;
	    var blinnScale = true;
	    var material = new THREE.MeshStandardMaterial();
	    var geometry = new THREE.TeapotBufferGeometry( size, segments, bottom, lid, body, fitLid, blinnScale );
	    var mesh = new THREE.Mesh( geometry, material );
	    mesh.name = 'Teapot ' + ( ++ meshCount );
	    editor.addObject( mesh );
	    editor.select( mesh );
	    } );
	    options.add( option );*/

	    // Lathe

	    var option = new UI.Row();
	    option.setClass('option');
	    option.setTextContent('花瓶');
	    option.onClick(function () {

	        var points = [new THREE.Vector2(0, 0), new THREE.Vector2(4, 0), new THREE.Vector2(3.5, 0.5), new THREE.Vector2(1, 0.75), new THREE.Vector2(0.8, 1), new THREE.Vector2(0.8, 4), new THREE.Vector2(1, 4.2), new THREE.Vector2(1.4, 4.8), new THREE.Vector2(2, 5), new THREE.Vector2(2.5, 5.4), new THREE.Vector2(3, 12)];
	        var segments = 20;
	        var phiStart = 0;
	        var phiLength = 2 * Math.PI;

	        var geometry = new THREE.LatheBufferGeometry(points, segments, phiStart, phiLength);
	        var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ side: THREE.DoubleSide }));
	        mesh.name = 'Lathe ' + ++meshCount;

	        editor.execute(new AddObjectCommand$1(mesh));
	    });
	    options.add(option);

	    // Sprite

	    var option = new UI.Row();
	    option.setClass('option');
	    option.setTextContent('精灵');
	    option.onClick(function () {

	        var sprite = new THREE.Sprite(new THREE.SpriteMaterial());
	        sprite.name = 'Sprite ' + ++meshCount;

	        editor.execute(new AddObjectCommand$1(sprite));
	    });
	    options.add(option);

	    //

	    options.add(new UI.HorizontalRule());

	    // PointLight

	    var option = new UI.Row();
	    option.setClass('option');
	    option.setTextContent('点光源');
	    option.onClick(function () {

	        var color = 0xffffff;
	        var intensity = 1;
	        var distance = 0;

	        var light = new THREE.PointLight(color, intensity, distance);
	        light.name = 'PointLight ' + ++lightCount;

	        editor.execute(new AddObjectCommand$1(light));
	    });
	    options.add(option);

	    // SpotLight

	    var option = new UI.Row();
	    option.setClass('option');
	    option.setTextContent('聚光灯');
	    option.onClick(function () {

	        var color = 0xffffff;
	        var intensity = 1;
	        var distance = 0;
	        var angle = Math.PI * 0.1;
	        var penumbra = 0;

	        var light = new THREE.SpotLight(color, intensity, distance, angle, penumbra);
	        light.name = 'SpotLight ' + ++lightCount;
	        light.target.name = 'SpotLight ' + lightCount + ' Target';

	        light.position.set(5, 10, 7.5);

	        editor.execute(new AddObjectCommand$1(light));
	    });
	    options.add(option);

	    // DirectionalLight

	    var option = new UI.Row();
	    option.setClass('option');
	    option.setTextContent('平行光源');
	    option.onClick(function () {

	        var color = 0xffffff;
	        var intensity = 1;

	        var light = new THREE.DirectionalLight(color, intensity);
	        light.name = 'DirectionalLight ' + ++lightCount;
	        light.target.name = 'DirectionalLight ' + lightCount + ' Target';

	        light.position.set(5, 10, 7.5);

	        editor.execute(new AddObjectCommand$1(light));
	    });
	    options.add(option);

	    // HemisphereLight

	    var option = new UI.Row();
	    option.setClass('option');
	    option.setTextContent('半球光');
	    option.onClick(function () {

	        var skyColor = 0x00aaff;
	        var groundColor = 0xffaa00;
	        var intensity = 1;

	        var light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
	        light.name = 'HemisphereLight ' + ++lightCount;

	        light.position.set(0, 10, 0);

	        editor.execute(new AddObjectCommand$1(light));
	    });
	    options.add(option);

	    // AmbientLight

	    var option = new UI.Row();
	    option.setClass('option');
	    option.setTextContent('环境光');
	    option.onClick(function () {

	        var color = 0x222222;

	        var light = new THREE.AmbientLight(color);
	        light.name = 'AmbientLight ' + ++lightCount;

	        editor.execute(new AddObjectCommand$1(light));
	    });
	    options.add(option);

	    //

	    options.add(new UI.HorizontalRule());

	    // PerspectiveCamera

	    var option = new UI.Row();
	    option.setClass('option');
	    option.setTextContent('透视相机');
	    option.onClick(function () {

	        var camera = new THREE.PerspectiveCamera(50, 1, 1, 10000);
	        camera.name = 'PerspectiveCamera ' + ++cameraCount;

	        editor.execute(new AddObjectCommand$1(camera));
	    });
	    options.add(option);

	    return container;
	}

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	function EditMenu(editor) {

	    var container = new UI.Panel();
	    container.setClass('menu');

	    var title = new UI.Panel();
	    title.setClass('title');
	    title.setTextContent('编辑');
	    container.add(title);

	    var options = new UI.Panel();
	    options.setClass('options');
	    container.add(options);

	    // Undo

	    var undo = new UI.Row();
	    undo.setClass('option');
	    undo.setTextContent('撤销(Ctrl+Z)');
	    undo.onClick(function () {

	        editor.undo();
	    });
	    options.add(undo);

	    // Redo

	    var redo = new UI.Row();
	    redo.setClass('option');
	    redo.setTextContent('重做(Ctrl+Shift+Z)');
	    redo.onClick(function () {

	        editor.redo();
	    });
	    options.add(redo);

	    // Clear History

	    var option = new UI.Row();
	    option.setClass('option');
	    option.setTextContent('清空历史记录');
	    option.onClick(function () {

	        if (confirm('撤销/重做历史纪录将被清空。确定吗？')) {

	            editor.history.clear();
	        }
	    });
	    options.add(option);

	    editor.signals.historyChanged.add(function () {

	        var history = editor.history;

	        undo.setClass('option');
	        redo.setClass('option');

	        if (history.undos.length == 0) {

	            undo.setClass('inactive');
	        }

	        if (history.redos.length == 0) {

	            redo.setClass('inactive');
	        }
	    });

	    // ---

	    options.add(new UI.HorizontalRule());

	    // Clone

	    var option = new UI.Row();
	    option.setClass('option');
	    option.setTextContent('复制');
	    option.onClick(function () {

	        var object = editor.selected;

	        if (object.parent === null) return; // avoid cloning the camera or scene

	        object = object.clone();

	        editor.execute(new AddObjectCommand$1(object));
	    });
	    options.add(option);

	    // Delete

	    var option = new UI.Row();
	    option.setClass('option');
	    option.setTextContent('删除(Del)');
	    option.onClick(function () {

	        var object = editor.selected;

	        if (confirm('Delete ' + object.name + '?') === false) return;

	        var parent = object.parent;
	        if (parent === undefined) return; // avoid deleting the camera or scene

	        editor.execute(new RemoveObjectCommand$1(object));
	    });
	    options.add(option);

	    // Minify shaders

	    var option = new UI.Row();
	    option.setClass('option');
	    option.setTextContent('清除着色');
	    option.onClick(function () {

	        var root = editor.selected || editor.scene;

	        var errors = [];
	        var nMaterialsChanged = 0;

	        var path = [];

	        function getPath(object) {

	            path.length = 0;

	            var parent = object.parent;
	            if (parent !== undefined) getPath(parent);

	            path.push(object.name || object.uuid);

	            return path;
	        }

	        var cmds = [];
	        root.traverse(function (object) {

	            var material = object.material;

	            if (material instanceof THREE.ShaderMaterial) {

	                try {

	                    var shader = glslprep.minifyGlsl([material.vertexShader, material.fragmentShader]);

	                    cmds.push(new SetMaterialValueCommand$1(object, 'vertexShader', shader[0]));
	                    cmds.push(new SetMaterialValueCommand$1(object, 'fragmentShader', shader[1]));

	                    ++nMaterialsChanged;
	                } catch (e) {

	                    var path = getPath(object).join("/");

	                    if (e instanceof glslprep.SyntaxError) errors.push(path + ":" + e.line + ":" + e.column + ": " + e.message);else {

	                        errors.push(path + "： 未预料到的错误(详情请见控制台)。");

	                        console.error(e.stack || e);
	                    }
	                }
	            }
	        });

	        if (nMaterialsChanged > 0) {

	            editor.execute(new MultiCmdsCommand(cmds), 'Minify Shaders');
	        }

	        window.alert(nMaterialsChanged + "材质已经改变。\n" + errors.join("\n"));
	    });
	    options.add(option);

	    return container;
	}

	/**
	* @author mrdoob / http://mrdoob.com/
	*/

	function ExampleMenu(editor) {

	    var container = new UI.Panel();
	    container.setClass('menu');

	    var title = new UI.Panel();
	    title.setClass('title');
	    title.setTextContent('示例');
	    container.add(title);

	    var options = new UI.Panel();
	    options.setClass('options');
	    container.add(options);

	    // Examples

	    var items = [{ title: '打砖块', file: 'arkanoid.app.json' }, { title: '相机', file: 'camera.app.json' }, { title: '粒子', file: 'particles.app.json' }, { title: '乒乓球', file: 'pong.app.json' }];

	    var loader = new THREE.FileLoader();

	    for (var i = 0; i < items.length; i++) {

	        (function (i) {

	            var item = items[i];

	            var option = new UI.Row();
	            option.setClass('option');
	            option.setTextContent(item.title);
	            option.onClick(function () {

	                if (confirm('任何未保存数据将丢失。确定吗？')) {

	                    loader.load('examples/' + item.file, function (text) {

	                        editor.clear();
	                        editor.fromJSON(JSON.parse(text));
	                    });
	                }
	            });
	            options.add(option);
	        })(i);
	    }

	    return container;
	}

	/**
	* @author mrdoob / http://mrdoob.com/
	*/

	function FileMenu(editor) {

	        var NUMBER_PRECISION = 6;

	        function parseNumber(key, value) {

	                return typeof value === 'number' ? parseFloat(value.toFixed(NUMBER_PRECISION)) : value;
	        }

	        //

	        var container = new UI.Panel();
	        container.setClass('menu');

	        var title = new UI.Panel();
	        title.setClass('title');
	        title.setTextContent('文件');
	        container.add(title);

	        var options = new UI.Panel();
	        options.setClass('options');
	        container.add(options);

	        // New

	        var option = new UI.Row();
	        option.setClass('option');
	        option.setTextContent('新建');
	        option.onClick(function () {

	                if (confirm('所有未保存数据将丢失，确定吗？')) {

	                        editor.clear();
	                }
	        });
	        options.add(option);

	        //

	        options.add(new UI.HorizontalRule());

	        // Import

	        var fileInput = document.createElement('input');
	        fileInput.type = 'file';
	        fileInput.addEventListener('change', function (event) {

	                editor.loader.loadFile(fileInput.files[0]);
	        });

	        var option = new UI.Row();
	        option.setClass('option');
	        option.setTextContent('导入');
	        option.onClick(function () {

	                fileInput.click();
	        });
	        options.add(option);

	        //

	        options.add(new UI.HorizontalRule());

	        // Export Geometry

	        var option = new UI.Row();
	        option.setClass('option');
	        option.setTextContent('导出几何体');
	        option.onClick(function () {

	                var object = editor.selected;

	                if (object === null) {

	                        alert('请选择物体');
	                        return;
	                }

	                var geometry = object.geometry;

	                if (geometry === undefined) {

	                        alert('选中的对象不具有几何属性。');
	                        return;
	                }

	                var output = geometry.toJSON();

	                try {

	                        output = JSON.stringify(output, parseNumber, '\t');
	                        output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
	                } catch (e) {

	                        output = JSON.stringify(output);
	                }

	                saveString(output, 'geometry.json');
	        });
	        options.add(option);

	        // Export Object

	        var option = new UI.Row();
	        option.setClass('option');
	        option.setTextContent('导出对象');
	        option.onClick(function () {

	                var object = editor.selected;

	                if (object === null) {

	                        alert('请选择对象');
	                        return;
	                }

	                var output = object.toJSON();

	                try {

	                        output = JSON.stringify(output, parseNumber, '\t');
	                        output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
	                } catch (e) {

	                        output = JSON.stringify(output);
	                }

	                saveString(output, 'model.json');
	        });
	        options.add(option);

	        // Export Scene

	        var option = new UI.Row();
	        option.setClass('option');
	        option.setTextContent('导出场景');
	        option.onClick(function () {

	                var output = editor.scene.toJSON();

	                try {

	                        output = JSON.stringify(output, parseNumber, '\t');
	                        output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
	                } catch (e) {

	                        output = JSON.stringify(output);
	                }

	                saveString(output, 'scene.json');
	        });
	        options.add(option);

	        // Export OBJ

	        var option = new UI.Row();
	        option.setClass('option');
	        option.setTextContent('导出OBJ');
	        option.onClick(function () {

	                var object = editor.selected;

	                if (object === null) {

	                        alert('请选择对象');
	                        return;
	                }

	                var exporter = new THREE.OBJExporter();

	                saveString(exporter.parse(object), 'model.obj');
	        });
	        options.add(option);

	        // Export STL

	        var option = new UI.Row();
	        option.setClass('option');
	        option.setTextContent('导出STL');
	        option.onClick(function () {

	                var exporter = new THREE.STLExporter();

	                saveString(exporter.parse(editor.scene), 'model.stl');
	        });
	        options.add(option);

	        //

	        options.add(new UI.HorizontalRule());

	        // Publish

	        var option = new UI.Row();
	        option.setClass('option');
	        option.setTextContent('发布');
	        option.onClick(function () {

	                var zip = new JSZip();

	                //

	                var output = editor.toJSON();
	                output.metadata.type = 'App';
	                delete output.history;

	                var vr = output.project.vr;

	                output = JSON.stringify(output, parseNumber, '\t');
	                output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

	                zip.file('app.json', output);

	                //

	                var manager = new THREE.LoadingManager(function () {

	                        save(zip.generate({ type: 'blob' }), 'download.zip');
	                });

	                var loader = new THREE.FileLoader(manager);
	                loader.load('js/libs/app/index.html', function (content) {

	                        var includes = [];

	                        if (vr) {

	                                includes.push('<script src="js/VRControls.js"></script>');
	                                includes.push('<script src="js/VREffect.js"></script>');
	                                includes.push('<script src="js/WebVR.js"></script>');
	                        }

	                        content = content.replace('<!-- includes -->', includes.join('\n\t\t'));

	                        zip.file('index.html', content);
	                });
	                loader.load('js/libs/app.js', function (content) {

	                        zip.file('js/app.js', content);
	                });
	                loader.load('../build/three.min.js', function (content) {

	                        zip.file('js/three.min.js', content);
	                });

	                if (vr) {

	                        loader.load('../js/controls/VRControls.js', function (content) {

	                                zip.file('js/VRControls.js', content);
	                        });

	                        loader.load('../js/effects/VREffect.js', function (content) {

	                                zip.file('js/VREffect.js', content);
	                        });

	                        loader.load('../js/WebVR.js', function (content) {

	                                zip.file('js/WebVR.js', content);
	                        });
	                }
	        });
	        options.add(option);

	        /*
	        // Publish (Dropbox)
	        var option = new UI.Row();
	        option.setClass( 'option' );
	        option.setTextContent( 'Publish (Dropbox)' );
	        option.onClick( function () {
	        var parameters = {
	        files: [
	        { 'url': 'data:text/plain;base64,' + window.btoa( "Hello, World" ), 'filename': 'app/test.txt' }
	        ]
	        };
	        Dropbox.save( parameters );
	        } );
	        options.add( option );
	        */

	        //

	        var link = document.createElement('a');
	        link.style.display = 'none';
	        document.body.appendChild(link); // Firefox workaround, see #6594

	        function save(blob, filename) {

	                link.href = URL.createObjectURL(blob);
	                link.download = filename || 'data.json';
	                link.click();

	                // URL.revokeObjectURL( url ); breaks Firefox...
	        }

	        function saveString(text, filename) {

	                save(new Blob([text], { type: 'text/plain' }), filename);
	        }

	        return container;
	}

	/**
	* @author mrdoob / http://mrdoob.com/
	*/

	function HelpMenu(editor) {

	    var container = new UI.Panel();
	    container.setClass('menu');

	    var title = new UI.Panel();
	    title.setClass('title');
	    title.setTextContent('帮助');
	    container.add(title);

	    var options = new UI.Panel();
	    options.setClass('options');
	    container.add(options);

	    // Source code

	    var option = new UI.Row();
	    option.setClass('option');
	    option.setTextContent('源码');
	    option.onClick(function () {

	        window.open('https://github.com/mrdoob/three.js/tree/master/editor', '_blank');
	    });
	    options.add(option);

	    // About

	    var option = new UI.Row();
	    option.setClass('option');
	    option.setTextContent('关于');
	    option.onClick(function () {

	        window.open('http://threejs.org', '_blank');
	    });
	    options.add(option);

	    return container;
	}

	/**
	* @author mrdoob / http://mrdoob.com/
	*/

	function PlayMenu(editor) {

	    var signals = editor.signals;

	    var container = new UI.Panel();
	    container.setClass('menu');

	    var isPlaying = false;

	    var title = new UI.Panel();
	    title.setClass('title');
	    title.setTextContent('启动');
	    title.onClick(function () {

	        if (isPlaying === false) {

	            isPlaying = true;
	            title.setTextContent('停止');
	            signals.startPlayer.dispatch();
	        } else {

	            isPlaying = false;
	            title.setTextContent('启动');
	            signals.stopPlayer.dispatch();
	        }
	    });
	    container.add(title);

	    return container;
	}

	/**
	* @author mrdoob / http://mrdoob.com/
	*/

	function StatusMenu(editor) {

	    var container = new UI.Panel();
	    container.setClass('menu right');

	    var autosave = new UI.THREE.Boolean(editor.config.getKey('autosave'), '自动保存');
	    autosave.text.setColor('#888');
	    autosave.onChange(function () {

	        var value = this.getValue();

	        editor.config.setKey('autosave', value);

	        if (value === true) {

	            editor.signals.sceneGraphChanged.dispatch();
	        }
	    });
	    container.add(autosave);

	    editor.signals.savingStarted.add(function () {

	        autosave.text.setTextDecoration('underline');
	    });

	    editor.signals.savingFinished.add(function () {

	        autosave.text.setTextDecoration('none');
	    });

	    var version = new UI.Text('r' + THREE.REVISION);
	    version.setClass('title');
	    version.setOpacity(0.5);
	    container.add(version);

	    return container;
	}

	/**
	* @author mrdoob / http://mrdoob.com/
	*/

	function ViewMenu(editor) {

	    var container = new UI.Panel();
	    container.setClass('menu');

	    var title = new UI.Panel();
	    title.setClass('title');
	    title.setTextContent('视图');
	    container.add(title);

	    var options = new UI.Panel();
	    options.setClass('options');
	    container.add(options);

	    // VR mode

	    var option = new UI.Row();
	    option.setClass('option');
	    option.setTextContent('VR模式');
	    option.onClick(function () {

	        if (renderer.vr.enabled) {

	            editor.signals.enterVR.dispatch();
	        } else {

	            alert('WebVR不可用');
	        }
	    });
	    options.add(option);

	    return container;
	}

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	function Menubar(editor) {

	    var container = new UI.Panel();
	    container.setId('menubar');

	    container.add(new FileMenu(editor));
	    container.add(new EditMenu(editor));
	    container.add(new AddMenu(editor));
	    container.add(new PlayMenu(editor));
	    container.add(new ViewMenu(editor));
	    container.add(new ExampleMenu(editor));
	    container.add(new HelpMenu(editor));

	    container.add(new StatusMenu(editor));

	    return container;
	}

	/**
	* @author mrdoob / http://mrdoob.com/
	*/

	function AnimationPanel(editor) {

		var signals = editor.signals;

		var container = new UI.Panel();
		container.setDisplay('none');

		container.add(new UI.Text('动画'));
		container.add(new UI.Break());
		container.add(new UI.Break());

		var animationsRow = new UI.Row();
		container.add(animationsRow);

		/*
	 var animations = {};
	 signals.objectAdded.add( function ( object ) {
	 object.traverse( function ( child ) {
	 	if ( child instanceof THREE.SkinnedMesh ) {
	 		var material = child.material;
	 		if ( material instanceof THREE.MultiMaterial ) {
	 			for ( var i = 0; i < material.materials.length; i ++ ) {
	 				material.materials[ i ].skinning = true;
	 			}
	 		} else {
	 			child.material.skinning = true;
	 		}
	 		animations[ child.id ] = new THREE.Animation( child, child.geometry.animation );
	 	} else if ( child instanceof THREE.MorphAnimMesh ) {
	 		var animation = new THREE.MorphAnimation( child );
	 animation.duration = 30;
	 		// temporal hack for THREE.AnimationHandler
	 animation._play = animation.play;
	 animation.play = function () {
	 	this._play();
	 	THREE.AnimationHandler.play( this );
	 };
	 animation.resetBlendWeights = function () {};
	 animation.stop = function () {
	 	this.pause();
	 	THREE.AnimationHandler.stop( this );
	 };
	 		animations[ child.id ] = animation;
	 	}
	 } );
	 } );
	 signals.objectSelected.add( function ( object ) {
	 container.setDisplay( 'none' );
	 if ( object instanceof THREE.SkinnedMesh || object instanceof THREE.MorphAnimMesh ) {
	 	animationsRow.clear();
	 	var animation = animations[ object.id ];
	 	var playButton = new UI.Button( 'Play' ).onClick( function () {
	 		animation.play();
	 	} );
	 animationsRow.add( playButton );
	 	var pauseButton = new UI.Button( 'Stop' ).onClick( function () {
	 		animation.stop();
	 	} );
	 animationsRow.add( pauseButton );
	 	container.setDisplay( 'block' );
	 }
	 } );
	 */

		return container;
	}

	/**
	* @author dforrer / https://github.com/dforrer
	* Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
	*/

	function HistoryPanel(editor) {

	    var signals = editor.signals;

	    var config = editor.config;

	    var history = editor.history;

	    var container = new UI.Panel();

	    container.add(new UI.Text('历史记录'));

	    //

	    var persistent = new UI.THREE.Boolean(config.getKey('settings/history'), '永久');
	    persistent.setPosition('absolute').setRight('8px');
	    persistent.onChange(function () {

	        var value = this.getValue();

	        config.setKey('settings/history', value);

	        if (value) {

	            alert('历史记录将被保存在会话中。\n这会对使用材质的性能产生影响。');

	            var lastUndoCmd = history.undos[history.undos.length - 1];
	            var lastUndoId = lastUndoCmd !== undefined ? lastUndoCmd.id : 0;
	            editor.history.enableSerialization(lastUndoId);
	        } else {

	            signals.historyChanged.dispatch();
	        }
	    });
	    container.add(persistent);

	    container.add(new UI.Break(), new UI.Break());

	    var outliner = new UI.Outliner(editor);
	    outliner.onChange(function () {

	        editor.history.goToState(parseInt(outliner.getValue()));
	    });
	    container.add(outliner);

	    //

	    var refreshUI = function refreshUI() {

	        var options = [];

	        function buildOption(object) {

	            var option = document.createElement('div');
	            option.value = object.id;

	            return option;
	        }

	        (function addObjects(objects) {

	            for (var i = 0, l = objects.length; i < l; i++) {

	                var object = objects[i];

	                var option = buildOption(object);
	                option.innerHTML = '&nbsp;' + object.name;

	                options.push(option);
	            }
	        })(history.undos);

	        (function addObjects(objects, pad) {

	            for (var i = objects.length - 1; i >= 0; i--) {

	                var object = objects[i];

	                var option = buildOption(object);
	                option.innerHTML = '&nbsp;' + object.name;
	                option.style.opacity = 0.3;

	                options.push(option);
	            }
	        })(history.redos, '&nbsp;');

	        outliner.setOptions(options);
	    };

	    refreshUI();

	    // events

	    signals.editorCleared.add(refreshUI);

	    signals.historyChanged.add(refreshUI);
	    signals.historyChanged.add(function (cmd) {

	        outliner.setValue(cmd !== undefined ? cmd.id : null);
	    });

	    return container;
	}

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	function MaterialPanel(editor) {

	    var signals = editor.signals;
	    var currentObject;

	    var container = new UI.Panel();
	    container.setBorderTop('0');
	    container.setPaddingTop('20px');

	    // New / Copy / Paste

	    var copiedMaterial;
	    var managerRow = new UI.Row();

	    managerRow.add(new UI.Text('').setWidth('90px'));
	    managerRow.add(new UI.Button('新建').onClick(function () {

	        var material = new THREE[materialClass.getValue()]();
	        editor.execute(new SetMaterialCommand(currentObject, material), '新材质：' + materialClass.getValue());
	        update();
	    }));

	    managerRow.add(new UI.Button('复制').setMarginLeft('4px').onClick(function () {

	        copiedMaterial = currentObject.material;
	    }));

	    managerRow.add(new UI.Button('粘贴').setMarginLeft('4px').onClick(function () {

	        if (copiedMaterial === undefined) return;

	        editor.execute(new SetMaterialCommand(currentObject, copiedMaterial), '粘贴材质：' + materialClass.getValue());
	        refreshUI();
	        update();
	    }));

	    container.add(managerRow);

	    // type

	    var materialClassRow = new UI.Row();
	    var materialClass = new UI.Select().setOptions({

	        'LineBasicMaterial': '线条材质',
	        'LineDashedMaterial': '虚线材质',
	        'MeshBasicMaterial': '基本材质',
	        'MeshDepthMaterial': '深度材质',
	        'MeshNormalMaterial': '法向量材质',
	        'MeshLambertMaterial': '兰伯特材质',
	        'MeshPhongMaterial': '冯氏材质',
	        'PointCloudMaterial': '点云材质',
	        'MeshStandardMaterial': '标准材质',
	        'MeshPhysicalMaterial': '物理材质',
	        'ShaderMaterial': '着色器材质',
	        'SpriteMaterial': '精灵材质'

	    }).setWidth('150px').setFontSize('12px').onChange(update);

	    materialClassRow.add(new UI.Text('类型').setWidth('90px'));
	    materialClassRow.add(materialClass);

	    container.add(materialClassRow);

	    // uuid

	    var materialUUIDRow = new UI.Row();
	    var materialUUID = new UI.Input().setWidth('102px').setFontSize('12px').setDisabled(true);
	    var materialUUIDRenew = new UI.Button('新建').setMarginLeft('7px').onClick(function () {

	        materialUUID.setValue(THREE.Math.generateUUID());
	        update();
	    });

	    materialUUIDRow.add(new UI.Text('UUID').setWidth('90px'));
	    materialUUIDRow.add(materialUUID);
	    materialUUIDRow.add(materialUUIDRenew);

	    container.add(materialUUIDRow);

	    // name

	    var materialNameRow = new UI.Row();
	    var materialName = new UI.Input().setWidth('150px').setFontSize('12px').onChange(function () {

	        editor.execute(new SetMaterialValueCommand$1(editor.selected, 'name', materialName.getValue()));
	    });

	    materialNameRow.add(new UI.Text('名称').setWidth('90px'));
	    materialNameRow.add(materialName);

	    container.add(materialNameRow);

	    // program

	    var materialProgramRow = new UI.Row();
	    materialProgramRow.add(new UI.Text('着色器程序').setWidth('90px'));

	    var materialProgramInfo = new UI.Button('Info');
	    materialProgramInfo.setMarginLeft('4px');
	    materialProgramInfo.onClick(function () {

	        signals.editScript.dispatch(currentObject, 'programInfo');
	    });
	    materialProgramRow.add(materialProgramInfo);

	    var materialProgramVertex = new UI.Button('顶点着色器');
	    materialProgramVertex.setMarginLeft('4px');
	    materialProgramVertex.onClick(function () {

	        signals.editScript.dispatch(currentObject, 'vertexShader');
	    });
	    materialProgramRow.add(materialProgramVertex);

	    var materialProgramFragment = new UI.Button('片源着色器');
	    materialProgramFragment.setMarginLeft('4px');
	    materialProgramFragment.onClick(function () {

	        signals.editScript.dispatch(currentObject, 'fragmentShader');
	    });
	    materialProgramRow.add(materialProgramFragment);

	    container.add(materialProgramRow);

	    // color

	    var materialColorRow = new UI.Row();
	    var materialColor = new UI.Color().onChange(update);

	    materialColorRow.add(new UI.Text('颜色').setWidth('90px'));
	    materialColorRow.add(materialColor);

	    container.add(materialColorRow);

	    // roughness

	    var materialRoughnessRow = new UI.Row();
	    var materialRoughness = new UI.Number(0.5).setWidth('60px').setRange(0, 1).onChange(update);

	    materialRoughnessRow.add(new UI.Text('粗糙度').setWidth('90px'));
	    materialRoughnessRow.add(materialRoughness);

	    container.add(materialRoughnessRow);

	    // metalness

	    var materialMetalnessRow = new UI.Row();
	    var materialMetalness = new UI.Number(0.5).setWidth('60px').setRange(0, 1).onChange(update);

	    materialMetalnessRow.add(new UI.Text('金属度').setWidth('90px'));
	    materialMetalnessRow.add(materialMetalness);

	    container.add(materialMetalnessRow);

	    // emissive

	    var materialEmissiveRow = new UI.Row();
	    var materialEmissive = new UI.Color().setHexValue(0x000000).onChange(update);

	    materialEmissiveRow.add(new UI.Text('放射性').setWidth('90px'));
	    materialEmissiveRow.add(materialEmissive);

	    container.add(materialEmissiveRow);

	    // specular

	    var materialSpecularRow = new UI.Row();
	    var materialSpecular = new UI.Color().setHexValue(0x111111).onChange(update);

	    materialSpecularRow.add(new UI.Text('镜面度').setWidth('90px'));
	    materialSpecularRow.add(materialSpecular);

	    container.add(materialSpecularRow);

	    // shininess

	    var materialShininessRow = new UI.Row();
	    var materialShininess = new UI.Number(30).onChange(update);

	    materialShininessRow.add(new UI.Text('光亮度').setWidth('90px'));
	    materialShininessRow.add(materialShininess);

	    container.add(materialShininessRow);

	    // clearCoat

	    var materialClearCoatRow = new UI.Row();
	    var materialClearCoat = new UI.Number(1).setWidth('60px').setRange(0, 1).onChange(update);

	    materialClearCoatRow.add(new UI.Text('透明度').setWidth('90px'));
	    materialClearCoatRow.add(materialClearCoat);

	    container.add(materialClearCoatRow);

	    // clearCoatRoughness

	    var materialClearCoatRoughnessRow = new UI.Row();
	    var materialClearCoatRoughness = new UI.Number(1).setWidth('60px').setRange(0, 1).onChange(update);

	    materialClearCoatRoughnessRow.add(new UI.Text('透明粗糙度').setWidth('90px'));
	    materialClearCoatRoughnessRow.add(materialClearCoatRoughness);

	    container.add(materialClearCoatRoughnessRow);

	    // vertex colors

	    var materialVertexColorsRow = new UI.Row();
	    var materialVertexColors = new UI.Select().setOptions({

	        0: '无',
	        1: '面',
	        2: '顶点'

	    }).onChange(update);

	    materialVertexColorsRow.add(new UI.Text('顶点颜色').setWidth('90px'));
	    materialVertexColorsRow.add(materialVertexColors);

	    container.add(materialVertexColorsRow);

	    // skinning

	    var materialSkinningRow = new UI.Row();
	    var materialSkinning = new UI.Checkbox(false).onChange(update);

	    materialSkinningRow.add(new UI.Text('皮肤').setWidth('90px'));
	    materialSkinningRow.add(materialSkinning);

	    container.add(materialSkinningRow);

	    // map

	    var materialMapRow = new UI.Row();
	    var materialMapEnabled = new UI.Checkbox(false).onChange(update);
	    var materialMap = new UI.Texture().onChange(update);

	    materialMapRow.add(new UI.Text('纹理').setWidth('90px'));
	    materialMapRow.add(materialMapEnabled);
	    materialMapRow.add(materialMap);

	    container.add(materialMapRow);

	    // alpha map

	    var materialAlphaMapRow = new UI.Row();
	    var materialAlphaMapEnabled = new UI.Checkbox(false).onChange(update);
	    var materialAlphaMap = new UI.Texture().onChange(update);

	    materialAlphaMapRow.add(new UI.Text('透明纹理').setWidth('90px'));
	    materialAlphaMapRow.add(materialAlphaMapEnabled);
	    materialAlphaMapRow.add(materialAlphaMap);

	    container.add(materialAlphaMapRow);

	    // bump map

	    var materialBumpMapRow = new UI.Row();
	    var materialBumpMapEnabled = new UI.Checkbox(false).onChange(update);
	    var materialBumpMap = new UI.Texture().onChange(update);
	    var materialBumpScale = new UI.Number(1).setWidth('30px').onChange(update);

	    materialBumpMapRow.add(new UI.Text('凹凸纹理').setWidth('90px'));
	    materialBumpMapRow.add(materialBumpMapEnabled);
	    materialBumpMapRow.add(materialBumpMap);
	    materialBumpMapRow.add(materialBumpScale);

	    container.add(materialBumpMapRow);

	    // normal map

	    var materialNormalMapRow = new UI.Row();
	    var materialNormalMapEnabled = new UI.Checkbox(false).onChange(update);
	    var materialNormalMap = new UI.Texture().onChange(update);

	    materialNormalMapRow.add(new UI.Text('法线纹理').setWidth('90px'));
	    materialNormalMapRow.add(materialNormalMapEnabled);
	    materialNormalMapRow.add(materialNormalMap);

	    container.add(materialNormalMapRow);

	    // displacement map

	    var materialDisplacementMapRow = new UI.Row();
	    var materialDisplacementMapEnabled = new UI.Checkbox(false).onChange(update);
	    var materialDisplacementMap = new UI.Texture().onChange(update);
	    var materialDisplacementScale = new UI.Number(1).setWidth('30px').onChange(update);

	    materialDisplacementMapRow.add(new UI.Text('位移纹理').setWidth('90px'));
	    materialDisplacementMapRow.add(materialDisplacementMapEnabled);
	    materialDisplacementMapRow.add(materialDisplacementMap);
	    materialDisplacementMapRow.add(materialDisplacementScale);

	    container.add(materialDisplacementMapRow);

	    // roughness map

	    var materialRoughnessMapRow = new UI.Row();
	    var materialRoughnessMapEnabled = new UI.Checkbox(false).onChange(update);
	    var materialRoughnessMap = new UI.Texture().onChange(update);

	    materialRoughnessMapRow.add(new UI.Text('粗糙纹理').setWidth('90px'));
	    materialRoughnessMapRow.add(materialRoughnessMapEnabled);
	    materialRoughnessMapRow.add(materialRoughnessMap);

	    container.add(materialRoughnessMapRow);

	    // metalness map

	    var materialMetalnessMapRow = new UI.Row();
	    var materialMetalnessMapEnabled = new UI.Checkbox(false).onChange(update);
	    var materialMetalnessMap = new UI.Texture().onChange(update);

	    materialMetalnessMapRow.add(new UI.Text('金属纹理').setWidth('90px'));
	    materialMetalnessMapRow.add(materialMetalnessMapEnabled);
	    materialMetalnessMapRow.add(materialMetalnessMap);

	    container.add(materialMetalnessMapRow);

	    // specular map

	    var materialSpecularMapRow = new UI.Row();
	    var materialSpecularMapEnabled = new UI.Checkbox(false).onChange(update);
	    var materialSpecularMap = new UI.Texture().onChange(update);

	    materialSpecularMapRow.add(new UI.Text('镜面纹理').setWidth('90px'));
	    materialSpecularMapRow.add(materialSpecularMapEnabled);
	    materialSpecularMapRow.add(materialSpecularMap);

	    container.add(materialSpecularMapRow);

	    // env map

	    var materialEnvMapRow = new UI.Row();
	    var materialEnvMapEnabled = new UI.Checkbox(false).onChange(update);
	    var materialEnvMap = new UI.Texture(THREE.SphericalReflectionMapping).onChange(update);
	    var materialReflectivity = new UI.Number(1).setWidth('30px').onChange(update);

	    materialEnvMapRow.add(new UI.Text('环境纹理').setWidth('90px'));
	    materialEnvMapRow.add(materialEnvMapEnabled);
	    materialEnvMapRow.add(materialEnvMap);
	    materialEnvMapRow.add(materialReflectivity);

	    container.add(materialEnvMapRow);

	    // light map

	    var materialLightMapRow = new UI.Row();
	    var materialLightMapEnabled = new UI.Checkbox(false).onChange(update);
	    var materialLightMap = new UI.Texture().onChange(update);

	    materialLightMapRow.add(new UI.Text('光照纹理').setWidth('90px'));
	    materialLightMapRow.add(materialLightMapEnabled);
	    materialLightMapRow.add(materialLightMap);

	    container.add(materialLightMapRow);

	    // ambient occlusion map

	    var materialAOMapRow = new UI.Row();
	    var materialAOMapEnabled = new UI.Checkbox(false).onChange(update);
	    var materialAOMap = new UI.Texture().onChange(update);
	    var materialAOScale = new UI.Number(1).setRange(0, 1).setWidth('30px').onChange(update);

	    materialAOMapRow.add(new UI.Text('遮挡纹理').setWidth('90px'));
	    materialAOMapRow.add(materialAOMapEnabled);
	    materialAOMapRow.add(materialAOMap);
	    materialAOMapRow.add(materialAOScale);

	    container.add(materialAOMapRow);

	    // emissive map

	    var materialEmissiveMapRow = new UI.Row();
	    var materialEmissiveMapEnabled = new UI.Checkbox(false).onChange(update);
	    var materialEmissiveMap = new UI.Texture().onChange(update);

	    materialEmissiveMapRow.add(new UI.Text('放射纹理').setWidth('90px'));
	    materialEmissiveMapRow.add(materialEmissiveMapEnabled);
	    materialEmissiveMapRow.add(materialEmissiveMap);

	    container.add(materialEmissiveMapRow);

	    // side

	    var materialSideRow = new UI.Row();
	    var materialSide = new UI.Select().setOptions({

	        0: '正面',
	        1: '反面',
	        2: '双面'

	    }).setWidth('150px').setFontSize('12px').onChange(update);

	    materialSideRow.add(new UI.Text('边').setWidth('90px'));
	    materialSideRow.add(materialSide);

	    container.add(materialSideRow);

	    // shading

	    var materialShadingRow = new UI.Row();
	    var materialShading = new UI.Select().setOptions({

	        0: '无',
	        1: '平坦',
	        2: '光滑'

	    }).setWidth('150px').setFontSize('12px').onChange(update);

	    materialShadingRow.add(new UI.Text('着色').setWidth('90px'));
	    materialShadingRow.add(materialShading);

	    container.add(materialShadingRow);

	    // blending

	    var materialBlendingRow = new UI.Row();
	    var materialBlending = new UI.Select().setOptions({

	        0: '不混合',
	        1: '一般混合',
	        2: '和混合',
	        3: '差混合',
	        4: '积混合',
	        5: '自定义混合'

	    }).setWidth('150px').setFontSize('12px').onChange(update);

	    materialBlendingRow.add(new UI.Text('混合').setWidth('90px'));
	    materialBlendingRow.add(materialBlending);

	    container.add(materialBlendingRow);

	    // opacity

	    var materialOpacityRow = new UI.Row();
	    var materialOpacity = new UI.Number(1).setWidth('60px').setRange(0, 1).onChange(update);

	    materialOpacityRow.add(new UI.Text('不透明度').setWidth('90px'));
	    materialOpacityRow.add(materialOpacity);

	    container.add(materialOpacityRow);

	    // transparent

	    var materialTransparentRow = new UI.Row();
	    var materialTransparent = new UI.Checkbox().setLeft('100px').onChange(update);

	    materialTransparentRow.add(new UI.Text('透明').setWidth('90px'));
	    materialTransparentRow.add(materialTransparent);

	    container.add(materialTransparentRow);

	    // alpha test

	    var materialAlphaTestRow = new UI.Row();
	    var materialAlphaTest = new UI.Number().setWidth('60px').setRange(0, 1).onChange(update);

	    materialAlphaTestRow.add(new UI.Text('α测试').setWidth('90px'));
	    materialAlphaTestRow.add(materialAlphaTest);

	    container.add(materialAlphaTestRow);

	    // wireframe

	    var materialWireframeRow = new UI.Row();
	    var materialWireframe = new UI.Checkbox(false).onChange(update);
	    var materialWireframeLinewidth = new UI.Number(1).setWidth('60px').setRange(0, 100).onChange(update);

	    materialWireframeRow.add(new UI.Text('线框').setWidth('90px'));
	    materialWireframeRow.add(materialWireframe);
	    materialWireframeRow.add(materialWireframeLinewidth);

	    container.add(materialWireframeRow);

	    //

	    function update() {

	        var object = currentObject;

	        var geometry = object.geometry;
	        var material = object.material;

	        var textureWarning = false;
	        var objectHasUvs = false;

	        if (object instanceof THREE.Sprite) objectHasUvs = true;
	        if (geometry instanceof THREE.Geometry && geometry.faceVertexUvs[0].length > 0) objectHasUvs = true;
	        if (geometry instanceof THREE.BufferGeometry && geometry.attributes.uv !== undefined) objectHasUvs = true;

	        if (material) {

	            if (material.uuid !== undefined && material.uuid !== materialUUID.getValue()) {

	                editor.execute(new SetMaterialValueCommand$1(currentObject, 'uuid', materialUUID.getValue()));
	            }

	            if (material instanceof THREE[materialClass.getValue()] === false) {

	                material = new THREE[materialClass.getValue()]();

	                editor.execute(new SetMaterialCommand(currentObject, material), '新材质：' + materialClass.getValue());
	                // TODO Copy other references in the scene graph
	                // keeping name and UUID then.
	                // Also there should be means to create a unique
	                // copy for the current object explicitly and to
	                // attach the current material to other objects.
	            }

	            if (material.color !== undefined && material.color.getHex() !== materialColor.getHexValue()) {

	                editor.execute(new SetMaterialColorCommand(currentObject, 'color', materialColor.getHexValue()));
	            }

	            if (material.roughness !== undefined && Math.abs(material.roughness - materialRoughness.getValue()) >= 0.01) {

	                editor.execute(new SetMaterialValueCommand$1(currentObject, 'roughness', materialRoughness.getValue()));
	            }

	            if (material.metalness !== undefined && Math.abs(material.metalness - materialMetalness.getValue()) >= 0.01) {

	                editor.execute(new SetMaterialValueCommand$1(currentObject, 'metalness', materialMetalness.getValue()));
	            }

	            if (material.emissive !== undefined && material.emissive.getHex() !== materialEmissive.getHexValue()) {

	                editor.execute(new SetMaterialColorCommand(currentObject, 'emissive', materialEmissive.getHexValue()));
	            }

	            if (material.specular !== undefined && material.specular.getHex() !== materialSpecular.getHexValue()) {

	                editor.execute(new SetMaterialColorCommand(currentObject, 'specular', materialSpecular.getHexValue()));
	            }

	            if (material.shininess !== undefined && Math.abs(material.shininess - materialShininess.getValue()) >= 0.01) {

	                editor.execute(new SetMaterialValueCommand$1(currentObject, 'shininess', materialShininess.getValue()));
	            }

	            if (material.clearCoat !== undefined && Math.abs(material.clearCoat - materialClearCoat.getValue()) >= 0.01) {

	                editor.execute(new SetMaterialValueCommand$1(currentObject, 'clearCoat', materialClearCoat.getValue()));
	            }

	            if (material.clearCoatRoughness !== undefined && Math.abs(material.clearCoatRoughness - materialClearCoatRoughness.getValue()) >= 0.01) {

	                editor.execute(new SetMaterialValueCommand$1(currentObject, 'clearCoatRoughness', materialClearCoatRoughness.getValue()));
	            }

	            if (material.vertexColors !== undefined) {

	                var vertexColors = parseInt(materialVertexColors.getValue());

	                if (material.vertexColors !== vertexColors) {

	                    editor.execute(new SetMaterialValueCommand$1(currentObject, 'vertexColors', vertexColors));
	                }
	            }

	            if (material.skinning !== undefined && material.skinning !== materialSkinning.getValue()) {

	                editor.execute(new SetMaterialValueCommand$1(currentObject, 'skinning', materialSkinning.getValue()));
	            }

	            if (material.map !== undefined) {

	                var mapEnabled = materialMapEnabled.getValue() === true;

	                if (objectHasUvs) {

	                    var map = mapEnabled ? materialMap.getValue() : null;
	                    if (material.map !== map) {

	                        editor.execute(new SetMaterialMapCommand(currentObject, 'map', map));
	                    }
	                } else {

	                    if (mapEnabled) textureWarning = true;
	                }
	            }

	            if (material.alphaMap !== undefined) {

	                var mapEnabled = materialAlphaMapEnabled.getValue() === true;

	                if (objectHasUvs) {

	                    var alphaMap = mapEnabled ? materialAlphaMap.getValue() : null;
	                    if (material.alphaMap !== alphaMap) {

	                        editor.execute(new SetMaterialMapCommand(currentObject, 'alphaMap', alphaMap));
	                    }
	                } else {

	                    if (mapEnabled) textureWarning = true;
	                }
	            }

	            if (material.bumpMap !== undefined) {

	                var bumpMapEnabled = materialBumpMapEnabled.getValue() === true;

	                if (objectHasUvs) {

	                    var bumpMap = bumpMapEnabled ? materialBumpMap.getValue() : null;
	                    if (material.bumpMap !== bumpMap) {

	                        editor.execute(new SetMaterialMapCommand(currentObject, 'bumpMap', bumpMap));
	                    }

	                    if (material.bumpScale !== materialBumpScale.getValue()) {

	                        editor.execute(new SetMaterialValueCommand$1(currentObject, 'bumpScale', materialBumpScale.getValue()));
	                    }
	                } else {

	                    if (bumpMapEnabled) textureWarning = true;
	                }
	            }

	            if (material.normalMap !== undefined) {

	                var normalMapEnabled = materialNormalMapEnabled.getValue() === true;

	                if (objectHasUvs) {

	                    var normalMap = normalMapEnabled ? materialNormalMap.getValue() : null;
	                    if (material.normalMap !== normalMap) {

	                        editor.execute(new SetMaterialMapCommand(currentObject, 'normalMap', normalMap));
	                    }
	                } else {

	                    if (normalMapEnabled) textureWarning = true;
	                }
	            }

	            if (material.displacementMap !== undefined) {

	                var displacementMapEnabled = materialDisplacementMapEnabled.getValue() === true;

	                if (objectHasUvs) {

	                    var displacementMap = displacementMapEnabled ? materialDisplacementMap.getValue() : null;
	                    if (material.displacementMap !== displacementMap) {

	                        editor.execute(new SetMaterialMapCommand(currentObject, 'displacementMap', displacementMap));
	                    }

	                    if (material.displacementScale !== materialDisplacementScale.getValue()) {

	                        editor.execute(new SetMaterialValueCommand$1(currentObject, 'displacementScale', materialDisplacementScale.getValue()));
	                    }
	                } else {

	                    if (displacementMapEnabled) textureWarning = true;
	                }
	            }

	            if (material.roughnessMap !== undefined) {

	                var roughnessMapEnabled = materialRoughnessMapEnabled.getValue() === true;

	                if (objectHasUvs) {

	                    var roughnessMap = roughnessMapEnabled ? materialRoughnessMap.getValue() : null;
	                    if (material.roughnessMap !== roughnessMap) {

	                        editor.execute(new SetMaterialMapCommand(currentObject, 'roughnessMap', roughnessMap));
	                    }
	                } else {

	                    if (roughnessMapEnabled) textureWarning = true;
	                }
	            }

	            if (material.metalnessMap !== undefined) {

	                var metalnessMapEnabled = materialMetalnessMapEnabled.getValue() === true;

	                if (objectHasUvs) {

	                    var metalnessMap = metalnessMapEnabled ? materialMetalnessMap.getValue() : null;
	                    if (material.metalnessMap !== metalnessMap) {

	                        editor.execute(new SetMaterialMapCommand(currentObject, 'metalnessMap', metalnessMap));
	                    }
	                } else {

	                    if (metalnessMapEnabled) textureWarning = true;
	                }
	            }

	            if (material.specularMap !== undefined) {

	                var specularMapEnabled = materialSpecularMapEnabled.getValue() === true;

	                if (objectHasUvs) {

	                    var specularMap = specularMapEnabled ? materialSpecularMap.getValue() : null;
	                    if (material.specularMap !== specularMap) {

	                        editor.execute(new SetMaterialMapCommand(currentObject, 'specularMap', specularMap));
	                    }
	                } else {

	                    if (specularMapEnabled) textureWarning = true;
	                }
	            }

	            if (material.envMap !== undefined) {

	                var envMapEnabled = materialEnvMapEnabled.getValue() === true;

	                var envMap = envMapEnabled ? materialEnvMap.getValue() : null;

	                if (material.envMap !== envMap) {

	                    editor.execute(new SetMaterialMapCommand(currentObject, 'envMap', envMap));
	                }
	            }

	            if (material.reflectivity !== undefined) {

	                var reflectivity = materialReflectivity.getValue();

	                if (material.reflectivity !== reflectivity) {

	                    editor.execute(new SetMaterialValueCommand$1(currentObject, 'reflectivity', reflectivity));
	                }
	            }

	            if (material.lightMap !== undefined) {

	                var lightMapEnabled = materialLightMapEnabled.getValue() === true;

	                if (objectHasUvs) {

	                    var lightMap = lightMapEnabled ? materialLightMap.getValue() : null;
	                    if (material.lightMap !== lightMap) {

	                        editor.execute(new SetMaterialMapCommand(currentObject, 'lightMap', lightMap));
	                    }
	                } else {

	                    if (lightMapEnabled) textureWarning = true;
	                }
	            }

	            if (material.aoMap !== undefined) {

	                var aoMapEnabled = materialAOMapEnabled.getValue() === true;

	                if (objectHasUvs) {

	                    var aoMap = aoMapEnabled ? materialAOMap.getValue() : null;
	                    if (material.aoMap !== aoMap) {

	                        editor.execute(new SetMaterialMapCommand(currentObject, 'aoMap', aoMap));
	                    }

	                    if (material.aoMapIntensity !== materialAOScale.getValue()) {

	                        editor.execute(new SetMaterialValueCommand$1(currentObject, 'aoMapIntensity', materialAOScale.getValue()));
	                    }
	                } else {

	                    if (aoMapEnabled) textureWarning = true;
	                }
	            }

	            if (material.emissiveMap !== undefined) {

	                var emissiveMapEnabled = materialEmissiveMapEnabled.getValue() === true;

	                if (objectHasUvs) {

	                    var emissiveMap = emissiveMapEnabled ? materialEmissiveMap.getValue() : null;
	                    if (material.emissiveMap !== emissiveMap) {

	                        editor.execute(new SetMaterialMapCommand(currentObject, 'emissiveMap', emissiveMap));
	                    }
	                } else {

	                    if (emissiveMapEnabled) textureWarning = true;
	                }
	            }

	            if (material.side !== undefined) {

	                var side = parseInt(materialSide.getValue());
	                if (material.side !== side) {

	                    editor.execute(new SetMaterialValueCommand$1(currentObject, 'side', side));
	                }
	            }

	            if (material.shading !== undefined) {

	                var shading = parseInt(materialShading.getValue());
	                if (material.shading !== shading) {

	                    editor.execute(new SetMaterialValueCommand$1(currentObject, 'shading', shading));
	                }
	            }

	            if (material.blending !== undefined) {

	                var blending = parseInt(materialBlending.getValue());
	                if (material.blending !== blending) {

	                    editor.execute(new SetMaterialValueCommand$1(currentObject, 'blending', blending));
	                }
	            }

	            if (material.opacity !== undefined && Math.abs(material.opacity - materialOpacity.getValue()) >= 0.01) {

	                editor.execute(new SetMaterialValueCommand$1(currentObject, 'opacity', materialOpacity.getValue()));
	            }

	            if (material.transparent !== undefined && material.transparent !== materialTransparent.getValue()) {

	                editor.execute(new SetMaterialValueCommand$1(currentObject, 'transparent', materialTransparent.getValue()));
	            }

	            if (material.alphaTest !== undefined && Math.abs(material.alphaTest - materialAlphaTest.getValue()) >= 0.01) {

	                editor.execute(new SetMaterialValueCommand$1(currentObject, 'alphaTest', materialAlphaTest.getValue()));
	            }

	            if (material.wireframe !== undefined && material.wireframe !== materialWireframe.getValue()) {

	                editor.execute(new SetMaterialValueCommand$1(currentObject, 'wireframe', materialWireframe.getValue()));
	            }

	            if (material.wireframeLinewidth !== undefined && Math.abs(material.wireframeLinewidth - materialWireframeLinewidth.getValue()) >= 0.01) {

	                editor.execute(new SetMaterialValueCommand$1(currentObject, 'wireframeLinewidth', materialWireframeLinewidth.getValue()));
	            }

	            refreshUI();
	        }

	        if (textureWarning) {

	            console.warn("Can't set texture, model doesn't have texture coordinates");
	        }
	    }

	    //

	    function setRowVisibility() {

	        var properties = {
	            'name': materialNameRow,
	            'color': materialColorRow,
	            'roughness': materialRoughnessRow,
	            'metalness': materialMetalnessRow,
	            'emissive': materialEmissiveRow,
	            'specular': materialSpecularRow,
	            'shininess': materialShininessRow,
	            'clearCoat': materialClearCoatRow,
	            'clearCoatRoughness': materialClearCoatRoughnessRow,
	            'vertexShader': materialProgramRow,
	            'vertexColors': materialVertexColorsRow,
	            'skinning': materialSkinningRow,
	            'map': materialMapRow,
	            'alphaMap': materialAlphaMapRow,
	            'bumpMap': materialBumpMapRow,
	            'normalMap': materialNormalMapRow,
	            'displacementMap': materialDisplacementMapRow,
	            'roughnessMap': materialRoughnessMapRow,
	            'metalnessMap': materialMetalnessMapRow,
	            'specularMap': materialSpecularMapRow,
	            'envMap': materialEnvMapRow,
	            'lightMap': materialLightMapRow,
	            'aoMap': materialAOMapRow,
	            'emissiveMap': materialEmissiveMapRow,
	            'side': materialSideRow,
	            'shading': materialShadingRow,
	            'blending': materialBlendingRow,
	            'opacity': materialOpacityRow,
	            'transparent': materialTransparentRow,
	            'alphaTest': materialAlphaTestRow,
	            'wireframe': materialWireframeRow
	        };

	        var material = currentObject.material;

	        for (var property in properties) {

	            properties[property].setDisplay(material[property] !== undefined ? '' : 'none');
	        }
	    }

	    function refreshUI(resetTextureSelectors) {

	        if (!currentObject) return;

	        var material = currentObject.material;

	        if (material.uuid !== undefined) {

	            materialUUID.setValue(material.uuid);
	        }

	        if (material.name !== undefined) {

	            materialName.setValue(material.name);
	        }

	        materialClass.setValue(material.type);

	        if (material.color !== undefined) {

	            materialColor.setHexValue(material.color.getHexString());
	        }

	        if (material.roughness !== undefined) {

	            materialRoughness.setValue(material.roughness);
	        }

	        if (material.metalness !== undefined) {

	            materialMetalness.setValue(material.metalness);
	        }

	        if (material.emissive !== undefined) {

	            materialEmissive.setHexValue(material.emissive.getHexString());
	        }

	        if (material.specular !== undefined) {

	            materialSpecular.setHexValue(material.specular.getHexString());
	        }

	        if (material.shininess !== undefined) {

	            materialShininess.setValue(material.shininess);
	        }

	        if (material.clearCoat !== undefined) {

	            materialClearCoat.setValue(material.clearCoat);
	        }

	        if (material.clearCoatRoughness !== undefined) {

	            materialClearCoatRoughness.setValue(material.clearCoatRoughness);
	        }

	        if (material.vertexColors !== undefined) {

	            materialVertexColors.setValue(material.vertexColors);
	        }

	        if (material.skinning !== undefined) {

	            materialSkinning.setValue(material.skinning);
	        }

	        if (material.map !== undefined) {

	            materialMapEnabled.setValue(material.map !== null);

	            if (material.map !== null || resetTextureSelectors) {

	                materialMap.setValue(material.map);
	            }
	        }

	        if (material.alphaMap !== undefined) {

	            materialAlphaMapEnabled.setValue(material.alphaMap !== null);

	            if (material.alphaMap !== null || resetTextureSelectors) {

	                materialAlphaMap.setValue(material.alphaMap);
	            }
	        }

	        if (material.bumpMap !== undefined) {

	            materialBumpMapEnabled.setValue(material.bumpMap !== null);

	            if (material.bumpMap !== null || resetTextureSelectors) {

	                materialBumpMap.setValue(material.bumpMap);
	            }

	            materialBumpScale.setValue(material.bumpScale);
	        }

	        if (material.normalMap !== undefined) {

	            materialNormalMapEnabled.setValue(material.normalMap !== null);

	            if (material.normalMap !== null || resetTextureSelectors) {

	                materialNormalMap.setValue(material.normalMap);
	            }
	        }

	        if (material.displacementMap !== undefined) {

	            materialDisplacementMapEnabled.setValue(material.displacementMap !== null);

	            if (material.displacementMap !== null || resetTextureSelectors) {

	                materialDisplacementMap.setValue(material.displacementMap);
	            }

	            materialDisplacementScale.setValue(material.displacementScale);
	        }

	        if (material.roughnessMap !== undefined) {

	            materialRoughnessMapEnabled.setValue(material.roughnessMap !== null);

	            if (material.roughnessMap !== null || resetTextureSelectors) {

	                materialRoughnessMap.setValue(material.roughnessMap);
	            }
	        }

	        if (material.metalnessMap !== undefined) {

	            materialMetalnessMapEnabled.setValue(material.metalnessMap !== null);

	            if (material.metalnessMap !== null || resetTextureSelectors) {

	                materialMetalnessMap.setValue(material.metalnessMap);
	            }
	        }

	        if (material.specularMap !== undefined) {

	            materialSpecularMapEnabled.setValue(material.specularMap !== null);

	            if (material.specularMap !== null || resetTextureSelectors) {

	                materialSpecularMap.setValue(material.specularMap);
	            }
	        }

	        if (material.envMap !== undefined) {

	            materialEnvMapEnabled.setValue(material.envMap !== null);

	            if (material.envMap !== null || resetTextureSelectors) {

	                materialEnvMap.setValue(material.envMap);
	            }
	        }

	        if (material.reflectivity !== undefined) {

	            materialReflectivity.setValue(material.reflectivity);
	        }

	        if (material.lightMap !== undefined) {

	            materialLightMapEnabled.setValue(material.lightMap !== null);

	            if (material.lightMap !== null || resetTextureSelectors) {

	                materialLightMap.setValue(material.lightMap);
	            }
	        }

	        if (material.aoMap !== undefined) {

	            materialAOMapEnabled.setValue(material.aoMap !== null);

	            if (material.aoMap !== null || resetTextureSelectors) {

	                materialAOMap.setValue(material.aoMap);
	            }

	            materialAOScale.setValue(material.aoMapIntensity);
	        }

	        if (material.emissiveMap !== undefined) {

	            materialEmissiveMapEnabled.setValue(material.emissiveMap !== null);

	            if (material.emissiveMap !== null || resetTextureSelectors) {

	                materialEmissiveMap.setValue(material.emissiveMap);
	            }
	        }

	        if (material.side !== undefined) {

	            materialSide.setValue(material.side);
	        }

	        if (material.shading !== undefined) {

	            materialShading.setValue(material.shading);
	        }

	        if (material.blending !== undefined) {

	            materialBlending.setValue(material.blending);
	        }

	        if (material.opacity !== undefined) {

	            materialOpacity.setValue(material.opacity);
	        }

	        if (material.transparent !== undefined) {

	            materialTransparent.setValue(material.transparent);
	        }

	        if (material.alphaTest !== undefined) {

	            materialAlphaTest.setValue(material.alphaTest);
	        }

	        if (material.wireframe !== undefined) {

	            materialWireframe.setValue(material.wireframe);
	        }

	        if (material.wireframeLinewidth !== undefined) {

	            materialWireframeLinewidth.setValue(material.wireframeLinewidth);
	        }

	        setRowVisibility();
	    }

	    // events

	    signals.objectSelected.add(function (object) {

	        if (object && object.material) {

	            var objectChanged = object !== currentObject;

	            currentObject = object;
	            refreshUI(objectChanged);
	            container.setDisplay('');
	        } else {

	            currentObject = null;
	            container.setDisplay('none');
	        }
	    });

	    signals.materialChanged.add(function () {

	        refreshUI();
	    });

	    return container;
	}

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	function ObjectPanel(editor) {

	    var signals = editor.signals;

	    var container = new UI.Panel();
	    container.setBorderTop('0');
	    container.setPaddingTop('20px');
	    container.setDisplay('none');

	    // Actions

	    var objectActions = new UI.Select().setPosition('absolute').setRight('8px').setFontSize('11px');
	    objectActions.setOptions({

	        'Actions': '动作',
	        'Reset Position': '重置位置',
	        'Reset Rotation': '重置旋转',
	        'Reset Scale': '重置缩放'

	    });
	    objectActions.onClick(function (event) {

	        event.stopPropagation(); // Avoid panel collapsing
	    });
	    objectActions.onChange(function (event) {

	        var object = editor.selected;

	        switch (this.getValue()) {

	            case '重置位置':
	                editor.execute(new SetPositionCommand(object, new THREE.Vector3(0, 0, 0)));
	                break;

	            case '重置旋转':
	                editor.execute(new SetRotationCommand(object, new THREE.Euler(0, 0, 0)));
	                break;

	            case '重置缩放':
	                editor.execute(new SetScaleCommand(object, new THREE.Vector3(1, 1, 1)));
	                break;

	        }

	        this.setValue('动作');
	    });
	    // container.addStatic( objectActions );

	    // type

	    var objectTypeRow = new UI.Row();
	    var objectType = new UI.Text();

	    objectTypeRow.add(new UI.Text('类型').setWidth('90px'));
	    objectTypeRow.add(objectType);

	    container.add(objectTypeRow);

	    // uuid

	    var objectUUIDRow = new UI.Row();
	    var objectUUID = new UI.Input().setWidth('102px').setFontSize('12px').setDisabled(true);
	    var objectUUIDRenew = new UI.Button('新建').setMarginLeft('7px').onClick(function () {

	        objectUUID.setValue(THREE.Math.generateUUID());

	        editor.execute(new SetUuidCommand$1(editor.selected, objectUUID.getValue()));
	    });

	    objectUUIDRow.add(new UI.Text('UUID').setWidth('90px'));
	    objectUUIDRow.add(objectUUID);
	    objectUUIDRow.add(objectUUIDRenew);

	    container.add(objectUUIDRow);

	    // name

	    var objectNameRow = new UI.Row();
	    var objectName = new UI.Input().setWidth('150px').setFontSize('12px').onChange(function () {

	        editor.execute(new SetValueCommand$1(editor.selected, 'name', objectName.getValue()));
	    });

	    objectNameRow.add(new UI.Text('名称').setWidth('90px'));
	    objectNameRow.add(objectName);

	    container.add(objectNameRow);

	    // position

	    var objectPositionRow = new UI.Row();
	    var objectPositionX = new UI.Number().setWidth('50px').onChange(update);
	    var objectPositionY = new UI.Number().setWidth('50px').onChange(update);
	    var objectPositionZ = new UI.Number().setWidth('50px').onChange(update);

	    objectPositionRow.add(new UI.Text('位置').setWidth('90px'));
	    objectPositionRow.add(objectPositionX, objectPositionY, objectPositionZ);

	    container.add(objectPositionRow);

	    // rotation

	    var objectRotationRow = new UI.Row();
	    var objectRotationX = new UI.Number().setStep(10).setUnit('°').setWidth('50px').onChange(update);
	    var objectRotationY = new UI.Number().setStep(10).setUnit('°').setWidth('50px').onChange(update);
	    var objectRotationZ = new UI.Number().setStep(10).setUnit('°').setWidth('50px').onChange(update);

	    objectRotationRow.add(new UI.Text('旋转').setWidth('90px'));
	    objectRotationRow.add(objectRotationX, objectRotationY, objectRotationZ);

	    container.add(objectRotationRow);

	    // scale

	    var objectScaleRow = new UI.Row();
	    var objectScaleLock = new UI.Checkbox(true).setPosition('absolute').setLeft('75px');
	    var objectScaleX = new UI.Number(1).setRange(0.01, Infinity).setWidth('50px').onChange(updateScaleX);
	    var objectScaleY = new UI.Number(1).setRange(0.01, Infinity).setWidth('50px').onChange(updateScaleY);
	    var objectScaleZ = new UI.Number(1).setRange(0.01, Infinity).setWidth('50px').onChange(updateScaleZ);

	    objectScaleRow.add(new UI.Text('尺寸').setWidth('90px'));
	    objectScaleRow.add(objectScaleLock);
	    objectScaleRow.add(objectScaleX, objectScaleY, objectScaleZ);

	    container.add(objectScaleRow);

	    // fov

	    var objectFovRow = new UI.Row();
	    var objectFov = new UI.Number().onChange(update);

	    objectFovRow.add(new UI.Text('视场').setWidth('90px'));
	    objectFovRow.add(objectFov);

	    container.add(objectFovRow);

	    // near

	    var objectNearRow = new UI.Row();
	    var objectNear = new UI.Number().onChange(update);

	    objectNearRow.add(new UI.Text('近点').setWidth('90px'));
	    objectNearRow.add(objectNear);

	    container.add(objectNearRow);

	    // far

	    var objectFarRow = new UI.Row();
	    var objectFar = new UI.Number().onChange(update);

	    objectFarRow.add(new UI.Text('远点').setWidth('90px'));
	    objectFarRow.add(objectFar);

	    container.add(objectFarRow);

	    // intensity

	    var objectIntensityRow = new UI.Row();
	    var objectIntensity = new UI.Number().setRange(0, Infinity).onChange(update);

	    objectIntensityRow.add(new UI.Text('强度').setWidth('90px'));
	    objectIntensityRow.add(objectIntensity);

	    container.add(objectIntensityRow);

	    // color

	    var objectColorRow = new UI.Row();
	    var objectColor = new UI.Color().onChange(update);

	    objectColorRow.add(new UI.Text('颜色').setWidth('90px'));
	    objectColorRow.add(objectColor);

	    container.add(objectColorRow);

	    // ground color

	    var objectGroundColorRow = new UI.Row();
	    var objectGroundColor = new UI.Color().onChange(update);

	    objectGroundColorRow.add(new UI.Text('地面颜色').setWidth('90px'));
	    objectGroundColorRow.add(objectGroundColor);

	    container.add(objectGroundColorRow);

	    // distance

	    var objectDistanceRow = new UI.Row();
	    var objectDistance = new UI.Number().setRange(0, Infinity).onChange(update);

	    objectDistanceRow.add(new UI.Text('距离').setWidth('90px'));
	    objectDistanceRow.add(objectDistance);

	    container.add(objectDistanceRow);

	    // angle

	    var objectAngleRow = new UI.Row();
	    var objectAngle = new UI.Number().setPrecision(3).setRange(0, Math.PI / 2).onChange(update);

	    objectAngleRow.add(new UI.Text('角度').setWidth('90px'));
	    objectAngleRow.add(objectAngle);

	    container.add(objectAngleRow);

	    // penumbra

	    var objectPenumbraRow = new UI.Row();
	    var objectPenumbra = new UI.Number().setRange(0, 1).onChange(update);

	    objectPenumbraRow.add(new UI.Text('边缘').setWidth('90px'));
	    objectPenumbraRow.add(objectPenumbra);

	    container.add(objectPenumbraRow);

	    // decay

	    var objectDecayRow = new UI.Row();
	    var objectDecay = new UI.Number().setRange(0, Infinity).onChange(update);

	    objectDecayRow.add(new UI.Text('衰变').setWidth('90px'));
	    objectDecayRow.add(objectDecay);

	    container.add(objectDecayRow);

	    // shadow

	    var objectShadowRow = new UI.Row();

	    objectShadowRow.add(new UI.Text('阴影').setWidth('90px'));

	    var objectCastShadow = new UI.THREE.Boolean(false, '产生').onChange(update);
	    objectShadowRow.add(objectCastShadow);

	    var objectReceiveShadow = new UI.THREE.Boolean(false, '接收').onChange(update);
	    objectShadowRow.add(objectReceiveShadow);

	    var objectShadowRadius = new UI.Number(1).onChange(update);
	    objectShadowRow.add(objectShadowRadius);

	    container.add(objectShadowRow);

	    // visible

	    var objectVisibleRow = new UI.Row();
	    var objectVisible = new UI.Checkbox().onChange(update);

	    objectVisibleRow.add(new UI.Text('可见性').setWidth('90px'));
	    objectVisibleRow.add(objectVisible);

	    container.add(objectVisibleRow);

	    var objectUserDataRow = new UI.Row();
	    var objectUserData = new UI.TextArea().setWidth('150px').setHeight('40px').setFontSize('12px').onChange(update);
	    objectUserData.onKeyUp(function () {

	        try {

	            JSON.parse(objectUserData.getValue());

	            objectUserData.dom.classList.add('success');
	            objectUserData.dom.classList.remove('fail');
	        } catch (error) {

	            objectUserData.dom.classList.remove('success');
	            objectUserData.dom.classList.add('fail');
	        }
	    });

	    objectUserDataRow.add(new UI.Text('用户数据').setWidth('90px'));
	    objectUserDataRow.add(objectUserData);

	    container.add(objectUserDataRow);

	    //

	    function updateScaleX() {

	        var object = editor.selected;

	        if (objectScaleLock.getValue() === true) {

	            var scale = objectScaleX.getValue() / object.scale.x;

	            objectScaleY.setValue(objectScaleY.getValue() * scale);
	            objectScaleZ.setValue(objectScaleZ.getValue() * scale);
	        }

	        update();
	    }

	    function updateScaleY() {

	        var object = editor.selected;

	        if (objectScaleLock.getValue() === true) {

	            var scale = objectScaleY.getValue() / object.scale.y;

	            objectScaleX.setValue(objectScaleX.getValue() * scale);
	            objectScaleZ.setValue(objectScaleZ.getValue() * scale);
	        }

	        update();
	    }

	    function updateScaleZ() {

	        var object = editor.selected;

	        if (objectScaleLock.getValue() === true) {

	            var scale = objectScaleZ.getValue() / object.scale.z;

	            objectScaleX.setValue(objectScaleX.getValue() * scale);
	            objectScaleY.setValue(objectScaleY.getValue() * scale);
	        }

	        update();
	    }

	    function update() {

	        var object = editor.selected;

	        if (object !== null) {

	            var newPosition = new THREE.Vector3(objectPositionX.getValue(), objectPositionY.getValue(), objectPositionZ.getValue());
	            if (object.position.distanceTo(newPosition) >= 0.01) {

	                editor.execute(new SetPositionCommand(object, newPosition));
	            }

	            var newRotation = new THREE.Euler(objectRotationX.getValue() * THREE.Math.DEG2RAD, objectRotationY.getValue() * THREE.Math.DEG2RAD, objectRotationZ.getValue() * THREE.Math.DEG2RAD);
	            if (object.rotation.toVector3().distanceTo(newRotation.toVector3()) >= 0.01) {

	                editor.execute(new SetRotationCommand(object, newRotation));
	            }

	            var newScale = new THREE.Vector3(objectScaleX.getValue(), objectScaleY.getValue(), objectScaleZ.getValue());
	            if (object.scale.distanceTo(newScale) >= 0.01) {

	                editor.execute(new SetScaleCommand(object, newScale));
	            }

	            if (object.fov !== undefined && Math.abs(object.fov - objectFov.getValue()) >= 0.01) {

	                editor.execute(new SetValueCommand$1(object, 'fov', objectFov.getValue()));
	                object.updateProjectionMatrix();
	            }

	            if (object.near !== undefined && Math.abs(object.near - objectNear.getValue()) >= 0.01) {

	                editor.execute(new SetValueCommand$1(object, 'near', objectNear.getValue()));
	            }

	            if (object.far !== undefined && Math.abs(object.far - objectFar.getValue()) >= 0.01) {

	                editor.execute(new SetValueCommand$1(object, 'far', objectFar.getValue()));
	            }

	            if (object.intensity !== undefined && Math.abs(object.intensity - objectIntensity.getValue()) >= 0.01) {

	                editor.execute(new SetValueCommand$1(object, 'intensity', objectIntensity.getValue()));
	            }

	            if (object.color !== undefined && object.color.getHex() !== objectColor.getHexValue()) {

	                editor.execute(new SetColorCommand(object, 'color', objectColor.getHexValue()));
	            }

	            if (object.groundColor !== undefined && object.groundColor.getHex() !== objectGroundColor.getHexValue()) {

	                editor.execute(new SetColorCommand(object, 'groundColor', objectGroundColor.getHexValue()));
	            }

	            if (object.distance !== undefined && Math.abs(object.distance - objectDistance.getValue()) >= 0.01) {

	                editor.execute(new SetValueCommand$1(object, 'distance', objectDistance.getValue()));
	            }

	            if (object.angle !== undefined && Math.abs(object.angle - objectAngle.getValue()) >= 0.01) {

	                editor.execute(new SetValueCommand$1(object, 'angle', objectAngle.getValue()));
	            }

	            if (object.penumbra !== undefined && Math.abs(object.penumbra - objectPenumbra.getValue()) >= 0.01) {

	                editor.execute(new SetValueCommand$1(object, 'penumbra', objectPenumbra.getValue()));
	            }

	            if (object.decay !== undefined && Math.abs(object.decay - objectDecay.getValue()) >= 0.01) {

	                editor.execute(new SetValueCommand$1(object, 'decay', objectDecay.getValue()));
	            }

	            if (object.visible !== objectVisible.getValue()) {

	                editor.execute(new SetValueCommand$1(object, 'visible', objectVisible.getValue()));
	            }

	            if (object.castShadow !== undefined && object.castShadow !== objectCastShadow.getValue()) {

	                editor.execute(new SetValueCommand$1(object, 'castShadow', objectCastShadow.getValue()));
	            }

	            if (object.receiveShadow !== undefined && object.receiveShadow !== objectReceiveShadow.getValue()) {

	                editor.execute(new SetValueCommand$1(object, 'receiveShadow', objectReceiveShadow.getValue()));
	                object.material.needsUpdate = true;
	            }

	            if (object.shadow !== undefined) {

	                if (object.shadow.radius !== objectShadowRadius.getValue()) {

	                    editor.execute(new SetValueCommand$1(object.shadow, 'radius', objectShadowRadius.getValue()));
	                }
	            }

	            try {

	                var userData = JSON.parse(objectUserData.getValue());
	                if (JSON.stringify(object.userData) != JSON.stringify(userData)) {

	                    editor.execute(new SetValueCommand$1(object, 'userData', userData));
	                }
	            } catch (exception) {

	                console.warn(exception);
	            }
	        }
	    }

	    function updateRows(object) {

	        var properties = {
	            'fov': objectFovRow,
	            'near': objectNearRow,
	            'far': objectFarRow,
	            'intensity': objectIntensityRow,
	            'color': objectColorRow,
	            'groundColor': objectGroundColorRow,
	            'distance': objectDistanceRow,
	            'angle': objectAngleRow,
	            'penumbra': objectPenumbraRow,
	            'decay': objectDecayRow,
	            'castShadow': objectShadowRow,
	            'receiveShadow': objectReceiveShadow,
	            'shadow': objectShadowRadius
	        };

	        for (var property in properties) {

	            properties[property].setDisplay(object[property] !== undefined ? '' : 'none');
	        }
	    }

	    function updateTransformRows(object) {

	        if (object instanceof THREE.Light || object instanceof THREE.Object3D && object.userData.targetInverse) {

	            objectRotationRow.setDisplay('none');
	            objectScaleRow.setDisplay('none');
	        } else {

	            objectRotationRow.setDisplay('');
	            objectScaleRow.setDisplay('');
	        }
	    }

	    // events

	    signals.objectSelected.add(function (object) {

	        if (object !== null) {

	            container.setDisplay('block');

	            updateRows(object);
	            updateUI(object);
	        } else {

	            container.setDisplay('none');
	        }
	    });

	    signals.objectChanged.add(function (object) {

	        if (object !== editor.selected) return;

	        updateUI(object);
	    });

	    signals.refreshSidebarObject3D.add(function (object) {

	        if (object !== editor.selected) return;

	        updateUI(object);
	    });

	    function updateUI(object) {

	        objectType.setValue(object.type);

	        objectUUID.setValue(object.uuid);
	        objectName.setValue(object.name);

	        objectPositionX.setValue(object.position.x);
	        objectPositionY.setValue(object.position.y);
	        objectPositionZ.setValue(object.position.z);

	        objectRotationX.setValue(object.rotation.x * THREE.Math.RAD2DEG);
	        objectRotationY.setValue(object.rotation.y * THREE.Math.RAD2DEG);
	        objectRotationZ.setValue(object.rotation.z * THREE.Math.RAD2DEG);

	        objectScaleX.setValue(object.scale.x);
	        objectScaleY.setValue(object.scale.y);
	        objectScaleZ.setValue(object.scale.z);

	        if (object.fov !== undefined) {

	            objectFov.setValue(object.fov);
	        }

	        if (object.near !== undefined) {

	            objectNear.setValue(object.near);
	        }

	        if (object.far !== undefined) {

	            objectFar.setValue(object.far);
	        }

	        if (object.intensity !== undefined) {

	            objectIntensity.setValue(object.intensity);
	        }

	        if (object.color !== undefined) {

	            objectColor.setHexValue(object.color.getHexString());
	        }

	        if (object.groundColor !== undefined) {

	            objectGroundColor.setHexValue(object.groundColor.getHexString());
	        }

	        if (object.distance !== undefined) {

	            objectDistance.setValue(object.distance);
	        }

	        if (object.angle !== undefined) {

	            objectAngle.setValue(object.angle);
	        }

	        if (object.penumbra !== undefined) {

	            objectPenumbra.setValue(object.penumbra);
	        }

	        if (object.decay !== undefined) {

	            objectDecay.setValue(object.decay);
	        }

	        if (object.castShadow !== undefined) {

	            objectCastShadow.setValue(object.castShadow);
	        }

	        if (object.receiveShadow !== undefined) {

	            objectReceiveShadow.setValue(object.receiveShadow);
	        }

	        if (object.shadow !== undefined) {

	            objectShadowRadius.setValue(object.shadow.radius);
	        }

	        objectVisible.setValue(object.visible);

	        try {

	            objectUserData.setValue(JSON.stringify(object.userData, null, '  '));
	        } catch (error) {

	            console.log(error);
	        }

	        objectUserData.setBorderColor('transparent');
	        objectUserData.setBackgroundColor('');

	        updateTransformRows(object);
	    }

	    return container;
	}

	/**
	* @author mrdoob / http://mrdoob.com/
	*/

	function ProjectPanel(editor) {

	    var config = editor.config;
	    var signals = editor.signals;

	    var rendererTypes = {

	        'WebGLRenderer': THREE.WebGLRenderer,
	        'CanvasRenderer': THREE.CanvasRenderer,
	        'SVGRenderer': THREE.SVGRenderer,
	        'SoftwareRenderer': THREE.SoftwareRenderer,
	        'RaytracingRenderer': THREE.RaytracingRenderer

	    };

	    var container = new UI.Panel();
	    container.setBorderTop('0');
	    container.setPaddingTop('20px');

	    // class

	    var options = {};

	    for (var key in rendererTypes) {

	        if (key.indexOf('WebGL') >= 0 && System.support.webgl === false) continue;

	        options[key] = key;
	    }

	    var rendererTypeRow = new UI.Row();
	    var rendererType = new UI.Select().setOptions(options).setWidth('150px').onChange(function () {

	        var value = this.getValue();

	        config.setKey('project/renderer', value);

	        updateRenderer();
	    });

	    rendererTypeRow.add(new UI.Text('渲染器').setWidth('90px'));
	    rendererTypeRow.add(rendererType);

	    container.add(rendererTypeRow);

	    if (config.getKey('project/renderer') !== undefined) {

	        rendererType.setValue(config.getKey('project/renderer'));
	    }

	    // antialiasing

	    var rendererPropertiesRow = new UI.Row().setMarginLeft('90px');

	    var rendererAntialias = new UI.THREE.Boolean(config.getKey('project/renderer/antialias'), '抗锯齿').onChange(function () {

	        config.setKey('project/renderer/antialias', this.getValue());
	        updateRenderer();
	    });
	    rendererPropertiesRow.add(rendererAntialias);

	    // shadow

	    var rendererShadows = new UI.THREE.Boolean(config.getKey('project/renderer/shadows'), '阴影').onChange(function () {

	        config.setKey('project/renderer/shadows', this.getValue());
	        updateRenderer();
	    });
	    rendererPropertiesRow.add(rendererShadows);

	    rendererPropertiesRow.add(new UI.Break());

	    // gamma input

	    var rendererGammaInput = new UI.THREE.Boolean(config.getKey('project/renderer/gammaInput'), 'γ输入').onChange(function () {

	        config.setKey('project/renderer/gammaInput', this.getValue());
	        updateRenderer();
	    });
	    rendererPropertiesRow.add(rendererGammaInput);

	    // gamma output

	    var rendererGammaOutput = new UI.THREE.Boolean(config.getKey('project/renderer/gammaOutput'), 'γ输出').onChange(function () {

	        config.setKey('project/renderer/gammaOutput', this.getValue());
	        updateRenderer();
	    });
	    rendererPropertiesRow.add(rendererGammaOutput);

	    container.add(rendererPropertiesRow);

	    // VR

	    var vrRow = new UI.Row();
	    var vr = new UI.Checkbox(config.getKey('project/vr')).setLeft('100px').onChange(function () {

	        config.setKey('project/vr', this.getValue());
	        // updateRenderer();
	    });

	    vrRow.add(new UI.Text('虚拟现实').setWidth('90px'));
	    vrRow.add(vr);

	    container.add(vrRow);

	    //

	    function updateRenderer() {

	        createRenderer(rendererType.getValue(), rendererAntialias.getValue(), rendererShadows.getValue(), rendererGammaInput.getValue(), rendererGammaOutput.getValue());
	    }

	    function createRenderer(type, antialias, shadows, gammaIn, gammaOut) {

	        if (type === 'WebGLRenderer' && System.support.webgl === false) {

	            type = 'CanvasRenderer';
	        }

	        rendererPropertiesRow.setDisplay(type === 'WebGLRenderer' ? '' : 'none');

	        var renderer = new rendererTypes[type]({ antialias: antialias });
	        renderer.gammaInput = gammaIn;
	        renderer.gammaOutput = gammaOut;
	        if (shadows && renderer.shadowMap) {

	            renderer.shadowMap.enabled = true;
	            // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	        }

	        signals.rendererChanged.dispatch(renderer);
	    }

	    createRenderer(config.getKey('project/renderer'), config.getKey('project/renderer/antialias'), config.getKey('project/renderer/shadows'), config.getKey('project/renderer/gammaInput'), config.getKey('project/renderer/gammaOutput'));

	    return container;
	}

	/**
	* @author mrdoob / http://mrdoob.com/
	*/

	function GeometryGeometryPanel(editor) {

	    var signals = editor.signals;

	    var container = new UI.Row();

	    // vertices

	    var verticesRow = new UI.Row();
	    var vertices = new UI.Text();

	    verticesRow.add(new UI.Text('顶点').setWidth('90px'));
	    verticesRow.add(vertices);

	    container.add(verticesRow);

	    // faces

	    var facesRow = new UI.Row();
	    var faces = new UI.Text();

	    facesRow.add(new UI.Text('面').setWidth('90px'));
	    facesRow.add(faces);

	    container.add(facesRow);

	    //

	    function update(object) {

	        if (object === null) return; // objectSelected.dispatch( null )
	        if (object === undefined) return;

	        var geometry = object.geometry;

	        if (geometry instanceof THREE.Geometry) {

	            container.setDisplay('block');

	            vertices.setValue(geometry.vertices.length.format());
	            faces.setValue(geometry.faces.length.format());
	        } else {

	            container.setDisplay('none');
	        }
	    }

	    signals.objectSelected.add(update);
	    signals.geometryChanged.add(update);

	    return container;
	}

	/**
	* @author mrdoob / http://mrdoob.com/
	*/

	function BufferGeometryPanel(editor) {

	            var signals = editor.signals;

	            var container = new UI.Row();

	            function update(object) {

	                        if (object === null) return; // objectSelected.dispatch( null )
	                        if (object === undefined) return;

	                        var geometry = object.geometry;

	                        if (geometry instanceof THREE.BufferGeometry) {

	                                    container.clear();
	                                    container.setDisplay('block');

	                                    var index = geometry.index;

	                                    if (index !== null) {

	                                                var panel = new UI.Row();
	                                                panel.add(new UI.Text('索引').setWidth('90px'));
	                                                panel.add(new UI.Text(index.count.format()).setFontSize('12px'));
	                                                container.add(panel);
	                                    }

	                                    var attributes = geometry.attributes;

	                                    for (var name in attributes) {

	                                                var attribute = attributes[name];

	                                                var panel = new UI.Row();
	                                                panel.add(new UI.Text(name).setWidth('90px'));
	                                                panel.add(new UI.Text(attribute.count.format() + ' (' + attribute.itemSize + ')').setFontSize('12px'));
	                                                container.add(panel);
	                                    }
	                        } else {

	                                    container.setDisplay('none');
	                        }
	            }

	            signals.objectSelected.add(update);
	            signals.geometryChanged.add(update);

	            return container;
	}

	/**
	* @author mrdoob / http://mrdoob.com/
	*/

	function GeometryModifyPanel(editor, object) {

	    var signals = editor.signals;

	    var container = new UI.Row().setPaddingLeft('90px');

	    var geometry = object.geometry;

	    // Compute Vertex Normals

	    var button = new UI.Button('计算顶点法线');
	    button.onClick(function () {

	        geometry.computeVertexNormals();

	        if (geometry instanceof THREE.BufferGeometry) {

	            geometry.attributes.normal.needsUpdate = true;
	        } else {

	            geometry.normalsNeedUpdate = true;
	        }

	        signals.geometryChanged.dispatch(object);
	    });

	    container.add(button);

	    //

	    return container;
	}

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	function BoxGeometryPanel(editor, object) {

	    var signals = editor.signals;

	    var container = new UI.Row();

	    var geometry = object.geometry;
	    var parameters = geometry.parameters;

	    // width

	    var widthRow = new UI.Row();
	    var width = new UI.Number(parameters.width).onChange(update);

	    widthRow.add(new UI.Text('宽度').setWidth('90px'));
	    widthRow.add(width);

	    container.add(widthRow);

	    // height

	    var heightRow = new UI.Row();
	    var height = new UI.Number(parameters.height).onChange(update);

	    heightRow.add(new UI.Text('高度').setWidth('90px'));
	    heightRow.add(height);

	    container.add(heightRow);

	    // depth

	    var depthRow = new UI.Row();
	    var depth = new UI.Number(parameters.depth).onChange(update);

	    depthRow.add(new UI.Text('深度').setWidth('90px'));
	    depthRow.add(depth);

	    container.add(depthRow);

	    // widthSegments

	    var widthSegmentsRow = new UI.Row();
	    var widthSegments = new UI.Integer(parameters.widthSegments).setRange(1, Infinity).onChange(update);

	    widthSegmentsRow.add(new UI.Text('宽度段数').setWidth('90px'));
	    widthSegmentsRow.add(widthSegments);

	    container.add(widthSegmentsRow);

	    // heightSegments

	    var heightSegmentsRow = new UI.Row();
	    var heightSegments = new UI.Integer(parameters.heightSegments).setRange(1, Infinity).onChange(update);

	    heightSegmentsRow.add(new UI.Text('高度段数').setWidth('90px'));
	    heightSegmentsRow.add(heightSegments);

	    container.add(heightSegmentsRow);

	    // depthSegments

	    var depthSegmentsRow = new UI.Row();
	    var depthSegments = new UI.Integer(parameters.depthSegments).setRange(1, Infinity).onChange(update);

	    depthSegmentsRow.add(new UI.Text('深度段数').setWidth('90px'));
	    depthSegmentsRow.add(depthSegments);

	    container.add(depthSegmentsRow);

	    //

	    function update() {

	        editor.execute(new SetGeometryCommand$1(object, new THREE[geometry.type](width.getValue(), height.getValue(), depth.getValue(), widthSegments.getValue(), heightSegments.getValue(), depthSegments.getValue())));
	    }

	    return container;
	}

	/**
	* @author mrdoob / http://mrdoob.com/
	*/

	function CircleGeometryPanel(editor, object) {

	    var signals = editor.signals;

	    var container = new UI.Row();

	    var geometry = object.geometry;
	    var parameters = geometry.parameters;

	    // radius

	    var radiusRow = new UI.Row();
	    var radius = new UI.Number(parameters.radius).onChange(update);

	    radiusRow.add(new UI.Text('半径').setWidth('90px'));
	    radiusRow.add(radius);

	    container.add(radiusRow);

	    // segments

	    var segmentsRow = new UI.Row();
	    var segments = new UI.Integer(parameters.segments).setRange(3, Infinity).onChange(update);

	    segmentsRow.add(new UI.Text('段长').setWidth('90px'));
	    segmentsRow.add(segments);

	    container.add(segmentsRow);

	    // thetaStart

	    var thetaStartRow = new UI.Row();
	    var thetaStart = new UI.Number(parameters.thetaStart).onChange(update);

	    thetaStartRow.add(new UI.Text('θ开始').setWidth('90px'));
	    thetaStartRow.add(thetaStart);

	    container.add(thetaStartRow);

	    // thetaLength

	    var thetaLengthRow = new UI.Row();
	    var thetaLength = new UI.Number(parameters.thetaLength).onChange(update);

	    thetaLengthRow.add(new UI.Text('θ长度').setWidth('90px'));
	    thetaLengthRow.add(thetaLength);

	    container.add(thetaLengthRow);

	    //

	    function update() {

	        editor.execute(new SetGeometryCommand(object, new THREE[geometry.type](radius.getValue(), segments.getValue(), thetaStart.getValue(), thetaLength.getValue())));
	    }

	    return container;
	}

	/**
	* @author mrdoob / http://mrdoob.com/
	*/

	function CylinderGeometryPanel(editor, object) {

	    var signals = editor.signals;

	    var container = new UI.Row();

	    var geometry = object.geometry;
	    var parameters = geometry.parameters;

	    // radiusTop

	    var radiusTopRow = new UI.Row();
	    var radiusTop = new UI.Number(parameters.radiusTop).onChange(update);

	    radiusTopRow.add(new UI.Text('顶部半径').setWidth('90px'));
	    radiusTopRow.add(radiusTop);

	    container.add(radiusTopRow);

	    // radiusBottom

	    var radiusBottomRow = new UI.Row();
	    var radiusBottom = new UI.Number(parameters.radiusBottom).onChange(update);

	    radiusBottomRow.add(new UI.Text('底部半径').setWidth('90px'));
	    radiusBottomRow.add(radiusBottom);

	    container.add(radiusBottomRow);

	    // height

	    var heightRow = new UI.Row();
	    var height = new UI.Number(parameters.height).onChange(update);

	    heightRow.add(new UI.Text('高度').setWidth('90px'));
	    heightRow.add(height);

	    container.add(heightRow);

	    // radialSegments

	    var radialSegmentsRow = new UI.Row();
	    var radialSegments = new UI.Integer(parameters.radialSegments).setRange(1, Infinity).onChange(update);

	    radialSegmentsRow.add(new UI.Text('径向段数').setWidth('90px'));
	    radialSegmentsRow.add(radialSegments);

	    container.add(radialSegmentsRow);

	    // heightSegments

	    var heightSegmentsRow = new UI.Row();
	    var heightSegments = new UI.Integer(parameters.heightSegments).setRange(1, Infinity).onChange(update);

	    heightSegmentsRow.add(new UI.Text('高度段数').setWidth('90px'));
	    heightSegmentsRow.add(heightSegments);

	    container.add(heightSegmentsRow);

	    // openEnded

	    var openEndedRow = new UI.Row();
	    var openEnded = new UI.Checkbox(parameters.openEnded).onChange(update);

	    openEndedRow.add(new UI.Text('打开关闭').setWidth('90px'));
	    openEndedRow.add(openEnded);

	    container.add(openEndedRow);

	    //

	    function update() {

	        editor.execute(new SetGeometryCommand(object, new THREE[geometry.type](radiusTop.getValue(), radiusBottom.getValue(), height.getValue(), radialSegments.getValue(), heightSegments.getValue(), openEnded.getValue())));
	    }

	    return container;
	}

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	function IcosahedronGeometryPanel(editor, object) {

	    var signals = editor.signals;

	    var container = new UI.Row();

	    var geometry = object.geometry;
	    var parameters = geometry.parameters;

	    // radius

	    var radiusRow = new UI.Row();
	    var radius = new UI.Number(parameters.radius).onChange(update);

	    radiusRow.add(new UI.Text('半径').setWidth('90px'));
	    radiusRow.add(radius);

	    container.add(radiusRow);

	    // detail

	    var detailRow = new UI.Row();
	    var detail = new UI.Integer(parameters.detail).setRange(0, Infinity).onChange(update);

	    detailRow.add(new UI.Text('详细').setWidth('90px'));
	    detailRow.add(detail);

	    container.add(detailRow);

	    //

	    function update() {

	        editor.execute(new SetGeometryCommand$1(object, new THREE[geometry.type](radius.getValue(), detail.getValue())));

	        signals.objectChanged.dispatch(object);
	    }

	    return container;
	}

	/**
	* @author rfm1201
	*/

	function LatheGeometryPanel(editor, object) {

	    var signals = editor.signals;

	    var container = new UI.Row();

	    var geometry = object.geometry;
	    var parameters = geometry.parameters;

	    // segments

	    var segmentsRow = new UI.Row();
	    var segments = new UI.Integer(parameters.segments).onChange(update);

	    segmentsRow.add(new UI.Text('段数').setWidth('90px'));
	    segmentsRow.add(segments);

	    container.add(segmentsRow);

	    // phiStart

	    var phiStartRow = new UI.Row();
	    var phiStart = new UI.Number(parameters.phiStart * 180 / Math.PI).onChange(update);

	    phiStartRow.add(new UI.Text('φ开始 (°)').setWidth('90px'));
	    phiStartRow.add(phiStart);

	    container.add(phiStartRow);

	    // phiLength

	    var phiLengthRow = new UI.Row();
	    var phiLength = new UI.Number(parameters.phiLength * 180 / Math.PI).onChange(update);

	    phiLengthRow.add(new UI.Text('φ长度(°)').setWidth('90px'));
	    phiLengthRow.add(phiLength);

	    container.add(phiLengthRow);

	    // points

	    var lastPointIdx = 0;
	    var pointsUI = [];

	    var pointsRow = new UI.Row();
	    pointsRow.add(new UI.Text('点').setWidth('90px'));

	    var points = new UI.Span().setDisplay('inline-block');
	    pointsRow.add(points);

	    var pointsList = new UI.Div();
	    points.add(pointsList);

	    for (var i = 0; i < parameters.points.length; i++) {

	        var point = parameters.points[i];
	        pointsList.add(createPointRow(point.x, point.y));
	    }

	    var addPointButton = new UI.Button('+').onClick(function () {

	        if (pointsUI.length === 0) {

	            pointsList.add(createPointRow(0, 0));
	        } else {

	            var point = pointsUI[pointsUI.length - 1];

	            pointsList.add(createPointRow(point.x.getValue(), point.y.getValue()));
	        }

	        update();
	    });
	    points.add(addPointButton);

	    container.add(pointsRow);

	    //

	    function createPointRow(x, y) {

	        var pointRow = new UI.Div();
	        var lbl = new UI.Text(lastPointIdx + 1).setWidth('20px');
	        var txtX = new UI.Number(x).setRange(0, Infinity).setWidth('40px').onChange(update);
	        var txtY = new UI.Number(y).setWidth('40px').onChange(update);
	        var idx = lastPointIdx;
	        var btn = new UI.Button('-').onClick(function () {

	            deletePointRow(idx);
	        });

	        pointsUI.push({ row: pointRow, lbl: lbl, x: txtX, y: txtY });
	        lastPointIdx++;
	        pointRow.add(lbl, txtX, txtY, btn);

	        return pointRow;
	    }

	    function deletePointRow(idx) {

	        if (!pointsUI[idx]) return;

	        pointsList.remove(pointsUI[idx].row);
	        pointsUI[idx] = null;

	        update();
	    }

	    function update() {

	        var points = [];
	        var count = 0;

	        for (var i = 0; i < pointsUI.length; i++) {

	            var pointUI = pointsUI[i];

	            if (!pointUI) continue;

	            points.push(new THREE.Vector2(pointUI.x.getValue(), pointUI.y.getValue()));
	            count++;
	            pointUI.lbl.setValue(count);
	        }

	        editor.execute(new SetGeometryCommand(object, new THREE[geometry.type](points, segments.getValue(), phiStart.getValue() / 180 * Math.PI, phiLength.getValue() / 180 * Math.PI)));
	    }

	    return container;
	}

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	function PlaneGeometryPanel(editor, object) {

	    var signals = editor.signals;

	    var container = new UI.Row();

	    var geometry = object.geometry;
	    var parameters = geometry.parameters;

	    // width

	    var widthRow = new UI.Row();
	    var width = new UI.Number(parameters.width).onChange(update);

	    widthRow.add(new UI.Text('宽度').setWidth('90px'));
	    widthRow.add(width);

	    container.add(widthRow);

	    // height

	    var heightRow = new UI.Row();
	    var height = new UI.Number(parameters.height).onChange(update);

	    heightRow.add(new UI.Text('高度').setWidth('90px'));
	    heightRow.add(height);

	    container.add(heightRow);

	    // widthSegments

	    var widthSegmentsRow = new UI.Row();
	    var widthSegments = new UI.Integer(parameters.widthSegments).setRange(1, Infinity).onChange(update);

	    widthSegmentsRow.add(new UI.Text('宽度段数').setWidth('90px'));
	    widthSegmentsRow.add(widthSegments);

	    container.add(widthSegmentsRow);

	    // heightSegments

	    var heightSegmentsRow = new UI.Row();
	    var heightSegments = new UI.Integer(parameters.heightSegments).setRange(1, Infinity).onChange(update);

	    heightSegmentsRow.add(new UI.Text('高度段数').setWidth('90px'));
	    heightSegmentsRow.add(heightSegments);

	    container.add(heightSegmentsRow);

	    //

	    function update() {

	        editor.execute(new SetGeometryCommand$1(object, new THREE[geometry.type](width.getValue(), height.getValue(), widthSegments.getValue(), heightSegments.getValue())));
	    }

	    return container;
	}

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	function SphereGeometryPanel(editor, object) {

	    var signals = editor.signals;

	    var container = new UI.Row();

	    var geometry = object.geometry;
	    var parameters = geometry.parameters;

	    // radius

	    var radiusRow = new UI.Row();
	    var radius = new UI.Number(parameters.radius).onChange(update);

	    radiusRow.add(new UI.Text('半径').setWidth('90px'));
	    radiusRow.add(radius);

	    container.add(radiusRow);

	    // widthSegments

	    var widthSegmentsRow = new UI.Row();
	    var widthSegments = new UI.Integer(parameters.widthSegments).setRange(1, Infinity).onChange(update);

	    widthSegmentsRow.add(new UI.Text('宽度段数').setWidth('90px'));
	    widthSegmentsRow.add(widthSegments);

	    container.add(widthSegmentsRow);

	    // heightSegments

	    var heightSegmentsRow = new UI.Row();
	    var heightSegments = new UI.Integer(parameters.heightSegments).setRange(1, Infinity).onChange(update);

	    heightSegmentsRow.add(new UI.Text('高度段数').setWidth('90px'));
	    heightSegmentsRow.add(heightSegments);

	    container.add(heightSegmentsRow);

	    // phiStart

	    var phiStartRow = new UI.Row();
	    var phiStart = new UI.Number(parameters.phiStart).onChange(update);

	    phiStartRow.add(new UI.Text('φ开始').setWidth('90px'));
	    phiStartRow.add(phiStart);

	    container.add(phiStartRow);

	    // phiLength

	    var phiLengthRow = new UI.Row();
	    var phiLength = new UI.Number(parameters.phiLength).onChange(update);

	    phiLengthRow.add(new UI.Text('φ长度').setWidth('90px'));
	    phiLengthRow.add(phiLength);

	    container.add(phiLengthRow);

	    // thetaStart

	    var thetaStartRow = new UI.Row();
	    var thetaStart = new UI.Number(parameters.thetaStart).onChange(update);

	    thetaStartRow.add(new UI.Text('θ开始').setWidth('90px'));
	    thetaStartRow.add(thetaStart);

	    container.add(thetaStartRow);

	    // thetaLength

	    var thetaLengthRow = new UI.Row();
	    var thetaLength = new UI.Number(parameters.thetaLength).onChange(update);

	    thetaLengthRow.add(new UI.Text('θ长度').setWidth('90px'));
	    thetaLengthRow.add(thetaLength);

	    container.add(thetaLengthRow);

	    //

	    function update() {

	        editor.execute(new SetGeometryCommand$1(object, new THREE[geometry.type](radius.getValue(), widthSegments.getValue(), heightSegments.getValue(), phiStart.getValue(), phiLength.getValue(), thetaStart.getValue(), thetaLength.getValue())));
	    }

	    return container;
	}

	/**
	* @author tschw
	*/

	function TeapotBufferGeometryPanel(signals, object) {

	    var container = new UI.Row();

	    var parameters = object.geometry.parameters;

	    // size

	    var sizeRow = new UI.Row();
	    var size = new UI.Number(parameters.size).onChange(update);

	    sizeRow.add(new UI.Text('尺寸').setWidth('90px'));
	    sizeRow.add(size);

	    container.add(sizeRow);

	    // segments

	    var segmentsRow = new UI.Row();
	    var segments = new UI.Integer(parameters.segments).setRange(1, Infinity).onChange(update);

	    segmentsRow.add(new UI.Text('段数').setWidth('90px'));
	    segmentsRow.add(segments);

	    container.add(segmentsRow);

	    // bottom

	    var bottomRow = new UI.Row();
	    var bottom = new UI.Checkbox(parameters.bottom).onChange(update);

	    bottomRow.add(new UI.Text('底部').setWidth('90px'));
	    bottomRow.add(bottom);

	    container.add(bottomRow);

	    // lid

	    var lidRow = new UI.Row();
	    var lid = new UI.Checkbox(parameters.lid).onChange(update);

	    lidRow.add(new UI.Text('壶盖').setWidth('90px'));
	    lidRow.add(lid);

	    container.add(lidRow);

	    // body

	    var bodyRow = new UI.Row();
	    var body = new UI.Checkbox(parameters.body).onChange(update);

	    bodyRow.add(new UI.Text('壶体').setWidth('90px'));
	    bodyRow.add(body);

	    container.add(bodyRow);

	    // fitted lid

	    var fitLidRow = new UI.Row();
	    var fitLid = new UI.Checkbox(parameters.fitLid).onChange(update);

	    fitLidRow.add(new UI.Text('适合壶盖').setWidth('90px'));
	    fitLidRow.add(fitLid);

	    container.add(fitLidRow);

	    // blinn-sized

	    var blinnRow = new UI.Row();
	    var blinn = new UI.Checkbox(parameters.blinn).onChange(update);

	    blinnRow.add(new UI.Text('Blinn缩放').setWidth('90px'));
	    blinnRow.add(blinn);

	    container.add(blinnRow);

	    function update() {

	        object.geometry.dispose();

	        object.geometry = new THREE.TeapotBufferGeometry(size.getValue(), segments.getValue(), bottom.getValue(), lid.getValue(), body.getValue(), fitLid.getValue(), blinn.getValue());

	        object.geometry.computeBoundingSphere();

	        signals.geometryChanged.dispatch(object);
	    }

	    return container;
	}

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	function TorusGeometryPanel(editor, object) {

	    var signals = editor.signals;

	    var container = new UI.Row();

	    var geometry = object.geometry;
	    var parameters = geometry.parameters;

	    // radius

	    var radiusRow = new UI.Row();
	    var radius = new UI.Number(parameters.radius).onChange(update);

	    radiusRow.add(new UI.Text('半径').setWidth('90px'));
	    radiusRow.add(radius);

	    container.add(radiusRow);

	    // tube

	    var tubeRow = new UI.Row();
	    var tube = new UI.Number(parameters.tube).onChange(update);

	    tubeRow.add(new UI.Text('管长').setWidth('90px'));
	    tubeRow.add(tube);

	    container.add(tubeRow);

	    // radialSegments

	    var radialSegmentsRow = new UI.Row();
	    var radialSegments = new UI.Integer(parameters.radialSegments).setRange(1, Infinity).onChange(update);

	    radialSegmentsRow.add(new UI.Text('径向段数').setWidth('90px'));
	    radialSegmentsRow.add(radialSegments);

	    container.add(radialSegmentsRow);

	    // tubularSegments

	    var tubularSegmentsRow = new UI.Row();
	    var tubularSegments = new UI.Integer(parameters.tubularSegments).setRange(1, Infinity).onChange(update);

	    tubularSegmentsRow.add(new UI.Text('管长段数').setWidth('90px'));
	    tubularSegmentsRow.add(tubularSegments);

	    container.add(tubularSegmentsRow);

	    // arc

	    var arcRow = new UI.Row();
	    var arc = new UI.Number(parameters.arc).onChange(update);

	    arcRow.add(new UI.Text('弧长').setWidth('90px'));
	    arcRow.add(arc);

	    container.add(arcRow);

	    //

	    function update() {

	        editor.execute(new SetGeometryCommand$1(object, new THREE[geometry.type](radius.getValue(), tube.getValue(), radialSegments.getValue(), tubularSegments.getValue(), arc.getValue())));
	    }

	    return container;
	}

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	function TorusKnotGeometryPanel(editor, object) {

	    var signals = editor.signals;

	    var container = new UI.Row();

	    var geometry = object.geometry;
	    var parameters = geometry.parameters;

	    // radius

	    var radiusRow = new UI.Row();
	    var radius = new UI.Number(parameters.radius).onChange(update);

	    radiusRow.add(new UI.Text('半径').setWidth('90px'));
	    radiusRow.add(radius);

	    container.add(radiusRow);

	    // tube

	    var tubeRow = new UI.Row();
	    var tube = new UI.Number(parameters.tube).onChange(update);

	    tubeRow.add(new UI.Text('管长').setWidth('90px'));
	    tubeRow.add(tube);

	    container.add(tubeRow);

	    // tubularSegments

	    var tubularSegmentsRow = new UI.Row();
	    var tubularSegments = new UI.Integer(parameters.tubularSegments).setRange(1, Infinity).onChange(update);

	    tubularSegmentsRow.add(new UI.Text('管长段数').setWidth('90px'));
	    tubularSegmentsRow.add(tubularSegments);

	    container.add(tubularSegmentsRow);

	    // radialSegments

	    var radialSegmentsRow = new UI.Row();
	    var radialSegments = new UI.Integer(parameters.radialSegments).setRange(1, Infinity).onChange(update);

	    radialSegmentsRow.add(new UI.Text('径向段数').setWidth('90px'));
	    radialSegmentsRow.add(radialSegments);

	    container.add(radialSegmentsRow);

	    // p

	    var pRow = new UI.Row();
	    var p = new UI.Number(parameters.p).onChange(update);

	    pRow.add(new UI.Text('P').setWidth('90px'));
	    pRow.add(p);

	    container.add(pRow);

	    // q

	    var qRow = new UI.Row();
	    var q = new UI.Number(parameters.q).onChange(update);

	    pRow.add(new UI.Text('Q').setWidth('90px'));
	    pRow.add(q);

	    container.add(qRow);

	    //

	    function update() {

	        editor.execute(new SetGeometryCommand$1(object, new THREE[geometry.type](radius.getValue(), tube.getValue(), tubularSegments.getValue(), radialSegments.getValue(), p.getValue(), q.getValue())));
	    }

	    return container;
	}

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	var GeometryPanels = {
	    'BoxGeometry': BoxGeometryPanel,
	    'BoxBufferGeometry': BoxGeometryPanel,
	    'CircleGeometry': CircleGeometryPanel,
	    'CircleBufferGeometry': CircleGeometryPanel,
	    'CylinderGeometry': CylinderGeometryPanel,
	    'CylinderBufferGeometry': CylinderGeometryPanel,
	    'IcosahedronGeometry': IcosahedronGeometryPanel,
	    'IcosahedronBufferGeometry': IcosahedronGeometryPanel,
	    'LatheGeometry': LatheGeometryPanel,
	    'LatheBufferGeometry': LatheGeometryPanel,
	    'PlaneGeometry': PlaneGeometryPanel,
	    'PlaneBufferGeometry': PlaneGeometryPanel,
	    'SphereGeometry': SphereGeometryPanel,
	    'SphereBufferGeometry': SphereGeometryPanel,
	    'TeapotGeometry': TeapotBufferGeometryPanel,
	    'TeapotBufferGeometry': TeapotBufferGeometryPanel,
	    'TorusGeometry': TorusGeometryPanel,
	    'TorusBufferGeometry': TorusGeometryPanel,
	    'TorusKnotGeometry': TorusKnotGeometryPanel,
	    'TorusKnotBufferGeometry': TorusKnotGeometryPanel
	};

	function GeometryPanel(editor) {

	    var signals = editor.signals;

	    var container = new UI.Panel();
	    container.setBorderTop('0');
	    container.setPaddingTop('20px');

	    // Actions

	    /*
	    var objectActions = new UI.Select().setPosition( 'absolute' ).setRight( '8px' ).setFontSize( '11px' );
	    objectActions.setOptions( {
	    'Actions': 'Actions',
	    'Center': 'Center',
	    'Convert': 'Convert',
	    'Flatten': 'Flatten'
	    } );
	    objectActions.onClick( function ( event ) {
	    event.stopPropagation(); // Avoid panel collapsing
	    } );
	    objectActions.onChange( function ( event ) {
	    var action = this.getValue();
	    var object = editor.selected;
	    var geometry = object.geometry;
	    if ( confirm( action + ' ' + object.name + '?' ) === false ) return;
	    switch ( action ) {
	    	case 'Center':
	    		var offset = geometry.center();
	    		var newPosition = object.position.clone();
	    newPosition.sub( offset );
	    editor.execute( new SetPositionCommand( object, newPosition ) );
	    		editor.signals.geometryChanged.dispatch( object );
	    		break;
	    	case 'Convert':
	    		if ( geometry instanceof THREE.Geometry ) {
	    			editor.execute( new SetGeometryCommand( object, new THREE.BufferGeometry().fromGeometry( geometry ) ) );
	    		}
	    		break;
	    	case 'Flatten':
	    		var newGeometry = geometry.clone();
	    newGeometry.uuid = geometry.uuid;
	    newGeometry.applyMatrix( object.matrix );
	    		var cmds = [ new SetGeometryCommand( object, newGeometry ),
	    	new SetPositionCommand( object, new THREE.Vector3( 0, 0, 0 ) ),
	    	new SetRotationCommand( object, new THREE.Euler( 0, 0, 0 ) ),
	    	new SetScaleCommand( object, new THREE.Vector3( 1, 1, 1 ) ) ];
	    		editor.execute( new MultiCmdsCommand( cmds ), 'Flatten Geometry' );
	    		break;
	    }
	    this.setValue( 'Actions' );
	    } );
	    container.addStatic( objectActions );
	    */

	    // type

	    var geometryTypeRow = new UI.Row();
	    var geometryType = new UI.Text();

	    geometryTypeRow.add(new UI.Text('类型').setWidth('90px'));
	    geometryTypeRow.add(geometryType);

	    container.add(geometryTypeRow);

	    // uuid

	    var geometryUUIDRow = new UI.Row();
	    var geometryUUID = new UI.Input().setWidth('102px').setFontSize('12px').setDisabled(true);
	    var geometryUUIDRenew = new UI.Button('新建').setMarginLeft('7px').onClick(function () {

	        geometryUUID.setValue(THREE.Math.generateUUID());

	        editor.execute(new SetGeometryValueCommand(editor.selected, 'uuid', geometryUUID.getValue()));
	    });

	    geometryUUIDRow.add(new UI.Text('UUID').setWidth('90px'));
	    geometryUUIDRow.add(geometryUUID);
	    geometryUUIDRow.add(geometryUUIDRenew);

	    container.add(geometryUUIDRow);

	    // name

	    var geometryNameRow = new UI.Row();
	    var geometryName = new UI.Input().setWidth('150px').setFontSize('12px').onChange(function () {

	        editor.execute(new SetGeometryValueCommand(editor.selected, 'name', geometryName.getValue()));
	    });

	    geometryNameRow.add(new UI.Text('名称').setWidth('90px'));
	    geometryNameRow.add(geometryName);

	    container.add(geometryNameRow);

	    // geometry

	    container.add(new GeometryGeometryPanel(editor));

	    // buffergeometry

	    container.add(new BufferGeometryPanel(editor));

	    // parameters

	    var parameters = new UI.Span();
	    container.add(parameters);

	    //

	    function build() {

	        var object = editor.selected;

	        if (object && object.geometry) {

	            var geometry = object.geometry;

	            container.setDisplay('block');

	            geometryType.setValue(geometry.type);

	            geometryUUID.setValue(geometry.uuid);
	            geometryName.setValue(geometry.name);

	            //

	            parameters.clear();

	            if (geometry.type === 'BufferGeometry' || geometry.type === 'Geometry') {

	                parameters.add(new GeometryModifyPanel(editor, object));
	            } else if (GeometryPanels[geometry.type] !== undefined) {

	                parameters.add(new GeometryPanels[geometry.type](editor, object));
	            }
	        } else {

	            container.setDisplay('none');
	        }
	    }

	    signals.objectSelected.add(build);
	    signals.geometryChanged.add(build);

	    return container;
	}

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	function PropertyPanel(editor) {

	    var signals = editor.signals;

	    var container = new UI.Span();

	    var objectTab = new UI.Text('物体').onClick(onClick);
	    var geometryTab = new UI.Text('几何').onClick(onClick);
	    var materialTab = new UI.Text('材质').onClick(onClick);

	    var tabs = new UI.Div();
	    tabs.setId('tabs');
	    tabs.add(objectTab, geometryTab, materialTab);
	    container.add(tabs);

	    function onClick(event) {

	        select(event.target.textContent);
	    }

	    //

	    var object = new UI.Span().add(new ObjectPanel(editor));
	    container.add(object);

	    var geometry = new UI.Span().add(new GeometryPanel(editor));
	    container.add(geometry);

	    var material = new UI.Span().add(new MaterialPanel(editor));
	    container.add(material);

	    //

	    function select(section) {

	        objectTab.setClass('');
	        geometryTab.setClass('');
	        materialTab.setClass('');

	        object.setDisplay('none');
	        geometry.setDisplay('none');
	        material.setDisplay('none');

	        switch (section) {
	            case '物体':
	                objectTab.setClass('selected');
	                object.setDisplay('');
	                break;
	            case '几何':
	                geometryTab.setClass('selected');
	                geometry.setDisplay('');
	                break;
	            case '材质':
	                materialTab.setClass('selected');
	                material.setDisplay('');
	                break;
	        }
	    }

	    select('物体');

	    return container;
	}

	/**
	* @author mrdoob / http://mrdoob.com/
	*/

	function ScenePanel(editor) {

	    var signals = editor.signals;

	    var container = new UI.Panel();
	    container.setBorderTop('0');
	    container.setPaddingTop('20px');

	    // outliner

	    function buildOption(object, draggable) {

	        var option = document.createElement('div');
	        option.draggable = draggable;
	        option.innerHTML = buildHTML(object);
	        option.value = object.id;

	        return option;
	    }

	    function buildHTML(object) {

	        var html = '<span class="type ' + object.type + '"></span> ' + object.name;

	        if (object instanceof THREE.Mesh) {

	            var geometry = object.geometry;
	            var material = object.material;

	            html += ' <span class="type ' + geometry.type + '"></span> ' + geometry.name;
	            html += ' <span class="type ' + material.type + '"></span> ' + material.name;
	        }

	        html += getScript(object.uuid);

	        return html;
	    }

	    function getScript(uuid) {

	        if (editor.scripts[uuid] !== undefined) {

	            return ' <span class="type Script"></span>';
	        }

	        return '';
	    }

	    var ignoreObjectSelectedSignal = false;

	    var outliner = new UI.Outliner(editor);
	    outliner.setId('outliner');
	    outliner.onChange(function () {

	        ignoreObjectSelectedSignal = true;

	        editor.selectById(parseInt(outliner.getValue()));

	        ignoreObjectSelectedSignal = false;
	    });
	    outliner.onDblClick(function () {

	        editor.focusById(parseInt(outliner.getValue()));
	    });
	    container.add(outliner);
	    container.add(new UI.Break());

	    // background

	    function onBackgroundChanged() {

	        signals.sceneBackgroundChanged.dispatch(backgroundColor.getHexValue());
	    }

	    var backgroundRow = new UI.Row();

	    var backgroundColor = new UI.Color().setValue('#aaaaaa').onChange(onBackgroundChanged);

	    backgroundRow.add(new UI.Text('背景').setWidth('90px'));
	    backgroundRow.add(backgroundColor);

	    container.add(backgroundRow);

	    // fog

	    function onFogChanged() {

	        signals.sceneFogChanged.dispatch(fogType.getValue(), fogColor.getHexValue(), fogNear.getValue(), fogFar.getValue(), fogDensity.getValue());
	    }

	    var fogTypeRow = new UI.Row();
	    var fogType = new UI.Select().setOptions({

	        'None': '无',
	        'Fog': '线性',
	        'FogExp2': '指数型'

	    }).setWidth('150px');
	    fogType.onChange(function () {

	        onFogChanged();
	        refreshFogUI();
	    });

	    fogTypeRow.add(new UI.Text('雾').setWidth('90px'));
	    fogTypeRow.add(fogType);

	    container.add(fogTypeRow);

	    // fog color

	    var fogPropertiesRow = new UI.Row();
	    fogPropertiesRow.setDisplay('none');
	    fogPropertiesRow.setMarginLeft('90px');
	    container.add(fogPropertiesRow);

	    var fogColor = new UI.Color().setValue('#aaaaaa');
	    fogColor.onChange(onFogChanged);
	    fogPropertiesRow.add(fogColor);

	    // fog near

	    var fogNear = new UI.Number(0.1).setWidth('40px').setRange(0, Infinity).onChange(onFogChanged);
	    fogPropertiesRow.add(fogNear);

	    // fog far

	    var fogFar = new UI.Number(50).setWidth('40px').setRange(0, Infinity).onChange(onFogChanged);
	    fogPropertiesRow.add(fogFar);

	    // fog density

	    var fogDensity = new UI.Number(0.05).setWidth('40px').setRange(0, 0.1).setPrecision(3).onChange(onFogChanged);
	    fogPropertiesRow.add(fogDensity);

	    //

	    function refreshUI() {

	        var camera = editor.camera;
	        var scene = editor.scene;

	        var options = [];

	        options.push(buildOption(camera, false));
	        options.push(buildOption(scene, false));

	        (function addObjects(objects, pad) {

	            for (var i = 0, l = objects.length; i < l; i++) {

	                var object = objects[i];

	                var option = buildOption(object, true);
	                option.style.paddingLeft = pad * 10 + 'px';
	                options.push(option);

	                addObjects(object.children, pad + 1);
	            }
	        })(scene.children, 1);

	        outliner.setOptions(options);

	        if (editor.selected !== null) {

	            outliner.setValue(editor.selected.id);
	        }

	        if (scene.background) {

	            backgroundColor.setHexValue(scene.background.getHex());
	        }

	        if (scene.fog) {

	            fogColor.setHexValue(scene.fog.color.getHex());

	            if (scene.fog instanceof THREE.Fog) {

	                fogType.setValue("Fog");
	                fogNear.setValue(scene.fog.near);
	                fogFar.setValue(scene.fog.far);
	            } else if (scene.fog instanceof THREE.FogExp2) {

	                fogType.setValue("FogExp2");
	                fogDensity.setValue(scene.fog.density);
	            }
	        } else {

	            fogType.setValue("None");
	        }

	        refreshFogUI();
	    }

	    function refreshFogUI() {

	        var type = fogType.getValue();

	        fogPropertiesRow.setDisplay(type === 'None' ? 'none' : '');
	        fogNear.setDisplay(type === 'Fog' ? '' : 'none');
	        fogFar.setDisplay(type === 'Fog' ? '' : 'none');
	        fogDensity.setDisplay(type === 'FogExp2' ? '' : 'none');
	    }

	    refreshUI();

	    // events

	    signals.editorCleared.add(refreshUI);

	    signals.sceneGraphChanged.add(refreshUI);

	    signals.objectChanged.add(function (object) {

	        var options = outliner.options;

	        for (var i = 0; i < options.length; i++) {

	            var option = options[i];

	            if (option.value === object.id) {

	                option.innerHTML = buildHTML(object);
	                return;
	            }
	        }
	    });

	    signals.objectSelected.add(function (object) {

	        if (ignoreObjectSelectedSignal === true) return;

	        outliner.setValue(object !== null ? object.id : null);
	    });

	    return container;
	}

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	function ScriptPanel(editor) {

	    var signals = editor.signals;

	    var container = new UI.Panel();
	    container.setDisplay('none');

	    container.add(new UI.Text('脚本'));
	    container.add(new UI.Break());
	    container.add(new UI.Break());

	    //

	    var scriptsContainer = new UI.Row();
	    container.add(scriptsContainer);

	    var newScript = new UI.Button('新建');
	    newScript.onClick(function () {

	        var script = { name: '', source: 'function update( event ) {}' };
	        editor.execute(new AddScriptCommand(editor.selected, script));
	    });
	    container.add(newScript);

	    /*
	    var loadScript = new UI.Button( 'Load' );
	    loadScript.setMarginLeft( '4px' );
	    container.add( loadScript );
	    */

	    //

	    function update() {

	        scriptsContainer.clear();
	        scriptsContainer.setDisplay('none');

	        var object = editor.selected;

	        if (object === null) {

	            return;
	        }

	        var scripts = editor.scripts[object.uuid];

	        if (scripts !== undefined) {

	            scriptsContainer.setDisplay('block');

	            for (var i = 0; i < scripts.length; i++) {

	                (function (object, script) {

	                    var name = new UI.Input(script.name).setWidth('130px').setFontSize('12px');
	                    name.onChange(function () {

	                        editor.execute(new SetScriptValueCommand(editor.selected, script, 'name', this.getValue()));
	                    });
	                    scriptsContainer.add(name);

	                    var edit = new UI.Button('编辑');
	                    edit.setMarginLeft('4px');
	                    edit.onClick(function () {

	                        signals.editScript.dispatch(object, script);
	                    });
	                    scriptsContainer.add(edit);

	                    var remove = new UI.Button('删除');
	                    remove.setMarginLeft('4px');
	                    remove.onClick(function () {

	                        if (confirm('确定吗？')) {

	                            editor.execute(new RemoveScriptCommand(editor.selected, script));
	                        }
	                    });
	                    scriptsContainer.add(remove);

	                    scriptsContainer.add(new UI.Break());
	                })(object, scripts[i]);
	            }
	        }
	    }

	    // signals

	    signals.objectSelected.add(function (object) {

	        if (object !== null) {

	            container.setDisplay('block');

	            update();
	        } else {

	            container.setDisplay('none');
	        }
	    });

	    signals.scriptAdded.add(update);
	    signals.scriptRemoved.add(update);
	    signals.scriptChanged.add(update);

	    return container;
	}

	/**
	* @author mrdoob / http://mrdoob.com/
	*/

	function SettingPanel(editor) {

	    var config = editor.config;
	    var signals = editor.signals;

	    var container = new UI.Panel();
	    container.setBorderTop('0');
	    container.setPaddingTop('20px');

	    // class

	    var options = {
	        '../assets/css/light.css': '浅色',
	        '../assets/css/dark.css': '深色'
	    };

	    var themeRow = new UI.Row();
	    var theme = new UI.Select().setWidth('150px');
	    theme.setOptions(options);

	    if (config.getKey('theme') !== undefined) {

	        theme.setValue(config.getKey('theme'));
	    }

	    theme.onChange(function () {

	        var value = this.getValue();

	        editor.setTheme(value);
	        editor.config.setKey('theme', value);
	    });

	    themeRow.add(new UI.Text('主题').setWidth('90px'));
	    themeRow.add(theme);

	    container.add(themeRow);

	    return container;
	}

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	function Panel(editor) {

	    var container = new UI.Panel();
	    container.setId('sidebar');

	    //

	    var sceneTab = new UI.Text('场景').onClick(onClick);
	    var projectTab = new UI.Text('工程').onClick(onClick);
	    var settingsTab = new UI.Text('设置').onClick(onClick);

	    var tabs = new UI.Div();
	    tabs.setId('tabs');
	    tabs.add(sceneTab, projectTab, settingsTab);
	    container.add(tabs);

	    function onClick(event) {

	        select(event.target.textContent);
	    }

	    //

	    var scene = new UI.Span().add(new ScenePanel(editor), new PropertyPanel(editor), new AnimationPanel(editor), new ScriptPanel(editor));
	    container.add(scene);

	    var project = new UI.Span().add(new ProjectPanel(editor));
	    container.add(project);

	    var settings = new UI.Span().add(new SettingPanel(editor), new HistoryPanel(editor));
	    container.add(settings);

	    //

	    function select(section) {

	        sceneTab.setClass('');
	        projectTab.setClass('');
	        settingsTab.setClass('');

	        scene.setDisplay('none');
	        project.setDisplay('none');
	        settings.setDisplay('none');

	        switch (section) {
	            case '场景':
	                sceneTab.setClass('selected');
	                scene.setDisplay('');
	                break;
	            case '工程':
	                projectTab.setClass('selected');
	                project.setDisplay('');
	                break;
	            case '设置':
	                settingsTab.setClass('selected');
	                settings.setDisplay('');
	                break;
	        }
	    }

	    select('场景');

	    return container;
	}

	/**
	* @author mrdoob / http://mrdoob.com/
	*/

	function Config(name) {

	        var storage = {
	                'autosave': true,
	                'theme': '../assets/css/light.css',

	                'project/renderer': 'WebGLRenderer',
	                'project/renderer/antialias': true,
	                'project/renderer/gammaInput': false,
	                'project/renderer/gammaOutput': false,
	                'project/renderer/shadows': true,
	                'project/vr': false,

	                'settings/history': false
	        };

	        if (window.localStorage[name] === undefined) {

	                window.localStorage[name] = JSON.stringify(storage);
	        } else {

	                var data = JSON.parse(window.localStorage[name]);

	                for (var key in data) {

	                        storage[key] = data[key];
	                }
	        }

	        return {

	                getKey: function getKey(key) {

	                        return storage[key];
	                },

	                setKey: function setKey() {
	                        // key, value, key, value ...

	                        for (var i = 0, l = arguments.length; i < l; i += 2) {

	                                storage[arguments[i]] = arguments[i + 1];
	                        }

	                        window.localStorage[name] = JSON.stringify(storage);

	                        console.log('[' + /\d\d\:\d\d\:\d\d/.exec(new Date())[0] + ']', '保存配置到LocalStorage。');
	                },

	                clear: function clear() {

	                        delete window.localStorage[name];
	                }

	        };
	}

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	function Editor() {

	        this.DEFAULT_CAMERA = new THREE.PerspectiveCamera(50, 1, 0.1, 10000);
	        this.DEFAULT_CAMERA.name = 'Camera';
	        this.DEFAULT_CAMERA.position.set(20, 10, 20);
	        this.DEFAULT_CAMERA.lookAt(new THREE.Vector3());

	        var Signal = signals.Signal;

	        this.signals = {

	                // script

	                editScript: new Signal(),

	                // player

	                startPlayer: new Signal(),
	                stopPlayer: new Signal(),

	                // vr

	                enterVR: new Signal(),

	                enteredVR: new Signal(),
	                exitedVR: new Signal(),

	                // actions

	                showModal: new Signal(),

	                // notifications

	                editorCleared: new Signal(),

	                savingStarted: new Signal(),
	                savingFinished: new Signal(),

	                themeChanged: new Signal(),

	                transformModeChanged: new Signal(),
	                snapChanged: new Signal(),
	                spaceChanged: new Signal(),
	                rendererChanged: new Signal(),

	                sceneBackgroundChanged: new Signal(),
	                sceneFogChanged: new Signal(),
	                sceneGraphChanged: new Signal(),

	                cameraChanged: new Signal(),

	                geometryChanged: new Signal(),

	                objectSelected: new Signal(),
	                objectFocused: new Signal(),

	                objectAdded: new Signal(),
	                objectChanged: new Signal(),
	                objectRemoved: new Signal(),

	                helperAdded: new Signal(),
	                helperRemoved: new Signal(),

	                materialChanged: new Signal(),

	                scriptAdded: new Signal(),
	                scriptChanged: new Signal(),
	                scriptRemoved: new Signal(),

	                windowResize: new Signal(),

	                showGridChanged: new Signal(),
	                refreshSidebarObject3D: new Signal(),
	                historyChanged: new Signal(),
	                refreshScriptEditor: new Signal()

	        };

	        this.config = new Config('threejs-editor');
	        this.history = new History(this);
	        this.storage = new Storage();
	        this.loader = new Loader(this);

	        this.camera = this.DEFAULT_CAMERA.clone();

	        this.scene = new THREE.Scene();
	        this.scene.name = 'Scene';
	        this.scene.background = new THREE.Color(0xaaaaaa);

	        this.sceneHelpers = new THREE.Scene();

	        this.object = {};
	        this.geometries = {};
	        this.materials = {};
	        this.textures = {};
	        this.scripts = {};

	        this.selected = null;
	        this.helpers = {};
	}
	Editor.prototype = {

	        setTheme: function setTheme(value) {

	                document.getElementById('theme').href = value;

	                this.signals.themeChanged.dispatch(value);
	        },

	        //

	        setScene: function setScene(scene) {

	                this.scene.uuid = scene.uuid;
	                this.scene.name = scene.name;

	                if (scene.background !== null) this.scene.background = scene.background.clone();
	                if (scene.fog !== null) this.scene.fog = scene.fog.clone();

	                this.scene.userData = JSON.parse(JSON.stringify(scene.userData));

	                // avoid render per object

	                this.signals.sceneGraphChanged.active = false;

	                while (scene.children.length > 0) {

	                        this.addObject(scene.children[0]);
	                }

	                this.signals.sceneGraphChanged.active = true;
	                this.signals.sceneGraphChanged.dispatch();
	        },

	        //

	        addObject: function addObject(object) {

	                var scope = this;

	                object.traverse(function (child) {

	                        if (child.geometry !== undefined) scope.addGeometry(child.geometry);
	                        if (child.material !== undefined) scope.addMaterial(child.material);

	                        scope.addHelper(child);
	                });

	                this.scene.add(object);

	                this.signals.objectAdded.dispatch(object);
	                this.signals.sceneGraphChanged.dispatch();
	        },

	        moveObject: function moveObject(object, parent, before) {

	                if (parent === undefined) {

	                        parent = this.scene;
	                }

	                parent.add(object);

	                // sort children array

	                if (before !== undefined) {

	                        var index = parent.children.indexOf(before);
	                        parent.children.splice(index, 0, object);
	                        parent.children.pop();
	                }

	                this.signals.sceneGraphChanged.dispatch();
	        },

	        nameObject: function nameObject(object, name) {

	                object.name = name;
	                this.signals.sceneGraphChanged.dispatch();
	        },

	        removeObject: function removeObject(object) {

	                if (object.parent === null) return; // avoid deleting the camera or scene

	                var scope = this;

	                object.traverse(function (child) {

	                        scope.removeHelper(child);
	                });

	                object.parent.remove(object);

	                this.signals.objectRemoved.dispatch(object);
	                this.signals.sceneGraphChanged.dispatch();
	        },

	        addGeometry: function addGeometry(geometry) {

	                this.geometries[geometry.uuid] = geometry;
	        },

	        setGeometryName: function setGeometryName(geometry, name) {

	                geometry.name = name;
	                this.signals.sceneGraphChanged.dispatch();
	        },

	        addMaterial: function addMaterial(material) {

	                this.materials[material.uuid] = material;
	        },

	        setMaterialName: function setMaterialName(material, name) {

	                material.name = name;
	                this.signals.sceneGraphChanged.dispatch();
	        },

	        addTexture: function addTexture(texture) {

	                this.textures[texture.uuid] = texture;
	        },

	        //

	        addHelper: function () {

	                var geometry = new THREE.SphereBufferGeometry(2, 4, 2);
	                var material = new THREE.MeshBasicMaterial({ color: 0xff0000, visible: false });

	                return function (object) {

	                        var helper;

	                        if (object instanceof THREE.Camera) {

	                                helper = new THREE.CameraHelper(object, 1);
	                        } else if (object instanceof THREE.PointLight) {

	                                helper = new THREE.PointLightHelper(object, 1);
	                        } else if (object instanceof THREE.DirectionalLight) {

	                                helper = new THREE.DirectionalLightHelper(object, 1);
	                        } else if (object instanceof THREE.SpotLight) {

	                                helper = new THREE.SpotLightHelper(object, 1);
	                        } else if (object instanceof THREE.HemisphereLight) {

	                                helper = new THREE.HemisphereLightHelper(object, 1);
	                        } else if (object instanceof THREE.SkinnedMesh) {

	                                helper = new THREE.SkeletonHelper(object);
	                        } else {

	                                // no helper for this object type
	                                return;
	                        }

	                        var picker = new THREE.Mesh(geometry, material);
	                        picker.name = 'picker';
	                        picker.userData.object = object;
	                        helper.add(picker);

	                        this.sceneHelpers.add(helper);
	                        this.helpers[object.id] = helper;

	                        this.signals.helperAdded.dispatch(helper);
	                };
	        }(),

	        removeHelper: function removeHelper(object) {

	                if (this.helpers[object.id] !== undefined) {

	                        var helper = this.helpers[object.id];
	                        helper.parent.remove(helper);

	                        delete this.helpers[object.id];

	                        this.signals.helperRemoved.dispatch(helper);
	                }
	        },

	        //

	        addScript: function addScript(object, script) {

	                if (this.scripts[object.uuid] === undefined) {

	                        this.scripts[object.uuid] = [];
	                }

	                this.scripts[object.uuid].push(script);

	                this.signals.scriptAdded.dispatch(script);
	        },

	        removeScript: function removeScript(object, script) {

	                if (this.scripts[object.uuid] === undefined) return;

	                var index = this.scripts[object.uuid].indexOf(script);

	                if (index !== -1) {

	                        this.scripts[object.uuid].splice(index, 1);
	                }

	                this.signals.scriptRemoved.dispatch(script);
	        },

	        //

	        select: function select(object) {

	                if (this.selected === object) return;

	                var uuid = null;

	                if (object !== null) {

	                        uuid = object.uuid;
	                }

	                this.selected = object;

	                this.config.setKey('selected', uuid);
	                this.signals.objectSelected.dispatch(object);
	        },

	        selectById: function selectById(id) {

	                if (id === this.camera.id) {

	                        this.select(this.camera);
	                        return;
	                }

	                this.select(this.scene.getObjectById(id, true));
	        },

	        selectByUuid: function selectByUuid(uuid) {

	                var scope = this;

	                this.scene.traverse(function (child) {

	                        if (child.uuid === uuid) {

	                                scope.select(child);
	                        }
	                });
	        },

	        deselect: function deselect() {

	                this.select(null);
	        },

	        focus: function focus(object) {

	                this.signals.objectFocused.dispatch(object);
	        },

	        focusById: function focusById(id) {

	                this.focus(this.scene.getObjectById(id, true));
	        },

	        clear: function clear() {

	                this.history.clear();
	                this.storage.clear();

	                this.camera.copy(this.DEFAULT_CAMERA);
	                this.scene.background.setHex(0xaaaaaa);
	                this.scene.fog = null;

	                var objects = this.scene.children;

	                while (objects.length > 0) {

	                        this.removeObject(objects[0]);
	                }

	                this.geometries = {};
	                this.materials = {};
	                this.textures = {};
	                this.scripts = {};

	                this.deselect();

	                this.signals.editorCleared.dispatch();
	        },

	        //

	        fromJSON: function fromJSON(json) {

	                var loader = new THREE.ObjectLoader();

	                // backwards

	                if (json.scene === undefined) {

	                        this.setScene(loader.parse(json));
	                        return;
	                }

	                var camera = loader.parse(json.camera);

	                this.camera.copy(camera);
	                this.camera.aspect = this.DEFAULT_CAMERA.aspect;
	                this.camera.updateProjectionMatrix();

	                this.history.fromJSON(json.history);
	                this.scripts = json.scripts;

	                this.setScene(loader.parse(json.scene));
	        },

	        toJSON: function toJSON() {

	                // scripts clean up

	                var scene = this.scene;
	                var scripts = this.scripts;

	                for (var key in scripts) {

	                        var script = scripts[key];

	                        if (script.length === 0 || scene.getObjectByProperty('uuid', key) === undefined) {

	                                delete scripts[key];
	                        }
	                }

	                //

	                return {

	                        metadata: {},
	                        project: {
	                                gammaInput: this.config.getKey('project/renderer/gammaInput'),
	                                gammaOutput: this.config.getKey('project/renderer/gammaOutput'),
	                                shadows: this.config.getKey('project/renderer/shadows'),
	                                vr: this.config.getKey('project/vr')
	                        },
	                        camera: this.camera.toJSON(),
	                        scene: this.scene.toJSON(),
	                        scripts: this.scripts,
	                        history: this.history.toJSON()

	                };
	        },

	        objectByUuid: function objectByUuid(uuid) {

	                return this.scene.getObjectByProperty('uuid', uuid, true);
	        },

	        execute: function execute(cmd, optionalName) {

	                this.history.execute(cmd, optionalName);
	        },

	        undo: function undo() {

	                this.history.undo();
	        },

	        redo: function redo() {

	                this.history.redo();
	        }

	};

	window.URL = window.URL || window.webkitURL;
	window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;

	Number.prototype.format = function () {
	    return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	};

	/**
	 * Application
	 */
	function Application() {
	    var editor = new Editor();

	    var viewport = new Viewport(editor);
	    document.body.appendChild(viewport.dom);

	    var script = new Script(editor);
	    document.body.appendChild(script.dom);

	    var player = new Player(editor);
	    document.body.appendChild(player.dom);

	    var toolbar = new Toolbar(editor);
	    document.body.appendChild(toolbar.dom);

	    var menubar = new Menubar(editor);
	    document.body.appendChild(menubar.dom);

	    var sidebar = new Panel(editor);
	    document.body.appendChild(sidebar.dom);

	    var modal = new UI.Modal();
	    document.body.appendChild(modal.dom);

	    //

	    editor.setTheme(editor.config.getKey('theme'));

	    editor.storage.init(function () {

	        editor.storage.get(function (state) {

	            if (isLoadingFromHash) return;

	            if (state !== undefined) {

	                editor.fromJSON(state);
	            }

	            var selected = editor.config.getKey('selected');

	            if (selected !== undefined) {

	                editor.selectByUuid(selected);
	            }
	        });

	        //

	        var timeout;

	        function saveState(scene) {

	            if (editor.config.getKey('autosave') === false) {

	                return;
	            }

	            clearTimeout(timeout);

	            timeout = setTimeout(function () {

	                editor.signals.savingStarted.dispatch();

	                timeout = setTimeout(function () {

	                    editor.storage.set(editor.toJSON());

	                    editor.signals.savingFinished.dispatch();
	                }, 100);
	            }, 1000);
	        }
	        var signals = editor.signals;

	        signals.geometryChanged.add(saveState);
	        signals.objectAdded.add(saveState);
	        signals.objectChanged.add(saveState);
	        signals.objectRemoved.add(saveState);
	        signals.materialChanged.add(saveState);
	        signals.sceneBackgroundChanged.add(saveState);
	        signals.sceneFogChanged.add(saveState);
	        signals.sceneGraphChanged.add(saveState);
	        signals.scriptChanged.add(saveState);
	        signals.historyChanged.add(saveState);

	        signals.showModal.add(function (content) {

	            modal.show(content);
	        });
	    });

	    //

	    document.addEventListener('dragover', function (event) {

	        event.preventDefault();
	        event.dataTransfer.dropEffect = 'copy';
	    }, false);

	    document.addEventListener('drop', function (event) {

	        event.preventDefault();

	        if (event.dataTransfer.files.length > 0) {

	            editor.loader.loadFile(event.dataTransfer.files[0]);
	        }
	    }, false);

	    document.addEventListener('keydown', function (event) {

	        switch (event.keyCode) {

	            case 8:
	                // backspace

	                event.preventDefault(); // prevent browser back

	            case 46:
	                // delete

	                var object = editor.selected;

	                if (confirm('Delete ' + object.name + '?') === false) return;

	                var parent = object.parent;
	                if (parent !== null) editor.execute(new RemoveObjectCommand(object));

	                break;

	            case 90:
	                // Register Ctrl-Z for Undo, Ctrl-Shift-Z for Redo

	                if (event.ctrlKey && event.shiftKey) {

	                    editor.redo();
	                } else if (event.ctrlKey) {

	                    editor.undo();
	                }

	                break;

	            case 87:
	                // Register W for translation transform mode

	                editor.signals.transformModeChanged.dispatch('translate');

	                break;

	            case 69:
	                // Register E for rotation transform mode

	                editor.signals.transformModeChanged.dispatch('rotate');

	                break;

	            case 82:
	                // Register R for scaling transform mode

	                editor.signals.transformModeChanged.dispatch('scale');

	                break;

	        }
	    }, false);

	    function onWindowResize(event) {

	        editor.signals.windowResize.dispatch();
	    }

	    window.addEventListener('resize', onWindowResize, false);

	    onWindowResize();

	    //

	    var isLoadingFromHash = false;
	    var hash = window.location.hash;

	    if (hash.substr(1, 5) === 'file=') {

	        var file = hash.substr(6);

	        if (confirm('未保存数据将丢失。确定吗？')) {

	            var loader = new THREE.FileLoader();
	            loader.crossOrigin = '';
	            loader.load(file, function (text) {

	                editor.clear();
	                editor.fromJSON(JSON.parse(text));
	            });

	            isLoadingFromHash = true;
	        }
	    }

	    /*
	    window.addEventListener( 'message', function ( event ) {
	    
	        editor.clear();
	        editor.fromJSON( event.data );
	    
	    }, false );
	    */

	    // VR

	    var groupVR;

	    // TODO: Use editor.signals.enteredVR (WebVR 1.0)

	    editor.signals.enterVR.add(function () {

	        if (groupVR === undefined) {
	            var updateTexture = function updateTexture() {

	                mesh.material.map.update();
	            };

	            groupVR = new THREE.HTMLGroup(viewport.dom);
	            editor.sceneHelpers.add(groupVR);

	            var mesh = new THREE.HTMLMesh(sidebar.dom);
	            mesh.position.set(15, 0, 15);
	            mesh.rotation.y = -0.5;
	            groupVR.add(mesh);

	            var signals = editor.signals;

	            signals.objectSelected.add(updateTexture);
	            signals.objectAdded.add(updateTexture);
	            signals.objectChanged.add(updateTexture);
	            signals.objectRemoved.add(updateTexture);
	            signals.sceneGraphChanged.add(updateTexture);
	            signals.historyChanged.add(updateTexture);
	        }

	        groupVR.visible = true;
	    });

	    editor.signals.exitedVR.add(function () {

	        if (groupVR !== undefined) groupVR.visible = false;
	    });
	}

	exports.Config = Config;
	exports.Editor = Editor;
	exports.Application = Application;
	exports.History = History;
	exports.Storage = Storage;
	exports.Loader = Loader;
	exports.Player = Player;
	exports.Script = Script;
	exports.Command = Command;
	exports.AddObjectCommand = AddObjectCommand$1;
	exports.AddScriptCommand = AddScriptCommand;
	exports.MoveObjectCommand = MoveObjectCommand;
	exports.MultiCmdsCommand = MultiCmdsCommand;
	exports.RemoveObjectCommand = RemoveObjectCommand$1;
	exports.RemoveScriptCommand = RemoveScriptCommand;
	exports.SetColorCommand = SetColorCommand;
	exports.SetGeometryCommand = SetGeometryCommand$1;
	exports.SetGeometryValueCommand = SetGeometryValueCommand;
	exports.SetMaterialColorCommand = SetMaterialColorCommand;
	exports.SetMaterialCommand = SetMaterialCommand;
	exports.SetMaterialMapCommand = SetMaterialMapCommand;
	exports.SetMaterialValueCommand = SetMaterialValueCommand$1;
	exports.SetPositionCommand = SetPositionCommand;
	exports.SetRotationCommand = SetRotationCommand;
	exports.SetScaleCommand = SetScaleCommand;
	exports.SetSceneCommand = SetSceneCommand;
	exports.SetScriptValueCommand = SetScriptValueCommand;
	exports.SetUuidCommand = SetUuidCommand$1;
	exports.SetValueCommand = SetValueCommand$1;
	exports.ViewportInfo = ViewportInfo;
	exports.Viewport = Viewport;
	exports.Toolbar = Toolbar;
	exports.AddMenu = AddMenu;
	exports.EditMenu = EditMenu;
	exports.ExampleMenu = ExampleMenu;
	exports.FileMenu = FileMenu;
	exports.HelpMenu = HelpMenu;
	exports.PlayMenu = PlayMenu;
	exports.StatusMenu = StatusMenu;
	exports.ViewMenu = ViewMenu;
	exports.Menubar = Menubar;
	exports.AnimationPanel = AnimationPanel;
	exports.HistoryPanel = HistoryPanel;
	exports.MaterialPanel = MaterialPanel;
	exports.ObjectPanel = ObjectPanel;
	exports.ProjectPanel = ProjectPanel;
	exports.PropertyPanel = PropertyPanel;
	exports.ScenePanel = ScenePanel;
	exports.ScriptPanel = ScriptPanel;
	exports.SettingPanel = SettingPanel;
	exports.Panel = Panel;
	exports.GeometryGeometryPanel = GeometryGeometryPanel;
	exports.BoxGeometryPanel = BoxGeometryPanel;
	exports.BufferGeometryPanel = BufferGeometryPanel;
	exports.CircleGeometryPanel = CircleGeometryPanel;
	exports.CylinderGeometryPanel = CylinderGeometryPanel;
	exports.GeometryModifyPanel = GeometryModifyPanel;
	exports.IcosahedronGeometryPanel = IcosahedronGeometryPanel;
	exports.LatheGeometryPanel = LatheGeometryPanel;
	exports.PlaneGeometryPanel = PlaneGeometryPanel;
	exports.SphereGeometryPanel = SphereGeometryPanel;
	exports.TeapotBufferGeometryPanel = TeapotBufferGeometryPanel;
	exports.TorusGeometryPanel = TorusGeometryPanel;
	exports.TorusKnotGeometryPanel = TorusKnotGeometryPanel;
	exports.GeometryPanel = GeometryPanel;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
