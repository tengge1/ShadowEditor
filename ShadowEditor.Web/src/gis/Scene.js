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
};

Scene.prototype.stop = function () {

};

export default Scene;