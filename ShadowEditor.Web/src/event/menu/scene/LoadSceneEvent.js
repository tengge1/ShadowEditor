import MenuEvent from '../MenuEvent';
import UI from '../../../ui/UI';
import SceneWindow from '../../../editor/window/SceneWindow';

/**
 * 载入场景
 * @param {*} app 
 */
function LoadSceneEvent(app) {
    MenuEvent.call(this, app);
}

LoadSceneEvent.prototype = Object.create(MenuEvent.prototype);
LoadSceneEvent.prototype.constructor = LoadSceneEvent;

LoadSceneEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mLoadScene.' + this.id, function () {
        _this.onLoadScene();
    });
};

LoadSceneEvent.prototype.stop = function () {
    this.app.on('mLoadScene.' + this.id, null);
};

LoadSceneEvent.prototype.onLoadScene = function () {
    var editor = this.app.editor;

    UI.confirm('询问', '所有未保存数据将丢失，确定吗？', (event, btn) => {
        if (btn === 'ok') {
            this.showSceneWindow();
        }
    });
};

LoadSceneEvent.prototype.showSceneWindow = function () {
    if (this.window == null) {
        this.window = new SceneWindow({ app: this.app });
        this.window.render();
    }
    this.window.show();
};

export default LoadSceneEvent;