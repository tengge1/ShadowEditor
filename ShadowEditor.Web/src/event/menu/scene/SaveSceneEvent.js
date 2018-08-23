import MenuEvent from '../MenuEvent';
import Converter from '../../../serialization/Converter';
import Ajax from '../../../utils/Ajax';

/**
 * 保存场景
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function SaveSceneEvent(app) {
    MenuEvent.call(this, app);
}

SaveSceneEvent.prototype = Object.create(MenuEvent.prototype);
SaveSceneEvent.prototype.constructor = SaveSceneEvent;

SaveSceneEvent.prototype.start = function () {
    this.app.on(`mSaveScene.${this.id}`, this.onSaveScene.bind(this));
};

SaveSceneEvent.prototype.stop = function () {
    this.app.on(`mSaveScene.${this.id}`, null);
};

SaveSceneEvent.prototype.onSaveScene = function () {
    var editor = this.app.editor;
    var sceneName = editor.sceneName;

    if (sceneName == null) {
        UI.prompt('保存场景', '名称', '新场景', (event, name) => {
            this.app.editor.sceneName = name;
            document.title = name;
            this.commitSave(name);
        });
    } else {
        this.commitSave(sceneName);
    }
};

SaveSceneEvent.prototype.commitSave = function (sceneName) {
    var obj = (new Converter(this.app)).toJSON();

    Ajax.post(this.app.options.server + '/api/Scene/Save', {
        Name: sceneName,
        Data: JSON.stringify(obj)
    }, function (result) {
        var obj = JSON.parse(result);
        UI.msg(obj.Msg);
    });
};

export default SaveSceneEvent;