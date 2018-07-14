import MenuEvent from '../MenuEvent';
import StringUtils from '../../../utils/StringUtils';

/**
 * 导出stl二进制文件事件
 * @param {*} app 
 */
function ExportSTLBEvent(app) {
    MenuEvent.call(this, app);
}

ExportSTLBEvent.prototype = Object.create(MenuEvent.prototype);
ExportSTLBEvent.prototype.constructor = ExportSTLBEvent;

ExportSTLBEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mExportSTLB.' + this.id, function () {
        _this.onExportSTLB();
    });
};

ExportSTLBEvent.prototype.stop = function () {
    this.app.on('mExportSTLB.' + this.id, null);
};

ExportSTLBEvent.prototype.onExportSTLB = function () {
    var editor = this.app.editor;

    var exporter = new THREE.STLBinaryExporter();

    StringUtils.saveString(exporter.parse(editor.scene), 'model.stl');
};

export default ExportSTLBEvent;