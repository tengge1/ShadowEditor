import ViewportInfo from './ViewportInfo';
import UI2 from '../ui2/UI';
import RendererChangedEvent from '../event/viewport/RendererChangedEvent';

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

    // 创建渲染器
    var rendererTypes = {
        'WebGLRenderer': THREE.WebGLRenderer,
        'CanvasRenderer': THREE.CanvasRenderer,
        'SVGRenderer': THREE.SVGRenderer,
        'SoftwareRenderer': THREE.SoftwareRenderer,
        'RaytracingRenderer': THREE.RaytracingRenderer
    };

    var type = editor.config.getKey('project/renderer');
    var antialias = editor.config.getKey('project/renderer/antialias');
    var shadows = editor.config.getKey('project/renderer/shadows');
    var gammaIn = editor.config.getKey('project/renderer/gammaInput');
    var gammaOut = editor.config.getKey('project/renderer/gammaOutput');

    var renderer = new rendererTypes[type]({ antialias: antialias });
    renderer.gammaInput = gammaIn;
    renderer.gammaOutput = gammaOut;
    if (shadows && renderer.shadowMap) {
        renderer.shadowMap.enabled = true;
        // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    this.app.viewport = this;
    (new RendererChangedEvent(this.app)).onRendererChanged(renderer);


    // 相机和场景

    var camera = editor.camera;
    var scene = editor.scene;
    var sceneHelpers = editor.sceneHelpers;

    var objects = [];
    editor.objects = objects;

    //

    var vrEffect;

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
    var controls = new THREE.EditorControls(camera, container.dom);
    editor.controls = controls;

    this.app.call('animate');
};

export default Viewport;