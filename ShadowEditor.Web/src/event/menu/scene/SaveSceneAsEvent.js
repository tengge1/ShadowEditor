import MenuEvent from '../MenuEvent';
import Converter from '../../../serialization/Converter';
import Ajax from '../../../utils/Ajax';

/**
 * 场景另存为
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function SaveSceneAsEvent(app) {
    MenuEvent.call(this, app);
}

SaveSceneAsEvent.prototype = Object.create(MenuEvent.prototype);
SaveSceneAsEvent.prototype.constructor = SaveSceneAsEvent;

SaveSceneAsEvent.prototype.start = function () {
    this.app.on(`mSaveSceneAs.${this.id}`, this.onSaveSceneAs.bind(this));
};

SaveSceneAsEvent.prototype.stop = function () {
    this.app.on(`mSaveSceneAs.${this.id}`, null);
};

SaveSceneAsEvent.prototype.onSaveSceneAs = function () {
    var sceneName = this.app.editor.sceneName;

    if (sceneName == null) {
        sceneName = '新场景';
    }

    UI.prompt('保存场景', '名称', sceneName, (event, name) => {
        this.app.editor.sceneName = name;
        document.title = name;
        this.commitSave(name);
    });
};

SaveSceneAsEvent.prototype.commitSave = function (sceneName) {
    var obj = (new Converter(this.app)).toJSON();

    Ajax.post(this.app.options.server + '/api/Scene/Save', {
        Name: sceneName,
        Data: JSON.stringify(obj)
    }, function (result) {
        var obj = JSON.parse(result);
        UI.msg(obj.Msg);
    });
};

export default SaveSceneAsEvent;