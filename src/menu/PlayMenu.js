import Panel from '../ui/Panel';
import Row from '../ui/Row';
import HorizontalRule from '../ui/HorizontalRule';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function PlayMenu(editor) {

    var signals = editor.signals;

    var container = new Panel();
    container.setClass('menu');

    var isPlaying = false;

    var title = new Panel();
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