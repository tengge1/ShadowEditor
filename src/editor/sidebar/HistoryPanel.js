import Control from '../../ui/Control';
import XType from '../../ui/XType';

/**
 * 历史记录面板
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */
function HistoryPanel(options) {
    Control.call(this, options);
    this.app = options.app;
};

HistoryPanel.prototype = Object.create(Control.prototype);
HistoryPanel.prototype.constructor = HistoryPanel;

HistoryPanel.prototype.render = function () {
    var editor = this.app.editor;
    var config = editor.config;
    var history = editor.history;

    var _this = this;

    var ignoreObjectSelectedSignal = false;

    var data = {
        xtype: 'div',
        parent: this.parent,
        cls: 'Panel',
        children: [{
            xtype: 'label',
            text: '历史记录'
        }, {
            xtype: 'boolean',
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
        }, {
            xtype: 'br'
        }, {
            xtype: 'br'
        }, {
            xtype: 'outlinear',
            id: 'historyOutlinear',
            editor: editor,
            onChange: function () {
                ignoreObjectSelectedSignal = true;
                history.goToState(parseInt(this.getValue()));
                ignoreObjectSelectedSignal = false;
            }
        }]
    };

    var control = XType.create(data);
    control.render();

    var outliner = XType.getControl('historyOutlinear');

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
};

export default HistoryPanel;