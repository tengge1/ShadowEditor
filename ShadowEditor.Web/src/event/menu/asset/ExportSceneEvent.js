import MenuEvent from '../MenuEvent';
import StringUtils from '../../../utils/StringUtils';

/**
 * 导出场景事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function ExportSceneEvent(app) {
    MenuEvent.call(this, app);
}

ExportSceneEvent.prototype = Object.create(MenuEvent.prototype);
ExportSceneEvent.prototype.constructor = ExportSceneEvent;

ExportSceneEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mExportScene.' + this.id, function () {
        _this.onExportScene();
    });
};

ExportSceneEvent.prototype.stop = function () {
    this.app.on('mExportScene.' + this.id, null);
};

ExportSceneEvent.prototype.onExportScene = function () {
    var editor = this.app.editor;

    var output = editor.scene.toJSON();

    try {
        output = JSON.stringify(output, parseNumber, '\t');
        output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
    } catch (e) {
        output = JSON.stringify(output);
    }

    StringUtils.saveString(output, 'scene.json');
};

export default ExportSceneEvent;