import UI2 from '../ui2/UI';

/**
 * 历史记录面板
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */
function HistoryPanel(app) {
    this.app = app;
    var editor = this.app.editor;

    var config = editor.config;
    var history = editor.history;

    var container = new UI2.Div();

    container.add(new UI2.Text({
        text: '历史记录'
    }));

    //

    var _this = this;

    var persistent = new UI2.Boolean({
        value: config.getKey('settings/history'),
        text: '永久',
        style: 'position: absolute, right: 8px;',
        onChange: function () {
            var value = this.getValue();
            config.setKey('settings/history', value);
            if (value) {
                alert('历史记录将被保存在会话中。\n这会对使用材质的性能产生影响。');
                var lastUndoCmd = history.undos[history.undos.length - 1];
                var lastUndoId = (lastUndoCmd !== undefined) ? lastUndoCmd.id : 0;
                editor.history.enableSerialization(lastUndoId);
            } else {
                _this.app.call('historyChanged');
            }
        }
    });

    container.add(persistent);

    container.add(new UI2.Break(), new UI2.Break());

    var ignoreObjectSelectedSignal = false;

    var outliner = new UI2.Outliner({
        editor: editor,
        onChange: function () {
            ignoreObjectSelectedSignal = true;
            editor.history.goToState(parseInt(outliner.getValue()));
            ignoreObjectSelectedSignal = false;
        }
    });

    container.add(outliner);

    container.render();

    //

    var refreshUI = function () {

        var options = [];
        var enumerator = 1;

        function buildOption(object) {

            var option = document.createElement('div');
            option.value = object.id;

            return option;

        }

        (function addObjects(objects) {

            for (var i = 0, l = objects.length; i < l; i++) {

                var object = objects[i];

                var option = buildOption(object);
                option.innerHTML = '&nbsp;' + object.name;

                options.push(option);

            }

        })(history.undos);


        (function addObjects(objects, pad) {

            for (var i = objects.length - 1; i >= 0; i--) {

                var object = objects[i];

                var option = buildOption(object);
                option.innerHTML = '&nbsp;' + object.name;
                option.style.opacity = 0.3;

                options.push(option);

            }

        })(history.redos, '&nbsp;');

        outliner.setOptions(options);

    };

    refreshUI();

    // events
    this.app.on('editorCleared.HistoryPanel', function () {
        refreshUI();
    });

    this.app.on('historyChanged.HistoryPanel', function (cmd) {
        refreshUI();

        outliner.setValue(cmd !== undefined ? cmd.id : null);
    });

    return container.dom;
};

export default HistoryPanel;