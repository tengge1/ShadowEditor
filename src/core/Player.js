import UI from '../ui/UI';
import AppPlayer from './AppPlayer';

/**
 * 播放器
 * @author mrdoob / http://mrdoob.com/
 */
function Player(app) {
    this.app = app;
    this.app.player = this;

    var container = new UI.Div({
        parent: this.app.container,
        id: 'player',
        style: 'position: absolute; display: none;'
    });
    container.render();

    this.app.player.container = container;

    var player = new AppPlayer();
    container.dom.appendChild(player.dom);

    this.app.editor.player = player;
};

export default Player;