import ViewportInfo from './ViewportInfo';
import UI2 from '../ui2/UI';

/**
 * 场景编辑区
 * @author mrdoob / http://mrdoob.com/
 */
function Viewport(app) {
    this.app = app;
    var editor = this.app.editor;
    var _this = this;

    // 用户界面

    var container = new UI2.Div({
        parent: this.app.container,
        id: 'viewport',
        style: 'position: absolute'
    });
    this.container = container;

    container.render();

    this.viewportInfo = new ViewportInfo(this.app, this.container);

    //

    var renderer = null;

    var camera = editor.camera;
    var scene = editor.scene;
    var sceneHelpers = editor.sceneHelpers;

    var objects = [];
    editor.objects = objects;

    //

    var vrEffect, vrControls, vrCamera;

    // helpers

    var grid = new THREE.GridHelper(60, 60);
    sceneHelpers.add(grid);
    editor.grid = grid;

    // 选中包围盒控件

    var selectionBox = new THREE.BoxHelper();
    selectionBox.material.depthTest = false;
    selectionBox.material.transparent = true;
    selectionBox.visible = false;
    sceneHelpers.add(selectionBox);

    editor.selectionBox = selectionBox;

    // 平移旋转缩放控件

    var transformControls = new THREE.TransformControls(camera, container.dom);
    sceneHelpers.add(transformControls);
    editor.transformControls = transformControls;

    // 编辑器控件

    // controls need to be added *after* main logic,
    // otherwise controls.enabled doesn't work.

    var controls = new THREE.EditorControls(camera, container.dom);
    editor.controls = controls;

    controls.addEventListener('change', function () {
        transformControls.update();
        _this.app.call('cameraChanged', _this, camera);
    });

    this.app.on('editorCleared.Viewport', function () {
        controls.center.set(0, 0, 0);
        _this.app.call('render');
    });

    this.app.on('enterVR.Viewport', function () {
        vrEffect.isPresenting ? vrEffect.exitPresent() : vrEffect.requestPresent();
    });

    this.app.on('themeChanged.Viewport', function (value) {
        switch (value) {
            case 'assets/css/light.css':
                sceneHelpers.remove(grid);
                grid = new THREE.GridHelper(60, 60, 0x444444, 0x888888);
                sceneHelpers.add(grid);
                editor.grid = grid;
                break;
            case 'assets/css/dark.css':
                sceneHelpers.remove(grid);
                grid = new THREE.GridHelper(60, 60, 0xbbbbbb, 0x888888);
                sceneHelpers.add(grid);
                editor.grid = grid;
                break;
        }

        _this.app.call('render');
    });

    this.app.on('transformModeChanged.Viewport', function (mode) {
        transformControls.setMode(mode);
    });

    this.app.on('snapChanged.Viewport', function (dist) {
        transformControls.setTranslationSnap(dist);
    });

    this.app.on('spaceChanged.Viewport', function (space) {
        transformControls.setSpace(space);
    });

    this.app.on('rendererChanged.Viewport', function (newRenderer) {
        if (renderer !== null) {
            container.dom.removeChild(renderer.domElement);
        }

        renderer = newRenderer;
        _this.app.editor.renderer = renderer;

        renderer.autoClear = false;
        renderer.autoUpdateScene = false;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.dom.offsetWidth, container.dom.offsetHeight);

        container.dom.appendChild(renderer.domElement);

        if (renderer.vr && renderer.vr.enabled) {
            vrCamera = new THREE.PerspectiveCamera();
            vrCamera.projectionMatrix = editor.camera.projectionMatrix;
            editor.camera.add(vrCamera);
            editor.vrCamera = vrCamera;

            vrControls = new THREE.VRControls(vrCamera);
            editor.vrControls = vrControls;

            vrEffect = new THREE.VREffect(renderer);
            editor.vrEffect = vrEffect;

            window.addEventListener('vrdisplaypresentchange', function (event) {
                effect.isPresenting ? _this.app.call('enteredVR', _this) : _this.app.call('exitedVR', _this);
            }, false);
        }

        _this.app.call('render');
    });

    this.app.call('animate');
};

export default Viewport;