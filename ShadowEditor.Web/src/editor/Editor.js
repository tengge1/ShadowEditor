import Config from '../core/Config';
import History from '../core/History';
import Storage from '../core/Storage';
import Loader from '../core/Loader';
import RendererChangedEvent from '../event/viewport/RendererChangedEvent';

/**
 * 编辑器
 * @author mrdoob / http://mrdoob.com/
 */
function Editor(app) {
    this.app = app;
    this.app.editor = this;

    // 基础
    this.config = new Config('threejs-editor');
    this.history = new History(this);
    this.storage = new Storage();
    this.loader = new Loader(this);

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
    this.rendererTypes = {
        'WebGLRenderer': THREE.WebGLRenderer,
        'CanvasRenderer': THREE.CanvasRenderer,
        'SVGRenderer': THREE.SVGRenderer,
        'SoftwareRenderer': THREE.SoftwareRenderer,
        'RaytracingRenderer': THREE.RaytracingRenderer
    };

    this.renderer = this.createRendererFromConfig();
    this.app.viewport.container.dom.appendChild(this.renderer.domElement);
    (new RendererChangedEvent(this.app)).onRendererChanged(this.renderer);

    // 缓存
    this.object = {};
    this.objects = [];
    this.geometries = {};
    this.materials = {};
    this.textures = {};
    this.scripts = {};
    this.helpers = {};

    // 当前选中物体
    this.selected = null;

    // 网格
    this.grid = new THREE.GridHelper(30, 30, 0x444444, 0x888888);
    this.sceneHelpers.add(this.grid);

    // 选中包围盒（当mesh.useSelectionBox === false时，不使用包围盒）
    this.selectionBox = new THREE.BoxHelper();
    this.selectionBox.material.depthTest = false;
    this.selectionBox.material.transparent = true;
    this.selectionBox.visible = false;
    this.sceneHelpers.add(this.selectionBox);

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

// ---------------------- 渲染器 ---------------------------

Editor.prototype.createRenderer = function (options) { // 创建渲染器
    var rendererType = options.rendererType === undefined ? 'WebGLRenderer' : options.rendererType;
    var antialias = options.antialias === undefined ? true : options.antialias;
    var shadows = options.shadows === undefined ? true : options.shadows;
    var gammaIn = options.gammaIn === undefined ? false : options.gammaIn;
    var gammaOut = options.gammaOut === undefined ? false : options.gammaOut;
    var rendererTypes = this.rendererTypes;

    var renderer = new rendererTypes[rendererType]({ antialias: antialias });
    renderer.gammaInput = gammaIn;
    renderer.gammaOutput = gammaOut;
    if (shadows && renderer.shadowMap) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    };

    return renderer;
};

Editor.prototype.createRendererFromConfig = function () { // 从配置创建渲染器
    var rendererType = this.config.getKey('project/renderer');
    var antialias = this.config.getKey('project/renderer/antialias');
    var shadows = this.config.getKey('project/renderer/shadows');
    var gammaIn = this.config.getKey('project/renderer/gammaInput');
    var gammaOut = this.config.getKey('project/renderer/gammaOutput');

    return this.createRenderer({
        rendererType: rendererType,
        antialias: antialias,
        shadows: shadows,
        gammaIn: gammaIn,
        gammaOut: gammaOut
    });
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