import UI from '../../ui/UI';

/**
 * 日志面板
 * @author tengge / https://github.com/tengge1
 */
function LogPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

LogPanel.prototype = Object.create(UI.Control.prototype);
LogPanel.prototype.constructor = LogPanel;

LogPanel.prototype.render = function () {
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
            text: '日志'
        }, {
            xtype: 'br'
        }, {
            xtype: 'br'
        }]
    };

    var control = UI.create(data);
    control.render();
};

export default LogPanel;