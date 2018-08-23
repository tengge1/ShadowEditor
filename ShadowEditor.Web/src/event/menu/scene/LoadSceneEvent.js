import MenuEvent from '../MenuEvent';
import UI from '../../../ui/UI';
import SceneWindow from '../../../editor/window/SceneWindow';

/**
 * 载入场景
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function LoadSceneEvent(app) {
    MenuEvent.call(this, app);
}

LoadSceneEvent.prototype = Object.create(MenuEvent.prototype);
LoadSceneEvent.prototype.constructor = LoadSceneEvent;

LoadSceneEvent.prototype.start = function () {
    this.app.on(`mLoadScene.${this.id}`, this.onLoadScene.bind(this));
};

LoadSceneEvent.prototype.stop = function () {
    this.app.on(`mLoadScene.${this.id}`, null);
};

LoadSceneEvent.prototype.onLoadScene = function () {
    if (this.window == null) {
        this.window = new SceneWindow({ app: this.app });
        this.window.render();
    }
    this.window.show();
};

export default LoadSceneEvent;