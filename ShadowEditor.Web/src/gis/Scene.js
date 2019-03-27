import Controls from './control/Controls';
import Globe from './Globe';

/**
 * GIS场景
 * @param {*} app 
 */
function Scene(app) {
    this.app = app;
}

Scene.prototype.start = function () {
    var editor = this.app.editor;

    editor.controls.enabled = false;
    editor.controls.dispose();
    editor.transformControls.enabled = false;
    editor.sceneHelpers.visible = false
    this.app.editor.showViewHelper = false;

    this.globe = new Globe(editor.camera, editor.renderer);
    editor.scene.add(this.globe);

    this.app.on(`afterRender.${this.id}`, this.update.bind(this));
};

Scene.prototype.update = function () {
    this.globe.update();
};

Scene.prototype.stop = function () {
    this.app.on(`afterRender.${this.id}`, null);
    this.globe.dispose();
    delete this.globe;

    var editor = this.app.editor;
    editor.controls = new THREE.EditorControls(editor.camera, editor.renderer.domElement);
    editor.transformControls.enabled = true;
    editor.sceneHelpers.visible = true;
    this.app.editor.showViewHelper = true;
};

export default Scene;