import Panel from '../ui/Panel';
import Row from '../ui/Row';
import HorizontalRule from '../ui/HorizontalRule';
import Text from '../ui/Text';
import Boolean from '../ui/Boolean';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function StatusMenu(editor) {

    var container = new Panel();
    container.setClass('menu right');

    var autosave = new Boolean(editor.config.getKey('autosave'), '自动保存');
    autosave.text.setColor('#888');
    autosave.onChange(function () {

        var value = this.getValue();

        editor.config.setKey('autosave', value);

        if (value === true) {

            editor.signals.sceneGraphChanged.dispatch();

        }

    });
    container.add(autosave);

    editor.signals.savingStarted.add(function () {

        autosave.text.setTextDecoration('underline');

    });

    editor.signals.savingFinished.add(function () {

        autosave.text.setTextDecoration('none');

    });

    var version = new Text('r' + THREE.REVISION);
    version.setClass('title');
    version.setOpacity(0.5);
    container.add(version);

    return container;

};

export default StatusMenu;