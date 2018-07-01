import AddScriptCommand from '../command/AddScriptCommand';
import SetScriptValueCommand from '../command/SetScriptValueCommand';
import RemoveScriptCommand from '../command/RemoveScriptCommand';
import UI from '../ui/UI';

/**
 * 脚本面板
 * @author mrdoob / http://mrdoob.com/
 */
function ScriptPanel(app) {
    this.app = app;
    var editor = this.app.editor;

    var container = new UI.Div({
        cls: 'Panel',
        style: 'display: none'
    });

    container.add(new UI.Text({ text: '脚本' }));
    container.add(new UI.Break());
    container.add(new UI.Break());

    //

    var scriptsContainer = new UI.Row();
    container.add(scriptsContainer);

    var newScript = new UI.Button({
        text: '新建',
        onClick: function () {
            var script = { name: '', source: 'function update( event ) {}' };
            editor.execute(new AddScriptCommand(editor.selected, script));
        }
    });

    container.add(newScript);

    container.render();

    var _this = this;

    function update() {
        scriptsContainer.dom.parentElement.removeChild(scriptsContainer.dom);
        scriptsContainer.dom.style.display = 'none';

        var object = editor.selected;

        if (object === null) {
            return;
        }

        var scripts = editor.scripts[object.uuid];

        if (scripts !== undefined) {
            scriptsContainer.dom.style.display = 'block';

            for (var i = 0; i < scripts.length; i++) {

                (function (object, script) {

                    var name = new UI.Input({
                        text: script.name,
                        style: 'width: 130px; font-size: 12px;',
                        onChange: function () {
                            editor.execute(new SetScriptValueCommand(editor.selected, script, 'name', this.getValue()));
                        }
                    });

                    scriptsContainer.add(name);

                    var edit = new UI.Button({
                        text: '编辑',
                        style: 'margin-left: 4px;',
                        onClick: function () {
                            _this.app.call('editScript', _this, object, script);
                        }
                    });

                    scriptsContainer.add(edit);

                    var remove = new UI.Button({
                        text: '删除',
                        style: 'margin-left: 4px;',
                        onClick: function () {
                            if (confirm('确定吗？')) {
                                editor.execute(new RemoveScriptCommand(editor.selected, script));
                            }
                        }
                    });

                    scriptsContainer.add(remove);

                    scriptsContainer.add(new UI.Break());

                })(object, scripts[i])
            }
        }
        scriptsContainer.render();
    }

    this.app.on('objectSelected.ScriptPanel', function (object) {

        if (object !== null) {
            container.dom.style.display = 'block';
            update();
        } else {
            container.dom.style.display = 'none';
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