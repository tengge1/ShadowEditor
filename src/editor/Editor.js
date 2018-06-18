import Config from '../core/Config';
import History from '../core/History';
import Storage from '../core/Storage';
import Loader from '../core/Loader';

/**
 * @author mrdoob / http://mrdoob.com/
 */
function Editor(app) {
    this.app = app;

    this.DEFAULT_CAMERA = new THREE.PerspectiveCamera(50, 1, 0.1, 10000);
    this.DEFAULT_CAMERA.name = 'Camera';
    this.DEFAULT_CAMERA.position.set(20, 10, 20);
    this.DEFAULT_CAMERA.lookAt(new THREE.Vector3());

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

};

Editor.prototype = {

    // ----------------- 编辑器 ---------------------

    setTheme: function (value) { // 设置主题
        this.app.call('setTheme', this, value);
    },

    setScene: function (scene) { // 设置场景
        this.app.call('setScene', this, scene);
    },

    // ------------------ 物体 --------------------------

    objectByUuid: function (uuid) { // 根据uuid获取物体
        return this.scene.getObjectByProperty('uuid', uuid, true);
    },

    addObject: function (object) { // 添加物体
        this.app.call('addObject', this, object);
    },

    moveObject: function (object, parent, before) { // 移动物体
        this.app.call('moveObject', this, object, parent, before);
    },

    nameObject: function (object, name) { // 重命名物体
        this.app.call('nameObject', this, object, name);
    },

    removeObject: function (object) { // 移除物体
        this.app.call('removeObject', this, object);
    },

    addGeometry: function (geometry) { // 添加几何体
        this.app.call('addGeometry', this, geometry);
    },

    setGeometryName: function (geometry, name) { // 设置几何体名称
        this.app.call('setGeometryName', this, geometry, name);
    },

    addMaterial: function (material) { // 添加材质
        this.app.call('addMaterial', this, material);
    },

    setMaterialName: function (material, name) { // 设置材质名称事件
        this.app.call('setMaterialName', this, material, name);
    },

    addTexture: function (texture) { // 添加纹理事件
        this.app.call('addTexture', this, texture);
    },

    // --------------------- 帮助 -------------------------------

    addHelper: function (object) { // 添加物体帮助
        this.app.call('addHelper', this, object);
    },

    removeHelper: function (object) { // 移除物体帮助
        this.app.call('removeHelper', this, object);
    },

    // --------------------- 脚本 ----------------------------

    addScript: function (object, script) { // 添加脚本
        this.app.call('addScript', this, object, script);
    },

    removeScript: function (object, script) { // 移除脚本
        this.app.call('removeScript', this, object, script);
    },

    // ----------------------- 选择事件 ---------------------------

    select: function (object) { // 选中物体
        this.app.call('select', this, object);
    },

    selectById: function (id) { // 根据id选中物体
        if (id === this.camera.id) {
            this.select(this.camera);
            return;
        }

        this.select(this.scene.getObjectById(id, true));
    },

    selectByUuid: function (uuid) { // 根据uuid选中物体
        var _this = this;
        this.scene.traverse(function (child) {
            if (child.uuid === uuid) {
                _this.select(child);
            }
        });
    },

    deselect: function () { // 取消选中物体
        this.select(null);
    },

    // -------------------- 设置焦点事件 --------------------------

    focus: function (object) { // 设置焦点
        this.app.call('objectFocused', this, object);
    },

    focusById: function (id) { // 根据id设置交点
        this.focus(this.scene.getObjectById(id, true));
    },

    // -------------------------- 场景事件 ---------------------------

    clear: function () { // 清空场景
        this.app.call('clear', this);
    },

    load: function () { // 加载场景
        this.app.call('load', this);
    },

    save: function () { // 保存场景
        this.app.call('save', this);
    },

    // --------------------------- 场景序列化 ------------------------------

    fromJSON: function (json) { // 根据json创建场景

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

    toJSON: function () { // 将json转换为场景

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

    // ----------------------- 命令 ---------------------------

    execute: function (cmd, optionalName) { // 执行事件
        this.history.execute(cmd, optionalName);
    },

    undo: function () { // 撤销事件
        this.history.undo();
    },

    redo: function () { // 重做事件
        this.history.redo();
    }

};

export default Editor;