import UI from '../ui/UI';
import AppPlayer from '../core/AppPlayer';

/**
 * 播放器面板
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
        style: 'position: absolute; display: none;'
    });

    this.container.render();

    this.player = new AppPlayer();
    this.container.dom.appendChild(this.player.dom);
};

export default Player;