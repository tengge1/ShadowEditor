import Control from '../../ui/Control';
import XType from '../../ui/XType';

/**
 * 设置面板
 * @author mrdoob / http://mrdoob.com/
 */
function SettingPanel(options) {
    Control.call(this, options);
    this.app = options.app;
};

SettingPanel.prototype = Object.create(Control.prototype);
SettingPanel.prototype.constructor = SettingPanel;

SettingPanel.prototype.render = function () {
    var editor = this.app.editor;
    var config = editor.config;

    var data = {
        xtype: 'div',
        id: 'settingPanel',
        parent: this.parent,
        cls: 'Panel',
        style: 'border-top: 0; padding-top: 20px;',
        children: [{
            xtype: 'row',
            id: 'themeRow',
            children: [{
                xtype: 'label',
                text: '主题'
            }, { // class
                xtype: 'select',
                options: {
                    'assets/css/light.css': '浅色',
                    'assets/css/dark.css': '深色'
                },
                value: config.getKey('theme'),
                style: 'width: 150px',
                onChange: function () {
                    var value = this.getValue();
                    editor.setTheme(value);
                    editor.config.setKey('theme', value);
                }
            }]
        }]
    };

    var control = UI.create(data);
    control.render();
};

export default SettingPanel;