import UI from '../ui/UI';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function StatusMenu(editor) {

    this.app = editor.app;

    var container = new UI.Panel();
    container.setClass('menu right');

    var autosave = new UI.Boolean(editor.config.getKey('autosave'), '自动保存');
    autosave.text.setColor('#888');
    autosave.onChange(function () {

        var value = this.getValue();

        editor.config.setKey('autosave', value);

        if (value === true) {

            editor.signals.sceneGraphChanged.dispatch();

        }

    });
    container.add(autosave);

    this.app.on('savingStarted.StatusMenu', function () {
        autosave.text.setTextDecoration('underline');
    });

    this.app.on('savingFinished.StatusMenu', function () {
        autosave.text.setTextDecoration('none');
    });

    var version = new UI.Text('r' + THREE.REVISION);
    version.setClass('title');
    version.setOpacity(0.5);
    container.add(version);

    return container;

};

export default StatusMenu;