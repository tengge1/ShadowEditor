import MenuEvent from '../MenuEvent';
import StringUtils from '../../../utils/StringUtils';

/**
 * 导出gltf文件事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function ExportGLTFEvent(app) {
    MenuEvent.call(this, app);
}

ExportGLTFEvent.prototype = Object.create(MenuEvent.prototype);
ExportGLTFEvent.prototype.constructor = ExportGLTFEvent;

ExportGLTFEvent.prototype.start = function () {
    this.app.on('mExportGLTF.' + this.id, this.onExportGLTF.bind(this));
};

ExportGLTFEvent.prototype.stop = function () {
    this.app.on('mExportGLTF.' + this.id, null);
};

ExportGLTFEvent.prototype.onExportGLTF = function () {
    var exporter = new THREE.GLTFExporter();

    exporter.parse(app.editor.scene, function (result) {
        StringUtils.saveString(JSON.stringify(result), 'model.gltf');
    });
};

export default ExportGLTFEvent;