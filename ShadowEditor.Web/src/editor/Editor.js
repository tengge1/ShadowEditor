import History from '../command/History';
import Helpers from '../helper/Helpers';
import UI from '../ui/UI';
import Visualization from '../visual/Visualization';

/**
 * 编辑器
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function Editor() {
    app = app;
    app.editor = this;

    // 基础
    this.history = new History(this);

    // 场景
    this.scene = new THREE.Scene();
    this.scene.name = L_SCENE;
    this.scene.background = new THREE.Color(0xaaaaaa);

    this.sceneHelpers = new THREE.Scene();

    this.sceneID = null; // 当前场景ID
    this.sceneName = null; // 当前场景名称

    var width = app.viewport.clientWidth;
    var height = app.viewport.clientHeight;

    // 相机
    this.DEFAULT_CAMERA = new THREE.PerspectiveCamera(50, width / height, 0.1, 10000);
    this.DEFAULT_CAMERA.name = L_DEFAULT_CAMERA;
    this.DEFAULT_CAMERA.userData.isDefault = true;
    this.DEFAULT_CAMERA.userData.control = 'OrbitControls'; // 场景控制类型
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

    app.viewport.appendChild(this.renderer.domElement);
    this.renderer.setSize(width, height);

    // 音频监听器
    this.audioListener = new THREE.AudioListener();
    this.audioListener.name = L_AUDIO_LISTENER;

    // 物体
    this.objects = [];

    // 脚本 格式：{ uuid: { id: 'MongoDB _id', name: 'Script Name', type: 'Script Type', source: 'Source Code', uuid: 'uuid' }}
    // 其中，uuid是创建脚本时自动生成，不可改变，关联时使用，id是mongo数据库ID字段；name：随便填写；type：javascript，vertexShader, fragmentShader, json；source：源码。
    this.scripts = {};

    // 动画格式：[{ id: 'MongoDB _id', uuid: 'uuid', layer: '动画层序号', layerName: '动画层名称', animations: '动画' }, ...]
    // 其中，动画：[{ id: 'MongoDB _id', uuid: 'uuid', name: '动画名称', target: '动画对象uuid', type: '动画类型', beginTime: '开始时间(s)', endTime: '结束时间(s)', data: '动画参数' }, ...]
    // 其中，uuid是创建脚本时自动生成，不可改变，关联时使用。
    // 动画层序号：在时间面板显示位置，从0开始计算。
    // 动画类型：Tween-补间动画，Skeletal-骨骼动画，Audio-音频播放，Shader-着色器动画，Filter-滤镜动画，Particle-粒子动画
    // 动画参数：是一个字典，根据动画类型不同，参数也不同
    this.animations = [];

    // 当前选中物体
    this.selected = null;

    // 平移旋转缩放控件
    this.transformControls = new THREE.TransformControls(this.camera, app.viewport);
    this.sceneHelpers.add(this.transformControls);

    // 编辑器控件
    this.controls = new THREE.EditorControls(this.camera, app.viewport);

    // 碰撞检测
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // 帮助器场景灯光
    var light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.z = 10;
    this.sceneHelpers.add(light);

    this.showViewHelper = true;

    // 可视化
    // this.svg = UI.get('SvgContainer').dom;
    // this.visual = new Visualization();

    // 事件
    app.on(`appStarted.${this.id}`, this.onAppStarted.bind(this));

    app.on(`mousedown.${this.id}`, this.onMouseDown.bind(this));
    app.on(`mousemove.${this.id}`, this.onMouseMove.bind(this));

    // 帮助器
    this.helpers = new Helpers(app);
};

Editor.prototype.onAppStarted = function () {
    this.helpers.start();
    this.clear();
};

// -------------------- 场景 --------------------------

Editor.prototype.setScene = function (scene) { // 设置场景
    // 移除原有物体
    var objects = this.scene.children;
    while (objects.length > 0) {
        this.removeObject(objects[0]);
    }

    // 添加新物体
    var children = scene.children.slice();
    scene.children.length = 0;
    this.scene = scene;

    children.forEach(n => {
        this.addObject(n);
    });

    app.call('sceneGraphChanged', this);
};

Editor.prototype.clear = function (addObject = true) { // 清空场景
    this.history.clear();

    this.camera.copy(this.DEFAULT_CAMERA);

    if (this.camera.children.findIndex(o => o instanceof THREE.AudioListener) === -1) {
        this.camera.add(this.audioListener);
    }

    if (this.scene.background instanceof THREE.Texture) {
        this.scene.background = new THREE.Color(0xaaaaaa);
    } else if (this.scene.background instanceof THREE.Color) {
        this.scene.background.setHex(0xaaaaaa);
    }

    this.scene.fog = null;

    this.deselect();

    // 移除场景物体
    var objects = this.scene.children;

    while (objects.length > 0) {
        this.removeObject(objects[0]);
    }

    this.scripts = {};

    this.animations = [{
        id: null,
        uuid: THREE.Math.generateUUID(),
        layer: 0,
        layerName: L_ANIMATION_LAYER_1,
        animations: []
    }, {
        id: null,
        uuid: THREE.Math.generateUUID(),
        layer: 1,
        layerName: L_ANIMATION_LAYER_2,
        animations: []
    }, {
        id: null,
        uuid: THREE.Math.generateUUID(),
        layer: 2,
        layerName: L_ANIMATION_LAYER_3,
        animations: []
    }];

    // 添加默认元素
    if (addObject) {
        var light1 = new THREE.AmbientLight(0xffffff, 0.24);
        light1.name = L_AMBIENT;
        this.addObject(light1);

        var light2 = new THREE.DirectionalLight(0xffffff, 0.56);
        light2.name = L_DIRECTIONAL;
        light2.castShadow = true;
        light2.position.set(5, 10, 7.5);
        light2.shadow.radius = 0;
        light2.shadow.mapSize.x = 2048;
        light2.shadow.mapSize.y = 2048;
        light2.shadow.camera.left = -20;
        light2.shadow.camera.right = 20;
        light2.shadow.camera.top = 20;
        light2.shadow.camera.bottom = -20;
        light2.shadow.camera.near = 0.1;
        light2.shadow.camera.far = 500;

        this.addObject(light2);
    }

    app.call('editorCleared', this);
    app.call('scriptChanged', this);
    app.call('animationChanged', this);
};

// ---------------------- 物体 ---------------------------

Editor.prototype.objectByUuid = function (uuid) { // 根据uuid获取物体
    return this.scene.getObjectByProperty('uuid', uuid, true);
};

Editor.prototype.addObject = function (object) { // 添加物体
    this.scene.add(object);
    app.call('objectAdded', this, object);
    app.call('sceneGraphChanged', this);
};

Editor.prototype.moveObject = function (object, parent, before) { // 移动物体
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

    app.call('sceneGraphChanged', this);
};

Editor.prototype.removeObject = function (object) { // 移除物体
    if (object.parent === null) { // 避免删除相机或场景
        return;
    }

    object.parent.remove(object);

    app.call('objectRemoved', this, object);
    app.call('sceneGraphChanged', this);
};

// ------------------------- 帮助 ------------------------------

Editor.prototype.addPhysicsHelper = function (helper) {
    var geometry = new THREE.SphereBufferGeometry(2, 4, 2);
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        visible: false
    });

    var picker = new THREE.Mesh(geometry, material);
    picker.name = 'picker';
    picker.userData.object = helper.object;
    helper.add(picker);

    this.sceneHelpers.add(helper);
    this.helpers[helper.object.id] = helper;
    this.objects.push(picker);
};

Editor.prototype.removePhysicsHelper = function (helper) {
    if (this.helpers[helper.object.id] !== undefined) {
        var helper = this.helpers[helper.object.id];
        helper.parent.remove(helper);
        delete this.helpers[helper.object.id];

        var objects = this.objects;
        objects.splice(objects.indexOf(helper.getObjectByName('picker')), 1);
    }
};

// ------------------------ 脚本 ----------------------------

Editor.prototype.addScript = function (object, script) { // 添加脚本
    if (this.scripts[object.uuid] === undefined) {
        this.scripts[object.uuid] = [];
    }

    this.scripts[object.uuid].push(script);

    app.call('scriptAdded', this, script);
};

Editor.prototype.removeScript = function (object, script) { // 移除脚本
    if (this.scripts[object.uuid] === undefined) {
        return;
    }

    var index = this.scripts[object.uuid].indexOf(script);

    if (index !== -1) {
        this.scripts[object.uuid].splice(index, 1);
    }

    app.call('scriptRemoved', this);
};

// ------------------------ 选中事件 --------------------------------

Editor.prototype.select = function (object) { // 选中物体
    if (this.selected === object) {
        return;
    }

    this.selected = object;

    app.call('objectSelected', this, object);
};

Editor.prototype.selectById = function (id) { // 根据id选中物体
    if (id === this.camera.id) {
        this.select(this.camera);
        return;
    }

    this.select(this.scene.getObjectById(id, true));
};

Editor.prototype.selectByUuid = function (uuid) { // 根据uuid选中物体
    if (uuid === this.camera.uuid) {
        this.select(this.camera);
        return;
    }

    this.scene.traverse(child => {
        if (child.uuid === uuid) {
            this.select(child);
        }
    });
};

Editor.prototype.deselect = function () { // 取消选中物体
    this.select(null);
};

// ---------------------- 焦点事件 --------------------------

Editor.prototype.focus = function (object) { // 设置焦点
    app.call('objectFocused', this, object);
};

Editor.prototype.focusById = function (id) { // 根据id设置交点
    var obj = this.scene.getObjectById(id, true);
    if (obj) {
        this.focus(obj);
    }
};

Editor.prototype.focusByUUID = function (uuid) { // 根据uuid设置焦点
    if (uuid === this.camera.uuid) {
        this.focus(this.camera);
        return;
    }

    this.scene.traverse(child => {
        if (child.uuid === uuid) {
            this.focus(child);
        }
    });
};

// ----------------------- 命令事件 --------------------------

Editor.prototype.execute = function (cmd, optionalName) { // 执行事件
    this.history.execute(cmd, optionalName);
};

Editor.prototype.undo = function () { // 撤销事件
    this.history.undo();
};

Editor.prototype.redo = function () { // 重做事件
    this.history.redo();
};

// ---------------------- 碰撞检测 -----------------------------

Editor.prototype.onMouseDown = function (event) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    var intersect = this.raycaster.intersectObjects(this.scene.children, true)[0];

    if (intersect) {
        app.call(`intersect`, this, intersect, event);
    }
};

Editor.prototype.onMouseMove = function (event) {
    this.mouse.x = (event.offsetX / this.renderer.domElement.clientWidth) * 2 - 1;
    this.mouse.y = -(event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1;
};

export default Editor;