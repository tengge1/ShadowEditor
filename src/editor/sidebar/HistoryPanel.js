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
            xtype: 'outliner',
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
};

export default HistoryPanel;