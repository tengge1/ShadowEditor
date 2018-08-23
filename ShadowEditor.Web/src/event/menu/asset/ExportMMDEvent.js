import MenuEvent from '../MenuEvent';
import StringUtils from '../../../utils/StringUtils';

/**
 * 导出mmd文件事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function ExportMMDEvent(app) {
    MenuEvent.call(this, app);
}

ExportMMDEvent.prototype = Object.create(MenuEvent.prototype);
ExportMMDEvent.prototype.constructor = ExportMMDEvent;

ExportMMDEvent.prototype.start = function () {
    this.app.on('mExportMMD.' + this.id, this.onExportMMD.bind(this));
};

ExportMMDEvent.prototype.stop = function () {
    this.app.on('mExportMMD.' + this.id, null);
};

ExportMMDEvent.prototype.onExportMMD = function () {
    // TODO:
    // var exporter = new THREE.MMDExporter();

    // exporter.parse(app.editor.scene, function (result) {
    //     StringUtils.saveString(JSON.stringify(result), 'model.gltf');
    // });
};

export default ExportMMDEvent;