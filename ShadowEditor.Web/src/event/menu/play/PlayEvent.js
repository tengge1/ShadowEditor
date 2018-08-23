import MenuEvent from '../MenuEvent';
import UI from '../../../ui/UI';

/**
 * 启动事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function PlayEvent(app) {
    MenuEvent.call(this, app);
    this.isPlaying = false;
}

PlayEvent.prototype = Object.create(MenuEvent.prototype);
PlayEvent.prototype.constructor = PlayEvent;

PlayEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mPlay.' + this.id, function () {
        _this.onPlay();
    });
};

PlayEvent.prototype.stop = function () {
    this.app.on('mPlay.' + this.id, null);
};

PlayEvent.prototype.onPlay = function () {
    var editor = this.app.editor;

    if (this.isPlaying === false) {
        this.isPlaying = true;
        UI.get('mPlay').dom.innerHTML = '停止';
        this.app.call('startPlayer', this);
    } else {
        this.isPlaying = false;
        UI.get('mPlay').dom.innerHTML = '启动';
        this.app.call('stopPlayer', this);
    }
};

export default PlayEvent;