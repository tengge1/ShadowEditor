import BaseEvent from '../BaseEvent';

/**
 * 播放器事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function PlayerEvent(app) {
    BaseEvent.call(this, app);
}

PlayerEvent.prototype = Object.create(BaseEvent.prototype);
PlayerEvent.prototype.constructor = PlayerEvent;

PlayerEvent.prototype.start = function () {
    window.addEventListener('resize', this.onResize.bind(this));

    this.app.on('startPlayer.' + this.id, this.onStartPlayer.bind(this));
    this.app.on('stopPlayer.' + this.id, this.onStopPlayer.bind(this));
};

PlayerEvent.prototype.stop = function () {
    window.removeEventListener('resize', this.onResize);

    this.app.on('startPlayer.' + this.id, null);
    this.app.on('stopPlayer.' + this.id, null);
};

PlayerEvent.prototype.onResize = function () {
    var player = this.app.player.player;
    var container = this.app.player.container;

    player.setSize(container.dom.clientWidth, container.dom.clientHeight);
};

PlayerEvent.prototype.onStartPlayer = function () {
    var editor = this.app.editor;
    var player = this.app.player.player;
    var container = this.app.player.container;

    container.dom.style.display = '';

    player.load(editor.toJSON());
    player.setSize(container.dom.clientWidth, container.dom.clientHeight);
    player.play();
};

PlayerEvent.prototype.onStopPlayer = function () {
    var player = this.app.player.player;
    var container = this.app.player.container;

    container.dom.style.display = 'none';

    player.stop();
    player.dispose();
};

export default PlayerEvent;