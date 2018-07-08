import ViewportInfo from './ViewportInfo';
import UI from '../ui/UI';
import RendererChangedEvent from '../event/viewport/RendererChangedEvent';

/**
 * 场景编辑区
 * @author mrdoob / http://mrdoob.com/
 */
function Viewport(app) {
    this.app = app;
    var editor = this.app.editor;

    // 用户界面

    var container = new UI.Div({
        parent: this.app.container,
        id: 'viewport'
    });
    this.container = container;

    container.render();

    this.viewportInfo = new ViewportInfo(this.app, this.container);

    this.app.viewport = this;

    container.dom.appendChild(editor.renderer.domElement);
    (new RendererChangedEvent(this.app)).onRendererChanged(editor.renderer);


    // 相机和场景

    var camera = editor.camera;
    var scene = editor.scene;
    var sceneHelpers = editor.sceneHelpers;

    var objects = [];
    editor.objects = objects;

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