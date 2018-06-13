import Panel from '../ui/Panel';
import Row from '../ui/Row';
import HorizontalRule from '../ui/HorizontalRule';
import Text from '../ui/Text';
import Boolean from '../ui/Boolean';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function ViewMenu(editor) {

    var container = new Panel();
    container.setClass('menu');

    var title = new Panel();
    title.setClass('title');
    title.setTextContent('视图');
    container.add(title);

    var options = new Panel();
    options.setClass('options');
    container.add(options);

    // VR mode

    var option = new Row();
    option.setClass('option');
    option.setTextContent('VR模式');
    option.onClick(function () {

        if (renderer.vr.enabled) {

            editor.signals.enterVR.dispatch();

        } else {

            alert('WebVR不可用');

        }

    });
    options.add(option);

    return container;

};

export default ViewMenu;