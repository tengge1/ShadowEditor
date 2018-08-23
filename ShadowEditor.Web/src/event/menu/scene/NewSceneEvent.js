import MenuEvent from '../MenuEvent';
import UI from '../../../ui/UI';

/**
 * 新建场景
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function NewSceneEvent(app) {
    MenuEvent.call(this, app);
}

NewSceneEvent.prototype = Object.create(MenuEvent.prototype);
NewSceneEvent.prototype.constructor = NewSceneEvent;

NewSceneEvent.prototype.start = function () {
    this.app.on(`mNewScene.${this.id}`, this.onNewScene.bind(this));
};

NewSceneEvent.prototype.stop = function () {
    this.app.on(`mNewScene.${this.id}`, null);
};

NewSceneEvent.prototype.onNewScene = function () {
    var editor = this.app.editor;

    if (editor.sceneName == null) {
        editor.clear();
        document.title = '未命名';
        return;
    }

    UI.confirm('询问', '所有未保存数据将丢失，确定要新建场景吗？', function (event, btn) {
        if (btn === 'ok') {
            editor.clear();
            editor.sceneID = null;
            editor.sceneName = null;
            document.title = '未命名';
        }
    });
};

export default NewSceneEvent;