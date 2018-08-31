import UI from '../../ui/UI';

/**
 * 播放器
 * @author mrdoob / http://mrdoob.com/
 */
function Player(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

Player.prototype = Object.create(UI.Control.prototype);
Player.prototype.constructor = Player;

Player.prototype.render = function () {
    this.container = UI.create({
        xtype: 'div',
        parent: this.parent,
        id: 'player',
        cls: 'Panel player',
        style: {
            position: 'absolute',
            display: 'none'
        }
    });

    this.container.render();
};

/**
 * 启动播放器
 */
Player.prototype.start = function () {
    UI.msg('播放器启动成功！');
};

/**
 * 停止播放器
 */
Player.prototype.stop = function () {
    UI.msg('播放器停止成功！');
};

export default Player;