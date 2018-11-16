import { UI } from '../../third_party';

/**
 * 启动菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function PlayMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
    this.isPlaying = false;
}

PlayMenu.prototype = Object.create(UI.Control.prototype);
PlayMenu.prototype.constructor = PlayMenu;

PlayMenu.prototype.render = function () {
    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            id: 'mPlay',
            xtype: 'div',
            cls: 'title',
            html: '启动',
            onClick: this.onTogglePlay.bind(this)
        }]
    });

    container.render();
}

PlayMenu.prototype.onTogglePlay = function () {
    var editor = this.app.editor;

    if (this.isPlaying === false) {
        this.isPlaying = true;
        UI.get('mPlay').dom.innerHTML = '停止';
        this.startPlayer();
    } else {
        this.isPlaying = false;
        UI.get('mPlay').dom.innerHTML = '启动';
        this.stopPlayer();
    }
};

PlayMenu.prototype.startPlayer = function () { // 启动播放器
    this.app.player.start();
};

PlayMenu.prototype.stopPlayer = function () { // 停止播放器
    this.app.player.stop();
};

export default PlayMenu;