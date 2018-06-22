import MenuEvent from '../MenuEvent';
import StringUtils from '../../../utils/StringUtils';

/**
 * 导出stl文件事件
 * @param {*} app 
 */
function ExportSTLEvent(app) {
    MenuEvent.call(this, app);
}

ExportSTLEvent.prototype = Object.create(MenuEvent.prototype);
ExportSTLEvent.prototype.constructor = ExportSTLEvent;

ExportSTLEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mExportSTL.' + this.id, function () {
        _this.onExportSTL();
    });
};

ExportSTLEvent.prototype.stop = function () {
    this.app.on('mExportSTL.' + this.id, null);
};

ExportSTLEvent.prototype.onExportSTL = function () {
    var editor = this.app.editor;

    var exporter = new THREE.STLExporter();

    StringUtils.saveString(exporter.parse(editor.scene), 'model.stl');
};

export default ExportSTLEvent;