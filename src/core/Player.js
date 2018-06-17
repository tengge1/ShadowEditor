import UI from '../ui/UI';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function Player(app) {
    this.app = app;
    var editor = this.app.editor;

    var signals = editor.signals;

    var container = new UI.Panel();
    container.setId('player');
    container.setPosition('absolute');
    container.setDisplay('none');

    //

    var player = new APP.Player();
    container.dom.appendChild(player.dom);

    window.addEventListener('resize', function () {

        player.setSize(container.dom.clientWidth, container.dom.clientHeight);

    });

    this.app.on('startPlayer.Player', function () {
        container.setDisplay('');

        player.load(editor.toJSON());
        player.setSize(container.dom.clientWidth, container.dom.clientHeight);
        player.play();
    });

    this.app.on('stopPlayer.Player', function () {
        container.setDisplay('none');

        player.stop();
        player.dispose();
    });

    return container;

};

export default Player;