import Config from '../core/Config';
import History from '../core/History';
import Storage from '../core/Storage';
import Loader from '../core/Loader';

/**
 * 编辑器
 * @author mrdoob / http://mrdoob.com/
 */
function Editor(app) {
    this.app = app;

    // 基础
    this.config = new Config('threejs-editor');
    this.history = new History(this);
    this.storage = new Storage();
    this.loader = new Loader(this);

    // 场景
    this.scene = new THREE.Scene();
    this.scene.name = 'Scene';
    this.scene.background = new THREE.Color(0xaaaaaa);

    this.sceneHelpers = new THREE.Scene();

    // 相机
    this.DEFAULT_CAMERA = new THREE.PerspectiveCamera(50, 1, 0.1, 10000);
    this.DEFAULT_CAMERA.name = 'Camera';
    this.DEFAULT_CAMERA.position.set(20, 10, 20);
    this.DEFAULT_CAMERA.lookAt(new THREE.Vector3());

    this.camera = this.DEFAULT_CAMERA.clone();



    // 缓存
    this.object = {};
    this.geometries = {};
    this.materials = {};
    this.textures = {};
    this.scripts = {};
    this.helpers = {};

    this.selected = null;
};

// -------------------- 编辑器 --------------------------

Editor.prototype.setTheme = function (value) { // 设置主题
    this.app.call('setTheme', this, value);
};

Editor.prototype.setScene = function (scene) { // 设置场景
    this.app.call('setScene', this, scene);
};

// ---------------------- 物体 ---------------------------

Editor.prototype.objectByUuid = function (uuid) { // 根据uuid获取物体
    return this.scene.getObjectByProperty('uuid', uuid, true);
};

Editor.prototype.addObject = function (object) { // 添加物体
    this.app.call('addObject', this, object);
};

Editor.prototype.moveObject = function (object, parent, before) { // 移动物体
    this.app.call('moveObject', this, object, parent, before);
};

Editor.prototype.nameObject = function (object, name) { // 重命名物体
    this.app.call('nameObject', this, object, name);
};

Editor.prototype.removeObject = function (object) { // 移除物体
    this.app.call('removeObject', this, object);
};

Editor.prototype.addGeometry = function (geometry) { // 添加几何体
    this.app.call('addGeometry', this, geometry);
};

Editor.prototype.setGeometryName = function (geometry, name) { // 设置几何体名称
    this.app.call('setGeometryName', this, geometry, name);
};

Editor.prototype.addMaterial = function (material) { // 添加材质
    this.app.call('addMaterial', this, material);
};

Editor.prototype.setMaterialName = function (material, name) { // 设置材质名称事件
    this.app.call('setMaterialName', this, material, name);
};

Editor.prototype.addTexture = function (texture) { // 添加纹理事件
    this.app.call('addTexture', this, texture);
};

// ------------------------- 帮助 ------------------------------

Editor.prototype.addHelper = function (object) { // 添加物体帮助
    this.app.call('addHelper', this, object);
};

Editor.prototype.removeHelper = function (object) { // 移除物体帮助
    this.app.call('removeHelper', this, object);
};

// ------------------------ 脚本 ----------------------------

Editor.prototype.addScript = function (object, script) { // 添加脚本
    this.app.call('addScript', this, object, script);
};

Editor.prototype.removeScript = function (object, script) { // 移除脚本
    this.app.call('removeScript', this, object, script);
};

// ------------------------ 选中事件 --------------------------------

Editor.prototype.select = function (object) { // 选中物体
    this.app.call('select', this, object);
};

Editor.prototype.selectById = function (id) { // 根据id选中物体
    if (id === this.camera.id) {
        this.select(this.camera);
        return;
    }

    this.select(this.scene.getObjectById(id, true));
};

Editor.prototype.selectByUuid = function (uuid) { // 根据uuid选中物体
    var _this = this;
    this.scene.traverse(function (child) {
        if (child.uuid === uuid) {
            _this.select(child);
        }
    });
};

Editor.prototype.deselect = function () { // 取消选中物体
    this.select(null);
};

// ---------------------- 焦点事件 --------------------------

Editor.prototype.focus = function (object) { // 设置焦点
    this.app.call('objectFocused', this, object);
};

Editor.prototype.focusById = function (id) { // 根据id设置交点
    this.focus(this.scene.getObjectById(id, true));
};

// ----------------------- 场景事件 ----------------------------

Editor.prototype.clear = function () { // 清空场景
    this.app.call('clear', this);
};

Editor.prototype.load = function () { // 加载场景
    this.app.call('load', this);
};

Editor.prototype.save = function () { // 保存场景
    this.app.call('save', this);
};

// --------------------- 命令事件 ------------------------

Editor.prototype.execute = function (cmd, optionalName) { // 执行事件
    this.history.execute(cmd, optionalName);
};

Editor.prototype.undo = function () { // 撤销事件
    this.history.undo();
};

Editor.prototype.redo = function () { // 重做事件
    this.history.redo();
};

// ------------------------- 序列化 ----------------------------

Editor.prototype.fromJSON = function (json) { // 根据json创建场景
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
};

Editor.prototype.toJSON = function () { // 将json转换为场景
    // scripts clean up
    var scene = this.scene;
    var scripts = this.scripts;

    for (var key in scripts) {
        var script = scripts[key];

        if (script.length === 0 || scene.getObjectByProperty('uuid', key) === undefined) {
            delete scripts[key];
        }
    }

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
};

export default Editor;