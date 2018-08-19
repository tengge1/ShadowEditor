import UI from '../../ui/UI';

/**
 * 历史记录面板
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */
function HistoryPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

HistoryPanel.prototype = Object.create(UI.Control.prototype);
HistoryPanel.prototype.constructor = HistoryPanel;

HistoryPanel.prototype.render = function () {
    var editor = this.app.editor;
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

    var control = UI.create(data);
    control.render();
};

export default HistoryPanel;