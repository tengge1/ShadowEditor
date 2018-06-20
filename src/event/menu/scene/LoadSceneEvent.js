import MenuEvent from '../MenuEvent';

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

    if (confirm('所有未保存数据将丢失，确定吗？')) {
        editor.load();
    }
};

export default LoadSceneEvent;