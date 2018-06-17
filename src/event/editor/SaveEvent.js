import BaseEvent from '../BaseEvent';
import SceneUtils from '../../utils/SceneUtils';
import Ajax from '../../utils/Ajax';

/**
 * 保存场景事件
 * @param {*} app 
 */
function SaveEvent(app) {
    BaseEvent.call(this, app);
}

SaveEvent.prototype = Object.create(BaseEvent.prototype);
SaveEvent.prototype.constructor = SaveEvent;

SaveEvent.prototype.start = function () {
    var _this = this;
    this.app.on('save.' + this.id, function () {
        _this.onSave();
    });
};

SaveEvent.prototype.stop = function () {
    this.app.on('save.' + this.id, null);
};

SaveEvent.prototype.onSave = function () {
    var editor = this.app.editor;

    var obj = SceneUtils.toJSON(editor.scene);
    Ajax.post(this.app.options.server + '/Service/SceneService.ashx?cmd=Save', {
        name: 'Scene1',
        data: JSON.stringify(obj)
    }, function (result) {
        var obj = JSON.parse(result);
        alert(obj.Msg);
    });
};

export default SaveEvent;