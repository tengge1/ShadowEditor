import MenuEvent from '../MenuEvent';
import UI from '../../../ui/UI';
import StringUtils from '../../../utils/StringUtils';

/**
 * 导出物体事件
 * @param {*} app 
 */
function ExportObjectEvent(app) {
    MenuEvent.call(this, app);
}

ExportObjectEvent.prototype = Object.create(MenuEvent.prototype);
ExportObjectEvent.prototype.constructor = ExportObjectEvent;

ExportObjectEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mExportObject.' + this.id, function () {
        _this.onExportObject();
    });
};

ExportObjectEvent.prototype.stop = function () {
    this.app.on('mExportObject.' + this.id, null);
};

ExportObjectEvent.prototype.onExportObject = function () {
    var editor = this.app.editor;

    var object = editor.selected;

    if (object === null) {
        UI.msg('请选择对象');
        return;
    }

    var output = object.toJSON();

    try {
        output = JSON.stringify(output, parseNumber, '\t');
        output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
    } catch (e) {
        output = JSON.stringify(output);
    }

    StringUtils.saveString(output, 'model.json');
};

export default ExportObjectEvent;