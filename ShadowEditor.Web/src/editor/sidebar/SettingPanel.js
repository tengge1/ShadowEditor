import UI from '../../ui/UI';

/**
 * 设置面板
 * @author tengge / https://github.com/tengge1
 */
function SettingPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

SettingPanel.prototype = Object.create(UI.Control.prototype);
SettingPanel.prototype.constructor = SettingPanel;

SettingPanel.prototype.render = function () {
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
            text: '设置'
        }, {
            xtype: 'br'
        }, {
            xtype: 'br'
        }]
    };

    var control = UI.create(data);
    control.render();
};

export default SettingPanel;