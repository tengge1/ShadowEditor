import MenuEvent from '../MenuEvent';
import UI from '../../../ui/UI';
import StringUtils from '../../../utils/StringUtils';

/**
 * 导出ply文件事件
 * @param {*} app 
 */
function ExportPLYEvent(app) {
    MenuEvent.call(this, app);
}

ExportPLYEvent.prototype = Object.create(MenuEvent.prototype);
ExportPLYEvent.prototype.constructor = ExportPLYEvent;

ExportPLYEvent.prototype.start = function () {
    this.app.on('mExportPLY.' + this.id, this.onExportPLY.bind(this));
};

ExportPLYEvent.prototype.stop = function () {
    this.app.on('mExportPLY.' + this.id, null);
};

ExportPLYEvent.prototype.onExportPLY = function () {
    var editor = this.app.editor;

    var object = editor.selected;

    if (object === null) {
        UI.msg('请选择对象');
        return;
    }

    var exporter = new THREE.PLYExporter();
    StringUtils.saveString(exporter.parse(object, {
        excludeAttributes: ['normal', 'uv', 'color', 'index']
    }), 'model.ply');
};

export default ExportPLYEvent;