/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/Editor.css';

import { BorderLayout, LoadMask } from '../ui/index';

import EditorMenuBar from './menu/EditorMenuBar.jsx';
import EditorStatusBar from './status/EditorStatusBar.jsx';
import EditorToolbar from './toolbar/EditorToolbar.jsx';
import Viewport from './viewport/Viewport.jsx';
import TimelinePanel from './timeline/TimelinePanel.jsx';
import EditorSideBar from './sidebar/EditorSideBar.jsx';
import AssetsPanel from './assets/AssetsPanel.jsx';

import History from '../command/History';
import Helpers from '../helper/Helpers';

import ControlsManager from '../controls/ControlsManager';
import EmptySceneTemplate from './menu/scene/EmptySceneTemplate';

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
            elements: [],
            assetsPanelShow: app.storage.assetsPanelShow,
            sidebarShow: app.storage.sidebarShow,
            toolbarShow: app.storage.toolbarShow,
            timelinePanelShow: app.storage.timelinePanelShow,
            statusBarShow: app.storage.statusBarShow
        };

        this.type = 'scene'; // 编辑器类型：scene, mesh, texture, material, terrain, ai

        this.onToggle = this.onToggle.bind(this);
    }

    render() {
        const { showMask, maskText, elements, assetsPanelShow, sidebarShow, toolbarShow, timelinePanelShow, statusBarShow } = this.state;
        const isLogin = !app.server.enableAuthority || app.server.isLogin;

        return <>
            <BorderLayout className={'Editor'}>
                <EditorMenuBar region={'north'} />
                {<EditorStatusBar region={'south'}
                    show={statusBarShow}
                 />}
                {<AssetsPanel region={'west'}
                    split
                    show={assetsPanelShow}
                    onToggle={this.onToggle}
                 />}
                {isLogin && <EditorSideBar region={'east'}
                    split
                    show={sidebarShow}
                    onToggle={this.onToggle}
                            />}
                <BorderLayout region={'center'}>
                    {isLogin && <EditorToolbar region={'north'}
                        show={toolbarShow}
                                />}
                    <Viewport region={'center'} />
                    {isLogin && <TimelinePanel region={'south'}
                        split
                        show={timelinePanelShow}
                        onToggle={this.onToggle}
                                />}
                </BorderLayout>
            </BorderLayout>
            {elements.map((n, i) => {
                return <div key={i}>{n}</div>;
            })}
            <LoadMask text={maskText}
                show={showMask}
            />
        </>;
    }

    componentDidMount() {
        app.editor = this;

        // 基础
        this.history = new History(this);

        // 场景
        this.scene = new THREE.Scene();
        this.scene.name = _t('Scene');
        this.scene.background = new THREE.Color(0xaaaaaa);

        this.sceneHelpers = new THREE.Scene();

        this.sceneID = null; // 当前场景ID
        this.sceneName = null; // 当前场景名称

        const width = app.viewport.clientWidth;
        const height = app.viewport.clientHeight;

        // 相机
        this.DEFAULT_CAMERA = new THREE.PerspectiveCamera(50, width / height, 0.1, 10000);
        this.DEFAULT_CAMERA.name = _t('DefaultCamera');
        this.DEFAULT_CAMERA.userData.isDefault = true;
        this.DEFAULT_CAMERA.userData.control = 'OrbitControls'; // 场景控制类型
        this.DEFAULT_CAMERA.userData.orbitOptions = {
            enableDamping: true,
            dampingFactor: 0.08,
            panSpeed: 1.6
        };
        this.DEFAULT_CAMERA.position.set(20, 10, 20);
        this.DEFAULT_CAMERA.lookAt(new THREE.Vector3());

        // 说明：默认是透视相机，当选择正视图、侧视图、顶视图时，使用正交相机进行渲染、选中。

        // 视图
        this.view = 'perspective'; // perspective, front, side, top

        // 透视相机
        this.camera = this.DEFAULT_CAMERA.clone();

        // 正交相机
        this.orthCamera = new THREE.OrthographicCamera(-width / 4, width / 4, height / 4, -height / 4, 0.1, 10000);

        // 渲染器
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        // this.renderer.gammaInput = false;
        // this.renderer.gammaOutput = false;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.autoClear = false;
        this.renderer.autoUpdateScene = false;
        this.renderer.setPixelRatio(window.devicePixelRatio);

        app.viewport.appendChild(this.renderer.domElement);
        this.renderer.setSize(width, height);

        // 物体
        this.objects = [];

        // 脚本 格式：[{ id: 'MongoDB _id', pid: null, name: 'Script Name', type: 'Script Type', source: 'Source Code', uuid: 'uuid', sort: 'sort' }, ...]
        // 其中，uuid是创建脚本时自动生成，不可改变，关联时使用，id是mongo数据库ID字段；name：随便填写；
        // type：javascript，vertexShader, fragmentShader, json, folder；source：源码；sort: 排序，小的在前面。
        // pid是null或undefined是根节点，否则是子节点。
        // type为group时表示一个文件夹，此时，不需要source属性。
        this.scripts = [];

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
        this.controls = new ControlsManager(this.camera, app.viewport);

        // 帮助器场景灯光
        let light = new THREE.DirectionalLight(0xffffff, 1.0);
        light.position.z = 10;
        this.sceneHelpers.add(light);

        this.showViewHelper = true;

        // GPUPick使用数量。为0时，为了提升性能，不启用GPUPick。
        this.gpuPickNum = app.storage.hoverEnabled ? 1 : 0;

        // 事件
        app.on(`appStarted.Editor`, this.onAppStarted.bind(this));
        app.on(`showMask.Editor`, this.onShowMask.bind(this));
        app.on(`storageChanged.Editor`, this.onStorageChanged.bind(this));

        // 帮助器
        this.helpers = new Helpers(app);

        app.call('appStart', this);
        app.call('appStarted', this);

        app.call('resize', this);

        app.log(_t('Program started.'));
    }

    componentWillUnmount() {
        app.call('appStop', this);
        app.call('appStoped', this);

        app.log(_t('Program stoped.'));

        app.event.stop();
    }

    onAppStarted() {
        this.helpers.start();
        this.clear();

        this._addAudioListener = this._addAudioListener.bind(this);
        document.addEventListener('click', this._addAudioListener);

        // 如果检测到有自动保存的场景，提示是否载入
        app.call(`queryLoadAutoSceneScene`, this);
    }

    onToggle() {
        app.call('resize', this);
    }

    onStorageChanged(key, value) {
        const keys = ['assetsPanelShow', 'sidebarShow', 'toolbarShow', 'timelinePanelShow', 'statusBarShow'];
        if (keys.indexOf(key) === -1) {
            return;
        }
        this.setState({
            [key]: value
        }, () => {
            app.call(`resize`, this);
        });
    }

    // -------------------- 场景 --------------------------

    setScene(scene) { // 设置场景
        // 移除原有物体
        let objects = this.scene.children;
        while (objects.length > 0) {
            this.removeObject(objects[0]);
        }

        // 添加新物体
        let children = scene.children.slice();
        scene.children.length = 0;
        this.scene = scene;

        children.forEach(n => {
            this.addObject(n);
        });

        app.call('sceneGraphChanged', this);
    }

    clear(addObject = true) { // 清空场景
        const template = new EmptySceneTemplate();
        template.clear();

        // 添加默认元素
        if (addObject) {
            template.create();
        }

        app.call('editorCleared', this);
        app.call('scriptChanged', this);
        app.call('animationChanged', this);
    }

    // 点击编辑器时才添加AudioListener，避免警告信息
    _addAudioListener() {
        document.removeEventListener('click', this._addAudioListener);

        this.audioListener = new THREE.AudioListener();
        this.audioListener.name = _t('AudioListener');

        if (this.camera.children.findIndex(o => o instanceof THREE.AudioListener) === -1) {
            this.camera.add(this.audioListener);
        }
    }

    // ---------------------- 物体 ---------------------------

    objectByUuid(uuid) { // 根据uuid获取物体
        return this.scene.getObjectByProperty('uuid', uuid, true);
    }

    addObject(object) { // 添加物体
        this.scene.add(object);
        app.call('objectAdded', this, object);
        app.call('sceneGraphChanged', this);
    }

    moveObject(object, parent, before) { // 移动物体
        if (parent === undefined) {
            parent = this.scene;
        }

        parent.add(object);

        // sort children array
        if (before !== undefined) {
            let index = parent.children.indexOf(before);
            parent.children.splice(index, 0, object);
            parent.children.pop();
        }

        app.call('sceneGraphChanged', this);
    }

    removeObject(object) { // 移除物体
        if (object.parent === null) { // 避免删除相机或场景
            return;
        }

        object.parent.remove(object);

        app.call('objectRemoved', this, object);
        app.call('sceneGraphChanged', this);
    }

    // ------------------------- 帮助 ------------------------------

    addPhysicsHelper(helper) {
        let geometry = new THREE.SphereBufferGeometry(2, 4, 2);
        let material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            visible: false
        });

        let picker = new THREE.Mesh(geometry, material);
        picker.name = 'picker';
        picker.userData.object = helper.object;
        helper.add(picker);

        this.sceneHelpers.add(helper);
        this.helpers[helper.object.id] = helper;
        this.objects.push(picker);
    }

    removePhysicsHelper(helper) {
        if (this.helpers[helper.object.id] !== undefined) {
            helper.parent.remove(helper);
            delete this.helpers[helper.object.id];

            let objects = this.objects;
            objects.splice(objects.indexOf(helper.getObjectByName('picker')), 1);
        }
    }

    // ------------------------ 选中事件 --------------------------------

    select(object) { // 选中物体
        if (this.selected === object) {
            return;
        }

        this.selected = object;

        if (!object) {
            this.transformControls.detach();
        }

        app.call('objectSelected', this, object);
    }

    selectById(id) { // 根据id选中物体
        if (id === this.camera.id) {
            this.select(this.camera);
            return;
        }

        this.select(this.scene.getObjectById(id, true));
    }

    selectByUuid(uuid) { // 根据uuid选中物体
        if (uuid === this.camera.uuid) {
            this.select(this.camera);
            return;
        }

        this.scene.traverse(child => {
            if (child.uuid === uuid) {
                this.select(child);
            }
        });
    }

    deselect() { // 取消选中物体
        this.select(null);
    }

    // ---------------------- 焦点事件 --------------------------

    focus(object) { // 设置焦点
        app.call('objectFocused', this, object);
    }

    focusById(id) { // 根据id设置交点
        let obj = this.scene.getObjectById(id, true);
        if (obj) {
            this.focus(obj);
        }
    }

    focusByUUID(uuid) { // 根据uuid设置焦点
        if (uuid === this.camera.uuid) {
            this.focus(this.camera);
            return;
        }

        this.scene.traverse(child => {
            if (child.uuid === uuid) {
                this.focus(child);
            }
        });
    }

    // ----------------------- 命令事件 --------------------------

    execute(cmd, optionalName) { // 执行事件
        this.history.execute(cmd, optionalName);
    }

    undo() { // 撤销事件
        this.history.undo();
    }

    redo() { // 重做事件
        this.history.redo();
    }

    // ---------------------- 用户界面 --------------------------------

    createElement(type, props = {}, children = undefined) {
        let ref = React.createRef();
        props.ref = ref;
        return React.createElement(type, props, children);
    }

    addElement(element, callback) {
        let elements = this.state.elements;

        elements.push(element);

        this.setState({ elements }, callback);
    }

    removeElement(element, callback) {
        let elements = this.state.elements;

        let index = elements.findIndex(n => n === element || n.ref && n.ref.current === element);

        if (index > -1) {
            elements.splice(index, 1);
        }

        this.setState({ elements }, callback);
    }

    onShowMask(enabled, text) {
        this.setState({
            showMask: enabled,
            maskText: text || _t('Waiting...')
        });
    }
}

export default Editor;