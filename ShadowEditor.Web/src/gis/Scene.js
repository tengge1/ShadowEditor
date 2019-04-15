import Globe from './Globe';

/**
 * GIS场景
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function Scene(app) {
    this.app = app;
}

Scene.prototype.start = function () {
    var editor = this.app.editor;

    this.oldBackground = editor.scene.background;
    editor.scene.background = null;
    editor.sceneHelpers.visible = false

    editor.controls.enabled = false;
    editor.controls.dispose();
    editor.transformControls.enabled = false;

    this.app.editor.showViewHelper = false;

    this.globe = new Globe(editor.camera, editor.renderer, {
        server: this.app.options.server,
    });
    editor.scene.add(this.globe);
    this.oldSceneBeforeRender = editor.scene.onBeforeRender;
    editor.scene.onBeforeRender = this.update.bind(this);
};

Scene.prototype.update = function () {
    this.globe.update();
};

Scene.prototype.stop = function () {
    this.app.on(`afterRender.${this.id}`, null);
    this.globe.dispose();
    delete this.globe;

    var editor = this.app.editor;

    editor.scene.onBeforeRender = this.oldSceneBeforeRender;
    delete this.oldSceneBeforeRender;

    editor.background = this.oldBackground;

    editor.sceneHelpers.visible = true;

    editor.controls = new THREE.EditorControls(editor.camera, editor.renderer.domElement);
    editor.transformControls.enabled = true;

    this.app.editor.showViewHelper = true;
};

export default Scene;