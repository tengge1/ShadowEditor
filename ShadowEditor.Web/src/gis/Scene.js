import Globe from './Globe';

/**
 * GIS场景
 * @author tengge / https://github.com/tengge1
 * @param {*} app 应用程序
 * @param {Object} options 配置
 * @param {Boolean} options.useCameraPosition 是否使用相机位置
 */
function Scene(app, options = {}) {
    this.options = options;
    this.options.useCameraPosition = this.options.useCameraPosition || false;
}

Scene.prototype.start = function () {
    var editor = app.editor;

    this.oldBackground = editor.scene.background;
    editor.scene.background = null;
    editor.sceneHelpers.visible = false

    editor.controls.enabled = false;
    editor.controls.dispose();
    editor.transformControls.enabled = false;

    app.editor.showViewHelper = false;

    this.globe = new Globe(editor.camera, editor.renderer, {
        server: app.options.server,
        useCameraPosition: this.options.useCameraPosition,
    });
    editor.scene.add(this.globe);
    this.oldSceneBeforeRender = editor.scene.onBeforeRender;
    editor.scene.onBeforeRender = this.update.bind(this);
};

Scene.prototype.update = function () {
    this.globe.update();
};

Scene.prototype.stop = function () {
    app.on(`afterRender.${this.id}`, null);
    this.globe.dispose();
    delete this.globe;

    var editor = app.editor;

    editor.scene.onBeforeRender = this.oldSceneBeforeRender;
    delete this.oldSceneBeforeRender;

    editor.background = this.oldBackground;

    editor.sceneHelpers.visible = true;

    editor.controls = new THREE.EditorControls(editor.camera, editor.renderer.domElement);
    editor.transformControls.enabled = true;

    app.editor.showViewHelper = true;
};

export default Scene;