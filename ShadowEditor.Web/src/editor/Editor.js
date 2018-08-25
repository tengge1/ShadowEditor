import History from '../core/History';
import Storage from '../core/Storage';

/**
 * 编辑器
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function Editor(app) {
    this.app = app;
    this.app.editor = this;

    // 基础
    this.history = new History(this);
    this.storage = new Storage();

    // 场景
    this.scene = new THREE.Scene();
    this.scene.name = '场景';
    this.scene.background = new THREE.Color(0xaaaaaa);

    this.sceneHelpers = new THREE.Scene();

    this.sceneID = null; // 当前场景ID
    this.sceneName = null; // 当前场景名称

    // 相机
    this.DEFAULT_CAMERA = new THREE.PerspectiveCamera(50, 1, 0.1, 10000);
    this.DEFAULT_CAMERA.name = '默认相机';
    this.DEFAULT_CAMERA.position.set(20, 10, 20);
    this.DEFAULT_CAMERA.lookAt(new THREE.Vector3());

    this.camera = this.DEFAULT_CAMERA.clone();

    // 渲染器
    this.renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    this.renderer.gammaInput = false;
    this.renderer.gammaOutput = false;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.autoClear = false;
    this.renderer.autoUpdateScene = false;
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.app.viewport.container.dom.appendChild(this.renderer.domElement);
    this.renderer.setSize(this.app.viewport.container.dom.offsetWidth, this.app.viewport.container.dom.offsetHeight);

    // 缓存
    this.object = {};
    this.objects = [];
    this.scripts = {};
    this.helpers = {};

    // 当前选中物体
    this.selected = null;

    // 天空
    this.sky = new THREE.Sky();
    this.sky.name = '天空盒';
    this.sky.scale.setScalar(450000);
    this.scene.add(this.sky);

    var uniforms = this.sky.material.uniforms;
    uniforms.turbidity.value = 10;
    uniforms.rayleigh.value = 2;
    uniforms.luminance.value = 1;
    uniforms.mieCoefficient.value = 0.005;
    uniforms.mieDirectionalG.value = 0.8;

    var theta = Math.PI * (0.49 - 0.5);
    var phi = 2 * Math.PI * (0.25 - 0.5);
    var distance = 400000;

    var x = distance * Math.cos(phi);
    var y = distance * Math.sin(phi) * Math.sin(theta);
    var z = distance * Math.sin(phi) * Math.cos(theta);

    uniforms.sunPosition.value.set(x, y, z);

    // 网格
    this.grid = new THREE.GridHelper(30, 30, 0x444444, 0x888888);
    this.sceneHelpers.add(this.grid);

    // 平移旋转缩放控件
    this.transformControls = new THREE.TransformControls(this.camera, this.app.viewport.container.dom);
    this.sceneHelpers.add(this.transformControls);

    // 编辑器控件
    this.controls = new THREE.EditorControls(this.camera, this.app.viewport.container.dom);

    // 性能控件
    this.stats = new Stats();
    this.stats.dom.style.position = 'absolute';
    this.stats.dom.style.left = '8px';
    this.stats.dom.style.top = '8px';
    this.stats.dom.style.zIndex = 'initial';
    this.app.viewport.container.dom.appendChild(this.stats.dom);
};

// -------------------- 编辑器 --------------------------

Editor.prototype.setScene = function (scene) { // 设置场景
    var editor = this.editor;

    editor.scene.uuid = scene.uuid;
    editor.scene.name = scene.name;

    if (scene.background !== null) editor.scene.background = scene.background.clone();
    if (scene.fog !== null) editor.scene.fog = scene.fog.clone();

    editor.scene.userData = JSON.parse(JSON.stringify(scene.userData));

    while (scene.children.length > 0) {
        editor.addObject(scene.children[0]);
    }

    this.app.call('sceneGraphChanged', this);
};

// ---------------------- 物体 ---------------------------

Editor.prototype.objectByUuid = function (uuid) { // 根据uuid获取物体
    return this.scene.getObjectByProperty('uuid', uuid, true);
};

Editor.prototype.addObject = function (object) { // 添加物体
    this.scene.add(object);

    object.traverse(child => {
        this.addHelper(child);
    });

    this.app.call('objectAdded', this, object);
    this.app.call('sceneGraphChanged', this);
};

Editor.prototype.moveObject = function (object, parent, before) { // 移动物体
    this.app.call('moveObject', this, object, parent, before);
};

Editor.prototype.removeObject = function (object) { // 移除物体
    this.app.call('removeObject', this, object);
};

// ------------------------- 帮助 ------------------------------

Editor.prototype.addHelper = function (object) { // 添加物体帮助器
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
    var obj = this.scene.getObjectById(id, true);
    if (obj) {
        this.focus(obj);
    }
};

// ----------------------- 场景事件 ----------------------------

Editor.prototype.clear = function () { // 清空场景
    this.app.call('clear', this);
};

Editor.prototype.load = function () { // 加载场景
    this.app.call('load', this);
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

Editor.prototype.toJSON = function () { // 将场景转换为json
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
        camera: this.camera.toJSON(),
        scene: this.scene.toJSON(),
        scripts: this.scripts,
        history: this.history.toJSON()
    };
};

export default Editor;