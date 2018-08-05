import MenuEvent from '../MenuEvent';
import Converter from '../../../serialization/Converter';
import Ajax from '../../../utils/Ajax';

/**
 * 保存场景
 * @param {*} app 
 */
function SaveSceneEvent(app) {
    MenuEvent.call(this, app);
}

SaveSceneEvent.prototype = Object.create(MenuEvent.prototype);
SaveSceneEvent.prototype.constructor = SaveSceneEvent;

SaveSceneEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mSaveScene.' + this.id, function () {
        _this.onSaveScene();
    });
};

SaveSceneEvent.prototype.stop = function () {
    this.app.on('mSaveScene.' + this.id, null);
};

SaveSceneEvent.prototype.onSaveScene = function () {
    var sceneName = this.app.editor.sceneName;

    // if (sceneName == null) {
        // var tempName = 'Scene' + new Date().getTime();
        var tempName = '新场景';
        UI.prompt('正在保存...', '场景名称', tempName, (event, name) => {
            this.app.editor.sceneName = name;
            document.title = name;
            this.commitSave(name);
        });
    // } else {
    //     this.commitSave(sceneName);
    // }
};

SaveSceneEvent.prototype.commitSave = function (sceneName) {
    var obj = (new Converter()).toJSON(this.app);

    Ajax.post(this.app.options.server + '/api/Scene/Save', {
        Name: sceneName,
        Data: JSON.stringify(obj)
    }, function (result) {
        var obj = JSON.parse(result);
        UI.msg(obj.Msg);
    });
};

export default SaveSceneEvent;