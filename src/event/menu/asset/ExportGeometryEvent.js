import MenuEvent from '../MenuEvent';
import StringUtils from '../../../utils/StringUtils';

/**
 * 导出几何体事件
 * @param {*} app 
 */
function ExportGeometryEvent(app) {
    MenuEvent.call(this, app);
}

ExportGeometryEvent.prototype = Object.create(MenuEvent.prototype);
ExportGeometryEvent.prototype.constructor = ExportGeometryEvent;

ExportGeometryEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mExportGeometry.' + this.id, function () {
        _this.onExportGeometry();
    });
};

ExportGeometryEvent.prototype.stop = function () {
    this.app.on('mExportGeometry.' + this.id, null);
};

ExportGeometryEvent.prototype.onExportGeometry = function () {
    var editor = this.app.editor;

    var object = editor.selected;

    if (object === null) {
        alert('请选择物体');
        return;
    }

    var geometry = object.geometry;

    if (geometry === undefined) {
        alert('选中的对象不具有Geometry属性。');
        return;
    }

    var output = geometry.toJSON();

    try {
        output = JSON.stringify(output, parseNumber, '\t');
        output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
    } catch (e) {
        output = JSON.stringify(output);
    }

    StringUtils.saveString(output, 'geometry.json');
};

export default ExportGeometryEvent;