import MenuEvent from '../MenuEvent';
import UI from '../../../ui/UI';

/**
 * 新建场景
 * @param {*} app 
 */
function NewSceneEvent(app) {
    MenuEvent.call(this, app);
}

NewSceneEvent.prototype = Object.create(MenuEvent.prototype);
NewSceneEvent.prototype.constructor = NewSceneEvent;

NewSceneEvent.prototype.start = function () {
    this.app.on('mNewScene.' + this.id, this.onNewScene.bind(this));
};

NewSceneEvent.prototype.stop = function () {
    this.app.on('mNewScene.' + this.id, null);
};

NewSceneEvent.prototype.onNewScene = function () {
    var editor = this.app.editor;

    // UI.confirm('询问', '所有未保存数据将丢失，确定吗？', function (event, btn) {
    //     if (btn === 'ok') {
    editor.clear();
    //     }
    // });
    document.title = '未命名';
};

export default NewSceneEvent;