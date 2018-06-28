import AddScriptCommand from '../command/AddScriptCommand';
import SetScriptValueCommand from '../command/SetScriptValueCommand';
import RemoveScriptCommand from '../command/RemoveScriptCommand';
import UI from '../ui/UI';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function ScriptPanel(app) {
    this.app = app;
    var eidtor = this.app.editor;

    var container = new UI.Panel();
    container.setDisplay('none');

    container.add(new UI.Text('脚本'));
    container.add(new UI.Break());
    container.add(new UI.Break());

    //

    var scriptsContainer = new UI.Row();
    container.add(scriptsContainer);

    var newScript = new UI.Button('新建');
    newScript.onClick(function () {

        var script = { name: '', source: 'function update( event ) {}' };
        editor.execute(new AddScriptCommand(editor.selected, script));

    });
    container.add(newScript);

    /*
	var loadScript = new UI.Button( 'Load' );
	loadScript.setMarginLeft( '4px' );
	container.add( loadScript );
	*/

    //

    var _this = this;

    function update() {

        scriptsContainer.clear();
        scriptsContainer.setDisplay('none');

        var object = editor.selected;

        if (object === null) {

            return;

        }

        var scripts = editor.scripts[object.uuid];

        if (scripts !== undefined) {

            scriptsContainer.setDisplay('block');

            for (var i = 0; i < scripts.length; i++) {

                (function (object, script) {

                    var name = new UI.Input(script.name).setWidth('130px').setFontSize('12px');
                    name.onChange(function () {

                        editor.execute(new SetScriptValueCommand(editor.selected, script, 'name', this.getValue()));

                    });
                    scriptsContainer.add(name);

                    var edit = new UI.Button('编辑');
                    edit.setMarginLeft('4px');
                    edit.onClick(function () {
                        _this.app.call('editScript', _this, object, script);
                    });
                    scriptsContainer.add(edit);

                    var remove = new UI.Button('删除');
                    remove.setMarginLeft('4px');
                    remove.onClick(function () {

                        if (confirm('确定吗？')) {

                            editor.execute(new RemoveScriptCommand(editor.selected, script));

                        }

                    });
                    scriptsContainer.add(remove);

                    scriptsContainer.add(new UI.Break());

                })(object, scripts[i])

            }

        }

    }

    this.app.on('objectSelected.ScriptPanel', function (object) {

        if (object !== null) {

            container.setDisplay('block');

            update();

        } else {

            container.setDisplay('none');

        }

    });

    this.app.on('scriptAdded.ScriptPanel', function () {
        update();
    });

    this.app.on('scriptRemoved.ScriptPanel', function () {
        update();
    });

    this.app.on('scriptChanged.ScriptPanel', function () {
        update();
    });

    return container;
};

export default ScriptPanel;