import MenuEvent from '../MenuEvent';
import StringUtils from '../../../utils/StringUtils';

/**
 * 导出obj文件事件
 * @param {*} app 
 */
function ExportOBJEvent(app) {
    MenuEvent.call(this, app);
}

ExportOBJEvent.prototype = Object.create(MenuEvent.prototype);
ExportOBJEvent.prototype.constructor = ExportOBJEvent;

ExportOBJEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mExportOBJ.' + this.id, function () {
        _this.onExportOBJ();
    });
};

ExportOBJEvent.prototype.stop = function () {
    this.app.on('mExportOBJ.' + this.id, null);
};

ExportOBJEvent.prototype.onExportOBJ = function () {
    var editor = this.app.editor;

    var object = editor.selected;

    if (object === null) {
        alert('请选择对象');
        return;
    }

    var exporter = new THREE.OBJExporter();
    StringUtils.saveString(exporter.parse(object), 'model.obj');
};

export default ExportOBJEvent;