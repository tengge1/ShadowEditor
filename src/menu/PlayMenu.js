import UI from '../ui/UI';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function PlayMenu(editor) {

    var signals = editor.signals;

    var container = new UI.Panel();
    container.setClass('menu');

    var isPlaying = false;

    var title = new UI.Panel();
    title.setClass('title');
    title.setTextContent('启动');
    title.onClick(function () {

        if (isPlaying === false) {

            isPlaying = true;
            title.setTextContent('停止');
            signals.startPlayer.dispatch();

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