import UI from '../ui/UI';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function PlayMenu(editor) {

    this.app = editor.app;

    var signals = editor.signals;

    var container = new UI.Panel();
    container.setClass('menu');

    var isPlaying = false;

    var title = new UI.Panel();
    title.setClass('title');
    title.setTextContent('启动');

    var _this = this;

    title.onClick(function () {

        if (isPlaying === false) {

            isPlaying = true;
            title.setTextContent('停止');

            _this.app.call('startPlayer');
        } else {

            isPlaying = false;
            title.setTextContent('启动');
            signals.stopPlayer.dispatch();

        }

    });
    container.add(title);

    return container;

};

export default PlayMenu;