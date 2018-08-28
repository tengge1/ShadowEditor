import UI from '../../ui/UI';
import Converter from '../../serialization/Converter';

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
    var editor = this.app.editor;
    var player = this.app.player.player;
    var container = this.app.player.container;

    container.dom.style.display = '';

    var converter = new Converter(this.app);
    var json = converter.toJSON();

    debugger
    player.load(json);
    player.setSize(container.dom.clientWidth, container.dom.clientHeight);
    player.play();
};

PlayMenu.prototype.stopPlayer = function () { // 停止播放器
    var player = this.app.player.player;
    var container = this.app.player.container;

    container.dom.style.display = 'none';

    player.stop();
    player.dispose();
};

export default PlayMenu;