import MenuEvent from '../MenuEvent';

/**
 * 启动事件
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
        document.getElementById('mPlay').innerHTML = '停止';
        this.app.call('startPlayer', this);
    } else {
        this.isPlaying = false;
        document.getElementById('mPlay').innerHTML = '启动';
        this.app.call('stopPlayer', this);
    }
};

export default PlayEvent;