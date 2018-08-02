import BaseEvent from '../BaseEvent';
import UI from '../../ui/UI';
import Converter from '../../serialization/Converter';
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
    this.app.on(`save.${this.id}`, this.onBeforeSave.bind(this));
};

SaveEvent.prototype.stop = function () {
    this.app.on(`save.${this.id}`, null);
};

SaveEvent.prototype.onBeforeSave = function () {
    var sceneName = this.app.editor.sceneName;

    if (sceneName == null) {
        var tempName = 'Scene' + new Date().getTime();
        UI.prompt('正在保存...', '场景名称', tempName, (event, name) => {
            this.app.editor.sceneName = name;
            document.title = name;
            this.onSave(name);
        });
    } else {
        this.onSave(sceneName);
    }
};

SaveEvent.prototype.onSave = function (sceneName) {
    var obj = Converter.toJSON(this.app);

    debugger

    Ajax.post(this.app.options.server + '/api/Scene/Save', {
        Name: sceneName,
        Data: JSON.stringify(obj)
    }, function (result) {
        var obj = JSON.parse(result);
        UI.msg(obj.Msg);
    });
};



export default SaveEvent;