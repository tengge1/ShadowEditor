import UI from '../ui/UI';
import AppPlayer from '../core/AppPlayer';

/**
 * 播放器面板
 * @author mrdoob / http://mrdoob.com/
 */
function Player(app) {
    this.app = app;
    UI.Control.call(this, { parent: this.app.container });
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